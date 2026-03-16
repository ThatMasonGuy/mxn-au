import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { firebaseAdmin, db } from "../config/firebase.mjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

const ADMIN_EMAIL = "admin@everhomes.com.au";

const STATUS_META = {
  ok: { hex: "#10B981", label: "OK" },
  attention: { hex: "#F59E0B", label: "Needs Attention" },
  issue: { hex: "#F43F5E", label: "Issue Found" },
  na: { hex: "#64748B", label: "N/A" },
  unchecked: { hex: "#94A3B8", label: "Not Inspected" },
};

// ─── Schema registry ──────────────────────────────────────────────────────────
// Checklist definitions and per-workflow config live in checklistSchemas/.
// To add a new report type, create a new items file and register it in index.mjs.
// Zero changes needed here.
import { getSchema } from "./checklistSchemas/index.mjs";

// Maps inspection reportSubtype → human-readable title for the PDF cover page
const SUBTYPE_TITLES = {
  entry: "Entry Report",
  routine: "Routine Inspection",
  exit: "Exit Report",
  event: "Event Response",
};

// Aggregate item-level stats across all rooms
function computeItemStats(rooms) {
  let total = 0,
    ok = 0,
    attention = 0,
    issues = 0,
    na = 0,
    unchecked = 0;
  for (const room of rooms) {
    const items = room.items ?? {};
    for (const status of Object.values(items)) {
      total++;
      if (status === "ok") ok++;
      else if (status === "attention") attention++;
      else if (status === "issue") issues++;
      else if (status === "na") na++;
      else unchecked++;
    }
  }
  return { total, ok, attention, issues, na, unchecked };
}

export const generateInspectionReport = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 300,
    memory: "2GiB",
    cors: true,
    secrets: [RESEND_API_KEY],
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST")
      return res.status(405).json({ error: "POST only" });

    const { default: sharp } = await import("sharp");
    const { Resend } = await import("resend");

    const {
      reportType,
      reportSubtype,
      inspectionId,
      propertyAddress,
      inspectionDate,
      inspectorName,
      inspectorEmail,
      rooms,
      signatures,
      marketingPhotos,
    } = req.body;

    if (!inspectionId || !Array.isArray(rooms) || !rooms.length) {
      return res.status(400).json({ error: "Missing inspectionId or rooms" });
    }

    const schema = getSchema(reportType);

    // Resolve the document title: use reportSubtype for inspections, or fall back to schema default
    const docTitle =
      (reportSubtype && SUBTYPE_TITLES[reportSubtype]) || schema.docTitle;

    const docRef = db.collection(schema.collection).doc(inspectionId);

    try {
      // ── 1. Mark processing ────────────────────────────────────────
      await docRef.update({
        status: "processing",
        startedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      });

      // ── 2. Download + compress all photos ─────────────────────────
      // rooms[].photos = [{ url, caption, storagePath }]
      const photoAssets = [];

      for (const room of rooms) {
        for (let i = 0; i < (room.photos ?? []).length; i++) {
          const photo = room.photos[i];
          if (!photo?.url) continue;
          try {
            const resp = await fetch(photo.url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const raw = Buffer.from(await resp.arrayBuffer());

            const { data: compressed, info } = await sharp(raw)
              .rotate()
              .resize(1400, null, { withoutEnlargement: true })
              .jpeg({ quality: 75 })
              .toBuffer({ resolveWithObject: true });

            // info.width / info.height are the post-resize dimensions
            photoAssets.push({
              buffer: compressed,
              width: info.width,
              height: info.height,
              filename: `${room.label.replace(/[^a-zA-Z0-9]/g, "_")}_${i + 1}.jpg`,
              caption: photo.caption ?? "",
              roomLabel: room.label,
              roomId: room.id,
              storagePath: photo.storagePath ?? null,
            });
          } catch (err) {
            console.warn(
              `Photo fetch failed for room ${room.id}, photo ${i}:`,
              err.message,
            );
          }
        }
      }

      // ── 2b. Download signature images ──────────────────────────
      const sigAssets = { staff: null, tenants: [] };
      if (signatures?.staff?.signatureUrl) {
        try {
          const resp = await fetch(signatures.staff.signatureUrl);
          if (resp.ok) {
            const raw = Buffer.from(await resp.arrayBuffer());
            sigAssets.staff = {
              buffer: raw,
              name: signatures.staff.name ?? inspectorName ?? "",
              date: signatures.staff.date ?? inspectionDate ?? "",
            };
          }
        } catch (err) {
          console.warn("Staff signature download failed:", err.message);
        }
      }
      if (Array.isArray(signatures?.tenants)) {
        for (const tenant of signatures.tenants) {
          if (!tenant?.signatureUrl) {
            sigAssets.tenants.push(null);
            continue;
          }
          try {
            const resp = await fetch(tenant.signatureUrl);
            if (resp.ok) {
              const raw = Buffer.from(await resp.arrayBuffer());
              sigAssets.tenants.push({
                buffer: raw,
                name: tenant.name ?? "",
                date: tenant.date ?? "",
              });
            } else {
              sigAssets.tenants.push(null);
            }
          } catch (err) {
            console.warn("Tenant signature download failed:", err.message);
            sigAssets.tenants.push(null);
          }
        }
      }

      // ── 2c. Download marketing photos (uncompressed) ────────────
      const marketingAssets = []; // [{ buffer, filename, slotKey }]
      if (marketingPhotos && typeof marketingPhotos === "object") {
        for (const [slotKey, photos] of Object.entries(marketingPhotos)) {
          if (!Array.isArray(photos)) continue;
          for (let i = 0; i < photos.length; i++) {
            const mp = photos[i];
            if (!mp?.url) continue;
            try {
              const resp = await fetch(mp.url);
              if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
              const raw = Buffer.from(await resp.arrayBuffer());
              // Detect extension from content-type or default to jpg
              const ct = resp.headers.get("content-type") ?? "";
              const ext = ct.includes("png")
                ? "png"
                : ct.includes("webp")
                  ? "webp"
                  : "jpg";
              marketingAssets.push({
                buffer: raw,
                filename: `${slotKey}_${i + 1}.${ext}`,
                slotKey,
                storagePath: mp.storagePath ?? null,
              });
            } catch (err) {
              console.warn(
                `Marketing photo fetch failed for ${slotKey}[${i}]:`,
                err.message,
              );
            }
          }
        }
      }

      // ── 3. Build PDF ───────────────────────────────────────────────
      const pdfBuffer = await buildPDF({
        propertyAddress,
        inspectionDate,
        inspectorName,
        rooms,
        photoAssets,
        schema,
        docTitle,
        sigAssets,
        reportSubtype,
      });

      // ── 4. Build zip (room images + marketing) ───────────────────
      const zipBuffer = await buildZip(
        photoAssets,
        marketingAssets,
        propertyAddress,
        inspectionDate,
      );

      // ── 5. Save PDF to Storage (long-term record) ──────────────────
      const bucket = firebaseAdmin.storage().bucket();
      const pdfStoragePath = `${schema.collection}/${inspectionId}/report.pdf`;
      const pdfFile = bucket.file(pdfStoragePath);
      await pdfFile.save(pdfBuffer, {
        metadata: { contentType: "application/pdf" },
      });
      const [pdfUrl] = await pdfFile.getSignedUrl({
        action: "read",
        expires: Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
      });

      // ── 6. Send emails via Resend ──────────────────────────────────
      const resend = new Resend(RESEND_API_KEY.value());
      const dateLabel = formatDate(inspectionDate);
      const emailSubjectTitle = docTitle || schema.emailSubjectPrefix;
      const subject = `${emailSubjectTitle} — ${propertyAddress} — ${dateLabel}`;
      const cleanAddr = (propertyAddress ?? "Property").replace(
        /[^a-zA-Z0-9]/g,
        "_",
      );
      const filePrefix = emailSubjectTitle.replace(/\s+/g, "_");
      const zipName = `${filePrefix}_${cleanAddr}_${inspectionDate}_Photos.zip`;
      const pdfName = `${filePrefix}_${cleanAddr}_${inspectionDate}_Report.pdf`;
      const attachments = [
        { filename: zipName, content: zipBuffer },
        { filename: pdfName, content: pdfBuffer },
      ];

      const targets = [{ email: ADMIN_EMAIL, isAdmin: true }];
      if (inspectorEmail)
        targets.push({ email: inspectorEmail, isAdmin: false });

      const emailResults = await Promise.allSettled(
        targets.map((t) =>
          resend.emails.send({
            from: `${schema.fromName} <inspections@mxn.au>`,
            to: t.email,
            subject,
            reply_to: ADMIN_EMAIL,
            html: buildEmailHtml({
              propertyAddress,
              inspectionDate: dateLabel,
              inspectorName,
              rooms,
              isAdmin: t.isAdmin,
              schema,
              docTitle,
            }),
            attachments,
          }),
        ),
      );

      // Must confirm admin email sent before deleting photos
      const adminSend = emailResults[0];
      if (adminSend.status === "rejected" || adminSend.value?.error) {
        const reason =
          adminSend.reason?.message ??
          adminSend.value?.error?.message ??
          "Unknown";
        throw new Error(`Admin email send failed: ${reason}`);
      }

      console.log(
        "Email results:",
        emailResults.map((r, i) => `${targets[i].email}: ${r.status}`),
      );

      // ── 7. Delete individual photos from Storage ───────────────────
      const toDelete = [
        ...photoAssets.filter((p) => p.storagePath),
        ...marketingAssets.filter((p) => p.storagePath),
      ];
      // Also delete signature images
      if (signatures?.staff?.signatureStoragePath) {
        toDelete.push({ storagePath: signatures.staff.signatureStoragePath });
      }
      for (const t of signatures?.tenants ?? []) {
        if (t?.signatureStoragePath)
          toDelete.push({ storagePath: t.signatureStoragePath });
      }
      const deleteResults = await Promise.allSettled(
        toDelete.map((p) => bucket.file(p.storagePath).delete()),
      );
      const failedDeletes = deleteResults.filter(
        (r) => r.status === "rejected",
      ).length;
      if (failedDeletes) {
        console.warn(
          `${failedDeletes}/${toDelete.length} photo deletions failed — manual cleanup needed for ${schema.collection}/${inspectionId}/`,
        );
      }

      // ── 8. Mark complete ───────────────────────────────────────────
      await docRef.update({
        status: "complete",
        pdfUrl,
        pdfStoragePath,
        emailsSent: targets.map((t) => t.email),
        completedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({ success: true, pdfUrl });
    } catch (err) {
      console.error("generateInspectionReport failed:", err);
      await docRef
        .update({
          status: "failed",
          error: err.message,
          failedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        })
        .catch(() => {});
      return res
        .status(500)
        .json({ error: "Report generation failed", details: err.message });
    }
  },
);

// ─── PDF Builder ──────────────────────────────────────────────────────────────

async function buildPDF({
  propertyAddress,
  inspectionDate,
  inspectorName,
  rooms,
  photoAssets,
  schema,
  docTitle,
  sigAssets,
  reportSubtype,
}) {
  const { default: PDFDocument } = await import("pdfkit");
  const { default: sharp } = await import("sharp");

  // Load and trim logo so the baked border/extra whitespace gets stripped out
  let logoBuf = null;
  try {
    const rawLogo = readFileSync(
      join(__dirname, "..", "assets", "everhomes-logo.png"),
    );
    logoBuf = await sharp(rawLogo).trim().png().toBuffer();
  } catch {
    /* no logo */
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 60, left: 50, right: 50 },
      autoFirstPage: false,
      bufferPages: true,
      compress: true,
    });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const PAGE_W = 595;
    const MARGIN = 50;
    const CONTENT_W = PAGE_W - MARGIN * 2;
    const PAGE_H = 842;
    const FOOTER_ZONE = 30; // reserved for footer
    const BOTTOM = PAGE_H - MARGIN - FOOTER_ZONE;
    const PHOTO_COL_W = (CONTENT_W - 12) / 2;

    // ── Helpers ───────────────────────────────────────────────────────
    // Returns true if there's less than `needed` pts before the bottom margin,
    // and adds a new page if so. Always returns the current y.
    function ensureSpace(y, needed) {
      if (y + needed > BOTTOM) {
        doc.addPage();
        return MARGIN;
      }
      return y;
    }

    // Draw a small filled circle status dot
    function drawDot(x, y, color) {
      doc.circle(x, y, 3).fill(color);
    }

    function drawPill(x, y, text, textColor, bgColor) {
      const paddingX = 6;
      const paddingY = 3;
      const fontSize = 7;
      const radius = 4; // smaller radius = rounded rectangle, not full pill

      doc.font("Helvetica-Bold").fontSize(fontSize);

      const textW = doc.widthOfString(text);
      const textH = fontSize; // good enough for PDFKit here
      const badgeW = textW + paddingX * 2;
      const badgeH = textH + paddingY * 2;

      doc
        .roundedRect(x, y, badgeW, badgeH, radius)
        .fillAndStroke(bgColor, bgColor);

      doc.fillColor(textColor).text(text, x, y + paddingY, {
        width: badgeW,
        align: "center",
        lineBreak: false,
      });

      return badgeW;
    }

    function drawHeaderLogo() {
      if (!logoBuf) return;

      try {
        const logoW = 132;
        const logoH = 58;
        const logoX = PAGE_W - MARGIN - logoW + 76;
        const logoY = 36;

        doc.image(logoBuf, logoX, logoY, {
          fit: [logoW, logoH],
          align: "left",
          valign: "top",
        });
      } catch {
        /* skip */
      }
    }

    function drawFooter(pageNumber, totalPages) {
      const footerY = PAGE_H - 46;

      doc.save();

      doc
        .moveTo(MARGIN, footerY - 10)
        .lineTo(PAGE_W - MARGIN, footerY - 10)
        .strokeColor("#F1F5F9")
        .lineWidth(0.5)
        .stroke();

      doc.font("Helvetica").fontSize(7).fillColor("#CBD5E1");

      const leftText = "Everhomes Pty Ltd";
      const centerText = "ABN: 12 642 435 578";
      const rightText = `Page ${pageNumber} of ${totalPages}`;

      const centerW = doc.widthOfString(centerText);
      const rightW = doc.widthOfString(rightText);

      doc.text(leftText, MARGIN, footerY, { lineBreak: false });
      doc.text(centerText, PAGE_W / 2 - centerW / 2, footerY, {
        lineBreak: false,
      });
      doc.text(rightText, PAGE_W - MARGIN - rightW, footerY, {
        lineBreak: false,
      });

      doc.restore();
    }

    // Section label
    function sectionLabel(text, y) {
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor("#94A3B8")
        .text(text, MARGIN, y);
      return y + 13;
    }

    // ── Cover page ────────────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, PAGE_W, 6).fill("#7C3AED");

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#7C3AED")
      .text("EVERHOMES", MARGIN, 56);
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#94A3B8")
      .text(docTitle || schema.docTitle, MARGIN, 70);

    // Logo top-right
    drawHeaderLogo();

    doc
      .moveTo(MARGIN, 94)
      .lineTo(PAGE_W - MARGIN, 94)
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#1E293B")
      .text(propertyAddress || "Unknown Property", MARGIN, 112, {
        width: CONTENT_W,
      });
    const afterTitle = doc.y + 10;

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#64748B")
      .text(
        `Inspection Date:  ${formatDate(inspectionDate)}`,
        MARGIN,
        afterTitle,
      )
      .text(
        `Everhomes Staff:  ${inspectorName || "Unknown"}`,
        MARGIN,
        afterTitle + 16,
      )
      .text(
        `Report Generated: ${formatDate(new Date().toISOString().split("T")[0])}`,
        MARGIN,
        afterTitle + 32,
      );

    // Room-level stats
    const STATS_Y = afterTitle + 76;
    const stats = computeStats(rooms);
    const statItems = [
      { label: "TOTAL", val: stats.total, color: "#1E293B" },
      { label: "OK", val: stats.ok, color: "#10B981" },
      { label: "ATTENTION", val: stats.attention, color: "#F59E0B" },
      { label: "ISSUES", val: stats.issues, color: "#F43F5E" },
      { label: "UNCHECKED", val: stats.unchecked, color: "#94A3B8" },
    ];
    const STAT_W = CONTENT_W / statItems.length;

    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor("#94A3B8")
      .text("ROOM OVERVIEW", MARGIN, STATS_Y - 12);
    doc
      .rect(MARGIN, STATS_Y, CONTENT_W, 62)
      .fillAndStroke("#F8FAFC", "#E2E8F0");
    statItems.forEach((s, i) => {
      const x = MARGIN + i * STAT_W;
      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor(s.color)
        .text(String(s.val), x, STATS_Y + 8, {
          width: STAT_W,
          align: "center",
        });
      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#94A3B8")
        .text(s.label, x, STATS_Y + 40, { width: STAT_W, align: "center" });
    });

    // Item-level stats
    const ITEM_STATS_Y = STATS_Y + 90;
    const iStats = computeItemStats(rooms);
    const iStatItems = [
      { label: "ITEMS", val: iStats.total, color: "#1E293B" },
      { label: "OK", val: iStats.ok, color: "#10B981" },
      { label: "ATTENTION", val: iStats.attention, color: "#F59E0B" },
      { label: "ISSUES", val: iStats.issues, color: "#F43F5E" },
      { label: "N/A", val: iStats.na, color: "#64748B" },
    ];

    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor("#94A3B8")
      .text("CHECKLIST ITEMS", MARGIN, ITEM_STATS_Y - 12);
    doc
      .rect(MARGIN, ITEM_STATS_Y, CONTENT_W, 62)
      .fillAndStroke("#F8FAFC", "#E2E8F0");
    iStatItems.forEach((s, i) => {
      const x = MARGIN + i * STAT_W;
      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor(s.color)
        .text(String(s.val), x, ITEM_STATS_Y + 8, {
          width: STAT_W,
          align: "center",
        });
      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#94A3B8")
        .text(s.label, x, ITEM_STATS_Y + 40, {
          width: STAT_W,
          align: "center",
        });
    });

    // OOA rooms
    const ooaRooms = rooms.filter((r) => r.isOOA);
    if (ooaRooms.length) {
      doc
        .font("Helvetica-BoldOblique")
        .fontSize(9)
        .fillColor("#7C3AED")
        .text(
          `OOA Rooms: ${ooaRooms.map((r) => r.label).join(", ")}`,
          MARGIN,
          ITEM_STATS_Y + 80,
        );
    }

    // Flagged rooms summary on cover
    const flagged = rooms
      .filter((r) => r.status === "issue" || r.status === "attention")
      .sort((a, b) => (a.status === "issue" ? -1 : 1));
    if (flagged.length) {
      let fy = ITEM_STATS_Y + (ooaRooms.length ? 100 : 82);
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor("#94A3B8")
        .text("FLAGGED ROOMS", MARGIN, fy);
      fy += 12;

      for (const room of flagged) {
        fy = ensureSpace(fy, 20);
        const sc = STATUS_META[room.status]?.hex ?? "#94A3B8";
        drawDot(MARGIN + 5, fy + 5, sc);
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor("#1E293B")
          .text(room.label, MARGIN + 14, fy, {
            width: CONTENT_W * 0.55,
            lineBreak: false,
          });
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(sc)
          .text(
            STATUS_META[room.status]?.label ?? "",
            MARGIN + 14 + CONTENT_W * 0.55,
            fy,
            { lineBreak: false },
          );
        if (room.notes?.trim()) {
          doc
            .font("Helvetica-Oblique")
            .fontSize(8)
            .fillColor("#64748B")
            .text(room.notes.trim(), MARGIN + 14, fy + 11, {
              width: CONTENT_W - 14,
            });
          fy = doc.y + 6;
        } else {
          fy += 18;
        }
      }
    }

    // ── Room pages ────────────────────────────────────────────────────
    for (const room of rooms) {
      doc.addPage();

      const statusColor = STATUS_META[room.status]?.hex ?? "#94A3B8";
      const statusLabel = STATUS_META[room.status]?.label ?? "Not Inspected";

      // Header
      doc.rect(MARGIN, MARGIN, 4, 32).fill(statusColor);
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor("#1E293B")
        .text(room.label, MARGIN + 12, MARGIN, { width: CONTENT_W - 12 });

      // Tags row
      let tagX = MARGIN + 12;
      const tagY = MARGIN + 18;
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(statusColor)
        .text(statusLabel.toUpperCase(), tagX, tagY, { lineBreak: false });
      tagX += doc.widthOfString(statusLabel.toUpperCase()) + 12;
      if (room.isOOA) {
        doc
          .fillColor("#F43F5E")
          .text("· OOA", tagX, tagY, { lineBreak: false });
        tagX += doc.widthOfString("· OOA") + 12;
      }
      if (room.isEnsuite) {
        doc
          .fillColor("#0891B2")
          .text("· ENSUITE", tagX, tagY, { lineBreak: false });
      }

      doc
        .moveTo(MARGIN, 90)
        .lineTo(PAGE_W - MARGIN, 90)
        .strokeColor("#E2E8F0")
        .lineWidth(0.5)
        .stroke();

      let y = 102;

      // ── Checklist items ───────────────────────────────────────────
      const groups = schema.items[room.type] ?? schema.fallback;
      const itemStatuses = room.items ?? {};
      const itemInputs = room.inputs ?? {};

      // Tally item stats for this room (exclude input-type items — they have no status)
      const allItems = groups.flatMap((g) => g.items);
      const statusItems = allItems.filter((item) => !item.type);
      const roomItemStats = {
        ok: 0,
        attention: 0,
        issue: 0,
        na: 0,
        unchecked: 0,
      };
      for (const item of statusItems) {
        const s = itemStatuses[item.id] ?? "unchecked";
        roomItemStats[s] = (roomItemStats[s] ?? 0) + 1;
      }

      // Mini item summary bar
      y = ensureSpace(y, 22);
      const barItems = [
        { label: "OK", val: roomItemStats.ok, color: "#10B981" },
        { label: "ATTN", val: roomItemStats.attention, color: "#F59E0B" },
        { label: "ISSUE", val: roomItemStats.issue, color: "#F43F5E" },
        { label: "N/A", val: roomItemStats.na, color: "#64748B" },
        { label: "UNCHECKED", val: roomItemStats.unchecked, color: "#CBD5E1" },
      ];
      let bx = MARGIN;
      const BAR_H = 18;
      doc.rect(MARGIN, y, CONTENT_W, BAR_H).fill("#F8FAFC").stroke();
      const bItemW = CONTENT_W / barItems.length;
      barItems.forEach((b, i) => {
        const bix = MARGIN + i * bItemW;

        const valueFontSize = 8;
        const labelFontSize = 7;

        const valueY = y + Math.round((BAR_H - valueFontSize) / 2) - 0.5;
        const labelY = y + Math.round((BAR_H - labelFontSize) / 2) - 0.5;

        doc
          .font("Helvetica-Bold")
          .fontSize(valueFontSize)
          .fillColor(b.color)
          .text(String(b.val), bix, valueY, {
            width: bItemW * 0.4,
            align: "right",
            lineBreak: false,
          });

        doc
          .font("Helvetica")
          .fontSize(labelFontSize)
          .fillColor("#94A3B8")
          .text(b.label, bix + bItemW * 0.4 + 2, labelY, {
            width: bItemW * 0.6 - 2,
            lineBreak: false,
          });
      });
      y += BAR_H + 10;

      // Groups and their items
      const ITEM_ROW_H = 12;
      const GROUP_HEADER_H = 10;

      for (const group of groups) {
        // Group header
        y = ensureSpace(y, GROUP_HEADER_H + ITEM_ROW_H);
        doc
          .font("Helvetica-Bold")
          .fontSize(7)
          .fillColor("#94A3B8")
          .text(group.group.toUpperCase(), MARGIN, y, { lineBreak: false });
        if (group.sda) {
          doc.font("Helvetica-Bold").fontSize(7);
          const labelW = doc.widthOfString(group.group.toUpperCase());

          const badgeGap = 8;
          const badgeY = y - 2;

          drawPill(
            MARGIN + labelW + badgeGap,
            badgeY,
            "SDA",
            "#7C3AED",
            "#EDE9FE",
          );
        }
        y += GROUP_HEADER_H;

        for (let i = 0; i < group.items.length; i++) {
          const item = group.items[i];
          const isInput = item.type === "number" || item.type === "text";

          y = ensureSpace(y, ITEM_ROW_H);

          // Alternating row tint
          if (i % 2 === 0) {
            doc.rect(MARGIN, y, CONTENT_W, ITEM_ROW_H).fill("#FAFAFA");
          }

          if (isInput) {
            // Input-type item: show a data entry indicator and the recorded value
            const inputVal = itemInputs[item.id];
            const hasVal =
              inputVal !== undefined && inputVal !== null && inputVal !== "";
            const displayVal = hasVal ? String(inputVal) : "—";
            const valColor = hasVal ? "#0F172A" : "#CBD5E1";

            // Small square indicator instead of a status dot
            doc
              .rect(MARGIN + 4, y + 5, 6, 6)
              .fillAndStroke("#EFF6FF", "#BFDBFE");

            // Item label
            doc
              .font("Helvetica")
              .fontSize(8.5)
              .fillColor("#334155")
              .text(item.label, MARGIN + 16, y + 3.5, {
                width: CONTENT_W - 100,
                lineBreak: false,
                ellipsis: true,
              });

            // Value (right-aligned, in a light box)
            const valW = 72;
            doc
              .roundedRect(
                PAGE_W - MARGIN - valW,
                y + 2,
                valW,
                ITEM_ROW_H - 4,
                2,
              )
              .fill("#EFF6FF");
            doc
              .font("Helvetica-Bold")
              .fontSize(8)
              .fillColor(valColor)
              .text(displayVal, PAGE_W - MARGIN - valW, y + 4, {
                width: valW,
                align: "center",
                lineBreak: false,
              });
          } else {
            const status = itemStatuses[item.id] ?? "unchecked";
            const sc = STATUS_META[status]?.hex ?? "#94A3B8";
            const sl = STATUS_META[status]?.label ?? "Not Inspected";

            // Status dot
            drawDot(MARGIN + 7, y + 7.5, sc);

            // Item label
            const labelColor = status === "unchecked" ? "#94A3B8" : "#334155";
            doc
              .font(item.sda ? "Helvetica-Bold" : "Helvetica")
              .fontSize(8.5)
              .fillColor(labelColor)
              .text(item.label, MARGIN + 16, y + 3.5, {
                width: CONTENT_W - 100,
                lineBreak: false,
                ellipsis: true,
              });

            // Status label (right-aligned)
            const statusBoxW = 80;
            const statusRightPad = 2;
            const statusFontSize = 7.5;
            const statusTextY = y + (ITEM_ROW_H - statusFontSize) / 2 - 0.5;

            doc
              .font("Helvetica-Bold")
              .fontSize(statusFontSize)
              .fillColor(sc)
              .text(sl, PAGE_W - MARGIN - statusBoxW, statusTextY, {
                width: statusBoxW - statusRightPad,
                align: "right",
                lineBreak: false,
              });
          }

          y += ITEM_ROW_H;
        }
        y += 12; // gap between groups
      }

      y += 8;

      // ── Notes ─────────────────────────────────────────────────────
      if (room.notes?.trim()) {
        y = ensureSpace(y, 30);
        y = sectionLabel("NOTES", y);
        doc
          .font("Helvetica")
          .fontSize(9.5)
          .fillColor("#334155")
          .text(room.notes.trim(), MARGIN, y, { width: CONTENT_W });
        y = doc.y + 16;
      }

      // ── Photos ────────────────────────────────────────────────────
      const roomPhotos = photoAssets.filter((p) => p.roomId === room.id);
      if (roomPhotos.length) {
        y = ensureSpace(y, 40);
        y = sectionLabel("PHOTOS", y);

        const GUTTER = 12; // used for both horizontal and vertical spacing
        const COL_W = (CONTENT_W - GUTTER) / 2;

        const CAPTION_GAP = 4; // between image and caption
        const ROW_GAP = GUTTER; // vertical gap between rows = same as horizontal gutter
        const MAX_IMG_H = 320; // tweak: max height for an image in a row (prevents a single portrait taking the whole page)

        doc.font("Helvetica-Oblique").fontSize(7.5);

        for (let i = 0; i < roomPhotos.length; i += 2) {
          const pair = roomPhotos.slice(i, i + 2);

          // Measure captions
          const captionHeights = pair.map((ph) =>
            ph.caption?.trim()
              ? doc.heightOfString(ph.caption.trim(), { width: COL_W }) + 2
              : 0,
          );

          // Compute scaled image heights at COL_W (preserve aspect ratio)
          const imgHeights = pair.map((ph) => {
            const w = ph.width || 1;
            const h = ph.height || 1;
            const scaled = (h / w) * COL_W;
            return Math.min(scaled, MAX_IMG_H);
          });

          const rowImgH = Math.max(...imgHeights, 0);
          const rowCaptionH = Math.max(...captionHeights, 0);

          // only add caption space if we actually have captions in this row
          const captionBlockH = rowCaptionH ? CAPTION_GAP + rowCaptionH : 0;

          const needed = rowImgH + captionBlockH + ROW_GAP;

          // If this row won't fit, push it to next page automatically
          y = ensureSpace(y, needed);

          // Render images (width only, let PDFKit keep aspect)
          for (let j = 0; j < pair.length; j++) {
            const ph = pair[j];
            const x = MARGIN + j * (COL_W + GUTTER);

            try {
              // fit inside COL_W x rowImgH (contain), anchored at top-left
              doc.image(ph.buffer, x, y, {
                fit: [COL_W, rowImgH],
                align: "center",
                valign: "top",
              });
            } catch {
              /* skip failed embed */
            }
          }

          // Captions under images
          if (rowCaptionH) {
            const captionY = y + rowImgH + CAPTION_GAP;

            for (let j = 0; j < pair.length; j++) {
              const ph = pair[j];
              if (!ph.caption?.trim()) continue;

              const x = MARGIN + j * (COL_W + GUTTER);
              try {
                doc
                  .font("Helvetica-Oblique")
                  .fontSize(7.5)
                  .fillColor("#94A3B8")
                  .text(ph.caption.trim(), x, captionY, { width: COL_W });
              } catch {
                /* skip */
              }
            }
          }

          doc
            .moveTo(MARGIN, y + rowImgH + captionBlockH + ROW_GAP / 2)
            .lineTo(PAGE_W - MARGIN, y + rowImgH + captionBlockH + ROW_GAP / 2)
            .strokeColor("#F1F5F9")
            .lineWidth(0.5)
            .stroke();

          y += needed;
        }
      }

      if (
        !room.notes?.trim() &&
        !roomPhotos.length &&
        statusItems.length === 0
      ) {
        doc
          .font("Helvetica-Oblique")
          .fontSize(10)
          .fillColor("#CBD5E1")
          .text(
            "No checklist items, notes, or photos recorded for this room.",
            MARGIN,
            y,
          );
      }
    }

    // ── Signatures page ────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, PAGE_W, 6).fill("#7C3AED");

    // Header with logo
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#7C3AED")
      .text("EVERHOMES", MARGIN, 56);
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#94A3B8")
      .text("Signatures & Declaration", MARGIN, 70);
    drawHeaderLogo();
    doc
      .moveTo(MARGIN, 94)
      .lineTo(PAGE_W - MARGIN, 94)
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .stroke();

    // Property context
    let sy = 108;
    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor("#1E293B")
      .text(propertyAddress || "Unknown Property", MARGIN, sy, {
        width: CONTENT_W,
      });
    sy = doc.y + 4;
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#64748B")
      .text(
        `${docTitle || schema.docTitle} — ${formatDate(inspectionDate)}`,
        MARGIN,
        sy,
      );
    sy = doc.y + 18;

    doc
      .moveTo(MARGIN, sy)
      .lineTo(PAGE_W - MARGIN, sy)
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .stroke();
    sy += 16;

    // Staff signature block (always rendered)
    const staffName =
      sigAssets?.staff?.name || inspectorName || "Everhomes Staff";
    const staffDate = formatDate(sigAssets?.staff?.date || inspectionDate);
    const staffSigWidth = CONTENT_W * 0.45;

    sy = ensureSpace(sy, 170);
    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor("#94A3B8")
      .text("EVERHOMES STAFF", MARGIN, sy);
    sy += 14;

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#1E293B")
      .text(staffName, MARGIN, sy);
    sy += 14;
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor("#64748B")
      .text(`Date: ${staffDate}`, MARGIN, sy);
    sy += 20;

    if (sigAssets?.staff?.buffer) {
      try {
        doc.image(sigAssets.staff.buffer, MARGIN, sy, {
          fit: [staffSigWidth, 80],
          align: "left",
          valign: "top",
        });
      } catch (err) {
        console.warn("Failed to embed staff signature:", err.message);
      }
    }
    sy += 88;

    doc
      .moveTo(MARGIN, sy)
      .lineTo(MARGIN + staffSigWidth, sy)
      .strokeColor("#CBD5E1")
      .lineWidth(0.5)
      .stroke();
    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor("#94A3B8")
      .text("Signature", MARGIN, sy + 4);
    sy += 20;

    doc
      .font("Helvetica-Oblique")
      .fontSize(8)
      .fillColor("#64748B")
      .text(
        `I, ${staffName}, confirm that this ${(docTitle || "inspection").toLowerCase()} was completed on ${staffDate} and that the information recorded is accurate to the best of my knowledge.`,
        MARGIN,
        sy,
        { width: CONTENT_W },
      );
    sy = doc.y + 18;

    // Tenant signatures (entry/exit always shows 3 placeholders)
    if (reportSubtype === "entry" || reportSubtype === "exit") {
      sy = ensureSpace(sy, 40);
      doc
        .moveTo(MARGIN, sy)
        .lineTo(PAGE_W - MARGIN, sy)
        .strokeColor("#E2E8F0")
        .lineWidth(0.5)
        .stroke();
      sy += 14;
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor("#94A3B8")
        .text("TENANT SIGNATURES", MARGIN, sy);
      sy += 12;

      for (let ti = 0; ti < 3; ti++) {
        const tenant = sigAssets?.tenants?.[ti] ?? null;
        sy = ensureSpace(sy, 120);

        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor("#1E293B")
          .text(tenant?.name || `Tenant ${ti + 1}`, MARGIN, sy);
        sy += 12;

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor("#64748B")
          .text(
            `Date: ${tenant?.date ? formatDate(tenant.date) : "________________"}`,
            MARGIN,
            sy,
          );
        sy += 14;

        if (tenant?.buffer) {
          try {
            doc.image(tenant.buffer, MARGIN, sy, {
              fit: [CONTENT_W * 0.4, 62],
              align: "left",
              valign: "top",
            });
          } catch (err) {
            console.warn(
              `Failed to embed tenant ${ti + 1} signature:`,
              err.message,
            );
          }
        }
        sy += 68;

        doc
          .moveTo(MARGIN, sy)
          .lineTo(MARGIN + CONTENT_W * 0.4, sy)
          .strokeColor("#CBD5E1")
          .lineWidth(0.5)
          .stroke();
        doc
          .font("Helvetica")
          .fontSize(7)
          .fillColor("#94A3B8")
          .text("Signature", MARGIN, sy + 4);
        sy += 18;
      }
    }

    // Contact line
    sy = ensureSpace(sy, 40);
    doc
      .moveTo(MARGIN, sy)
      .lineTo(PAGE_W - MARGIN, sy)
      .strokeColor("#E2E8F0")
      .lineWidth(0.5)
      .stroke();
    sy += 14;
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#94A3B8")
      .text(
        "For any issues or concerns regarding this report, please contact ",
        MARGIN,
        sy,
        { width: CONTENT_W, continued: true },
      )
      .font("Helvetica-Bold")
      .fillColor("#7C3AED")
      .text("admin@everhomes.com.au", {
        link: "mailto:admin@everhomes.com.au",
      });

    // ── Footer on every real page ─────────────────────────────────────
    const range = doc.bufferedPageRange();

    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      drawFooter(i + 1, range.count);
    }

    doc.switchToPage(range.start + range.count - 1);

    doc.end();
  });
}

// ─── Zip Builder ──────────────────────────────────────────────────────────────

async function buildZip(
  photoAssets,
  marketingAssets,
  propertyAddress,
  inspectionDate,
) {
  // Now you can await the import
  const { default: archiver } = await import("archiver");

  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 6 } });
    const chunks = [];
    archive.on("data", (c) => chunks.push(c));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", reject);

    const cleanAddr = (propertyAddress ?? "Property")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "_");

    const baseFolder = `${cleanAddr}_${inspectionDate}_Photos`;

    for (const p of photoAssets) {
      archive.append(p.buffer, {
        name: `${baseFolder}/${p.filename}`,
      });
    }

    // Marketing photos in a subfolder (uncompressed originals)
    for (const mp of marketingAssets ?? []) {
      archive.append(mp.buffer, {
        name: `${baseFolder}/marketing/${mp.filename}`,
      });
    }

    archive.finalize();
  });
}

// ─── Email HTML ───────────────────────────────────────────────────────────────

function buildEmailHtml({
  propertyAddress,
  inspectionDate,
  inspectorName,
  rooms,
  isAdmin,
  schema,
  docTitle,
}) {
  const flagged = rooms
    .filter((r) => r.status === "issue" || r.status === "attention")
    .sort((a, b) => (a.status === "issue" ? -1 : 1));

  const iStats = computeItemStats(rooms);

  // Collect flagged individual items (issues first, then attention, max 20 for email)
  const flaggedItems = [];
  for (const room of rooms) {
    const itemStatuses = room.items ?? {};
    const groups = schema.items[room.type] ?? schema.fallback;
    for (const group of groups) {
      for (const item of group.items) {
        const status = itemStatuses[item.id];
        if (status === "issue" || status === "attention") {
          flaggedItems.push({
            roomLabel: room.label,
            itemLabel: item.label,
            status,
            sda: !!item.sda,
          });
        }
      }
    }
  }
  flaggedItems.sort((a, b) => (a.status === "issue" ? -1 : 1));
  const displayItems = flaggedItems.slice(0, 20);

  const flaggedRows = flagged
    .map(
      (r) => `
        <tr>
            <td style="padding:7px 12px;font-size:13px;color:#1E293B;border-bottom:1px solid #F1F5F9;">${r.label}</td>
            <td style="padding:7px 12px;font-size:12px;font-weight:700;color:${STATUS_META[r.status]?.hex};border-bottom:1px solid #F1F5F9;">${STATUS_META[r.status]?.label}</td>
            <td style="padding:7px 12px;font-size:12px;color:#64748B;border-bottom:1px solid #F1F5F9;">${r.notes || "—"}</td>
        </tr>`,
    )
    .join("");

  const itemRows = displayItems
    .map(
      (it) => `
        <tr>
            <td style="padding:5px 12px;font-size:12px;color:#64748B;border-bottom:1px solid #F1F5F9;">${it.roomLabel}</td>
            <td style="padding:5px 12px;font-size:12px;color:#1E293B;border-bottom:1px solid #F1F5F9;">
                ${it.itemLabel}${it.sda ? ' <span style="font-size:10px;font-weight:700;color:#7C3AED;background:#EDE9FE;padding:1px 5px;border-radius:4px;">SDA</span>' : ""}
            </td>
            <td style="padding:5px 12px;font-size:11px;font-weight:700;color:${STATUS_META[it.status]?.hex};border-bottom:1px solid #F1F5F9;">${STATUS_META[it.status]?.label}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;mso-line-height-rule:exactly;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1);">
 <div style="background:linear-gradient(135deg,#7C3AED 0%,#A855F7 100%);padding:0;">
   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr>
        <td style="padding:28px 32px 22px 32px;mso-line-height-rule:exactly;">
          <div style="font-size:10px;font-weight:800;color:rgba(255,255,255,.6);letter-spacing:.12em;text-transform:uppercase;line-height:1;margin:0;padding:0;">
            Everhomes
          </div>
          <div style="font-size:22px;color:#fff;font-weight:800;line-height:1.2;margin:6px 0 0 0;padding:0;">
            ${docTitle || schema.docTitle}
          </div>
        </td>
      </tr>
    </table>
  </div>
  <div style="padding:28px 32px 24px; mso-line-height-rule:exactly;">
    <p style="margin:0;padding:0 0 4px 0;font-size:17px;font-weight:700;color:#1E293B;">${propertyAddress}</p>
    <p style="margin:0;padding:0 0 20px 0;font-size:13px;color:#64748B;">${inspectionDate} &middot; ${inspectorName || "Unknown"}</p>

    <p style="margin:0 0 6px;font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;">Checklist Summary</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
    <tr>
        <td width="32%" valign="top" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 8px;text-align:center;">
        <div style="font-size:24px;font-weight:800;color:#F43F5E;line-height:1;">${iStats.issues}</div>
        <div style="font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;margin-top:5px;">Issues</div>
        </td>

        <td width="2%">&nbsp;</td>

        <td width="32%" valign="top" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 8px;text-align:center;">
        <div style="font-size:24px;font-weight:800;color:#F59E0B;line-height:1;">${iStats.attention}</div>
        <div style="font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;margin-top:5px;">Attention</div>
        </td>

        <td width="2%">&nbsp;</td>

        <td width="32%" valign="top" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 8px;text-align:center;">
        <div style="font-size:24px;font-weight:800;color:#10B981;line-height:1;">${iStats.ok}</div>
        <div style="font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:.06em;margin-top:5px;">OK</div>
        </td>
    </tr>
    </table>

    ${
      flagged.length
        ? `
      <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;">Flagged Rooms</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead><tr style="background:#F8FAFC;">
          <th style="padding:7px 12px;text-align:left;font-size:10px;color:#94A3B8;font-weight:700;text-transform:uppercase;">Room</th>
          <th style="padding:7px 12px;text-align:left;font-size:10px;color:#94A3B8;font-weight:700;text-transform:uppercase;">Status</th>
          <th style="padding:7px 12px;text-align:left;font-size:10px;color:#94A3B8;font-weight:700;text-transform:uppercase;">Notes</th>
        </tr></thead>
        <tbody>${flaggedRows}</tbody>
      </table>`
        : `<p style="color:#10B981;font-weight:600;font-size:13px;margin:0 0 20px;">&#10003; No rooms flagged with issues or attention items.</p>`
    }

    ${
      displayItems.length
        ? `
      <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;">Flagged Items${flaggedItems.length > 20 ? ` (showing 20 of ${flaggedItems.length})` : ""}</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead><tr style="background:#F8FAFC;">
          <th style="padding:6px 12px;text-align:left;font-size:9px;color:#94A3B8;font-weight:700;text-transform:uppercase;">Room</th>
          <th style="padding:6px 12px;text-align:left;font-size:9px;color:#94A3B8;font-weight:700;text-transform:uppercase;">Item</th>
          <th style="padding:6px 12px;text-align:left;font-size:9px;color:#94A3B8;font-weight:700;text-transform:uppercase;">Status</th>
        </tr></thead>
        <tbody>${itemRows}</tbody>
      </table>`
        : ""
    }

    <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;">Status Guide</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr>
        <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #F1F5F9;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10B981;margin-right:6px;vertical-align:middle;"></span><span style="font-weight:700;color:#10B981;">Good</span><span style="color:#94A3B8;font-size:11px;"> — Item is in acceptable condition</span></td>
        <td style="padding:6px 10px;font-size:12px;border-bottom:1px solid #F1F5F9;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#F59E0B;margin-right:6px;vertical-align:middle;"></span><span style="font-weight:700;color:#F59E0B;">Attention</span><span style="color:#94A3B8;font-size:11px;"> — Minor issue, note for follow-up</span></td>
      </tr>
      <tr>
        <td style="padding:6px 10px;font-size:12px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#F43F5E;margin-right:6px;vertical-align:middle;"></span><span style="font-weight:700;color:#F43F5E;">Issue</span><span style="color:#94A3B8;font-size:11px;"> — Requires action or repair</span></td>
        <td style="padding:6px 10px;font-size:12px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#64748B;margin-right:6px;vertical-align:middle;"></span><span style="font-weight:700;color:#64748B;">N/A</span><span style="color:#94A3B8;font-size:11px;"> — Not applicable to this property</span></td>
      </tr>
    </table>

    <p style="font-size:12px;color:#94A3B8;line-height:1.7;margin:0;">
      The full inspection report (PDF) and all photos (ZIP) are attached.
      ${isAdmin ? `<br>Everhomes Staff: ${inspectorName || "Unknown"}` : "A copy has also been sent to the Everhomes administration team."}
    </p>
  </div>
  <div style="padding:14px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;">
    <p style="margin:0;font-size:11px;color:#CBD5E1;">Everhomes Pty Ltd &middot; Automated message, please do not reply directly.</p>
  </div>
</div>
</body></html>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeStats(rooms) {
  return {
    total: rooms.length,
    ok: rooms.filter((r) => r.status === "ok").length,
    attention: rooms.filter((r) => r.status === "attention").length,
    issues: rooms.filter((r) => r.status === "issue").length,
    unchecked: rooms.filter((r) => !r.status || r.status === "unchecked")
      .length,
  };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
