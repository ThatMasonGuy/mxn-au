// functions/everhomes/generateInspectionReport.mjs

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { firebaseAdmin, db } from "../config/firebase.mjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { writeReportZip } from "./reportZip.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

const ADMIN_EMAIL = "admin@everhomes.com.au";
const ASSET_FETCH_TIMEOUT_MS = 30_000;

async function fetchAsset(url) {
  return fetch(url, { signal: AbortSignal.timeout(ASSET_FETCH_TIMEOUT_MS) });
}

function originalImageExtension(asset = {}) {
  const extension = asset.storagePath?.split(".").pop()?.toLowerCase();
  if (extension === "jpeg") return "jpg";
  return ["jpg", "png", "webp", "heic", "heif", "avif"].includes(extension)
    ? extension
    : "jpg";
}

function isValidIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

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
import { normaliseEmailDeliveries } from "./emailDelivery.mjs";
import { buildReportArtifactPaths, safeArchiveKey } from "./reportArtifacts.mjs";
import {
  emailActivityRecord,
  sanitiseActivityActor,
} from "./reportActivity.mjs";
import {
  collectMissingRequiredAnswers,
  computeItemStats,
  getActiveStatusItems,
  getRoomGroups,
  getRoomType,
  itemIsVisible,
} from "./reportLogic.mjs";

// Maps inspection reportSubtype → human-readable title for the PDF cover page
const SUBTYPE_TITLES = {
  entry: "Entry Report",
  routine: "Routine Inspection",
  exit: "Exit Report",
  event: "Event Response",
};

export const generateInspectionReport = onRequest(
  {
    region: "australia-southeast1",
    timeoutSeconds: 300,
    memory: "4GiB",
    cpu: 2,
    concurrency: 1,
    maxInstances: 3,
    cors: true,
    secrets: [RESEND_API_KEY],
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST")
      return res.status(405).json({ error: "POST only" });

    const {
      reportType,
      reportSubtype,
      inspectionId,
      draftAccessKey,
      regenerationAccessKey,
      regenerationActor,
      propertyAddress,
      inspectionDate,
      inspectorName,
      inspectorEmail,
      rooms,
      signatures,
      marketingPhotos,
    } = req.body ?? {};

    const requestBytes = Buffer.byteLength(JSON.stringify(req.body ?? {}), "utf8");
    if (requestBytes > 2 * 1024 * 1024) {
      return res.status(413).json({ error: "Report submission exceeds the 2 MB request limit." });
    }
    if (
      typeof inspectionId !== "string"
      || !/^[a-f0-9-]{36,64}$/i.test(inspectionId)
      || !Array.isArray(rooms)
      || !rooms.length
      || rooms.length > 100
    ) {
      return res.status(400).json({ error: "Missing inspectionId or rooms" });
    }
    const invalidRoom = rooms.find((room) =>
      !room
      || typeof room !== "object"
      || Array.isArray(room)
      || typeof room.id !== "string"
      || room.id.length > 256
      || typeof room.label !== "string"
      || room.label.length > 500
      || !Array.isArray(room.photos ?? [])
      || !room.items
      || typeof room.items !== "object"
      || Array.isArray(room.items)
      || !room.inputs
      || typeof room.inputs !== "object"
      || Array.isArray(room.inputs),
    );
    if (invalidRoom) {
      return res.status(400).json({ error: "A report section has an invalid shape." });
    }
    if (!regenerationAccessKey && new Set(rooms.map((room) => room.id)).size !== rooms.length) {
      return res.status(400).json({ error: "Report section identifiers must be unique." });
    }
    const requestedPhotoCount = rooms.reduce(
      (sum, room) => sum + (room.photos?.length ?? 0),
      0,
    ) + Object.values(
      marketingPhotos && typeof marketingPhotos === "object" && !Array.isArray(marketingPhotos)
        ? marketingPhotos
        : {},
    ).reduce(
      (sum, photos) => sum + (Array.isArray(photos) ? photos.length : 0),
      0,
    );
    const schema = getSchema(reportType);
    if (!schema) {
      return res.status(400).json({ error: "Unsupported report type." });
    }
    if (reportType === "inspection" && !SUBTYPE_TITLES[reportSubtype]) {
      return res.status(400).json({ error: "Unsupported inspection report subtype." });
    }
    if (schema.sdaFilter && !schema.pickerOptions.some((option) => option.key === reportSubtype)) {
      return res.status(400).json({ error: "Unsupported SDA design category." });
    }
    const roomTypes = rooms.map(getRoomType);
    const unsupportedRoomType = roomTypes.find((roomType) =>
      !Object.prototype.hasOwnProperty.call(schema.items, roomType)
    );
    if (!regenerationAccessKey && unsupportedRoomType) {
      return res.status(400).json({ error: `Unsupported report section type: ${unsupportedRoomType}` });
    }
    const missingRequiredSections = schema.requiredSections.filter(
      (sectionType) => !roomTypes.includes(sectionType),
    );
    if (!regenerationAccessKey && missingRequiredSections.length) {
      return res.status(400).json({
        error: `Required report sections are missing: ${missingRequiredSections.join(", ")}`,
      });
    }
    if (
      typeof propertyAddress !== "string"
      || !propertyAddress.trim()
      || typeof inspectionDate !== "string"
      || !isValidIsoDate(inspectionDate)
      || typeof inspectorName !== "string"
      || !inspectorName.trim()
      || propertyAddress.length > 1000
      || inspectionDate.length > 64
      || inspectorName.length > 200
      || typeof inspectorEmail !== "string"
      || inspectorEmail.length > 320
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inspectorEmail)
    ) {
      return res.status(400).json({ error: "Property, date, and inspector details are required." });
    }
    const missingRequiredAnswers = collectMissingRequiredAnswers(rooms, schema, reportSubtype);
    if (!regenerationAccessKey && missingRequiredAnswers.length) {
      return res.status(400).json({
        error: `${missingRequiredAnswers.length} required checklist answer(s) are missing.`,
        missingRequiredAnswers: missingRequiredAnswers.slice(0, 20).map(
          (missing) => `${missing.roomLabel}: ${missing.itemLabel}`,
        ),
      });
    }
    const generationId = randomUUID();
    const requestStartedAt = Date.now();
    const logStage = (stage, details = {}) => {
      const { rss, heapUsed, external, arrayBuffers } = process.memoryUsage();
      console.log(JSON.stringify({
        scope: "everhomes-report",
        stage,
        reportType,
        inspectionId,
        generationId,
        elapsedMs: Date.now() - requestStartedAt,
        rssBytes: rss,
        heapUsedBytes: heapUsed,
        externalBytes: external,
        arrayBufferBytes: arrayBuffers,
        ...details,
      }));
    };

    // Resolve the document title: use reportSubtype for inspections, or fall back to schema default
    const docTitle =
      (reportSubtype && SUBTYPE_TITLES[reportSubtype]) || schema.docTitle;

    const docRef = db.collection(schema.collection).doc(inspectionId);
    logStage("request.validated", {
      roomCount: rooms.length,
      roomPhotoCount: requestedPhotoCount,
    });

    // Reports are now created as resumable server-side drafts before the final
    // submission. The opaque draft key keeps the public report workflow
    // login-free without reopening anonymous Firestore writes.
    const draftSnapshot = await docRef.get();
    if (!draftSnapshot.exists) {
      return res.status(409).json({ error: "Report draft not found. Re-open your saved report and try again." });
    }
    const draftData = draftSnapshot.data();
    const isDraftSession = Boolean(draftAccessKey)
      && draftData.draftAccessKey === draftAccessKey;
    const isServerRegeneration = Boolean(regenerationAccessKey)
      && draftData.regenerationAccessKey === regenerationAccessKey;
    const activityActor = isServerRegeneration
      ? sanitiseActivityActor(regenerationActor, "admin")
      : sanitiseActivityActor({
          kind: "reporter",
          name: inspectorName,
          email: inspectorEmail,
        }, "reporter");
    // During the hosting migration, a browser that already loaded the old
    // frontend may create its legacy `pending` document just before rules are
    // tightened. Let that one existing submission finish; new documents cannot
    // be created this way once the new Firestore rules are deployed.
    const isLegacyPendingSubmission = !draftData.draftAccessKey
      && !draftAccessKey
      && draftData.status === "pending";

    if (!isDraftSession && !isServerRegeneration && !isLegacyPendingSubmission) {
      return res.status(403).json({ error: "This device does not have permission to submit that draft." });
    }
    const claimableStatus = isServerRegeneration
      ? draftData.status === "regenerating"
      : isLegacyPendingSubmission
        ? draftData.status === "pending"
        : ["draft", "failed", "pending"].includes(draftData.status);
    if (!claimableStatus) {
      return res.status(409).json({ error: "This report has already been submitted." });
    }

    // Persist a regeneration-safe submission payload with signature blobs
    // removed. The rendered signature files are stored separately in Storage.
    const storedPayload = JSON.parse(JSON.stringify({
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
    }));
    if (storedPayload.signatures?.staff?.signature) {
      delete storedPayload.signatures.staff.signature;
    }
    storedPayload.signatures?.tenants?.forEach((tenant) => {
      if (tenant?.signature) delete tenant.signature;
    });
    if (Buffer.byteLength(JSON.stringify(storedPayload), "utf8") > 700 * 1024) {
      return res.status(413).json({ error: "Report checklist data is too large to retain safely." });
    }

    // ── Deadline guard ────────────────────────────────────────────────
    // Do not make the report retryable while this invocation may still be
    // running: that would allow two generations to race and publish over one
    // another. The scheduled sweeper recovers the processing state after the
    // platform has definitely terminated an over-time invocation.
    let _deadlineTimer = null;
    const _armDeadline = () => {
      _deadlineTimer = setTimeout(async () => {
        console.error(`generateInspectionReport deadline reached for ${inspectionId}`);
        await docRef
          .update({
            generationDeadlineWarning: "The generator reached its internal deadline and is awaiting automatic recovery.",
            generationDeadlineReachedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          })
          .catch(() => {});
      }, 270_000);
    };

    let claimed = false;
    let published = false;
    const submissionActivityRef = docRef.collection("activity").doc();
    try {
      _armDeadline();
      // ── 1. Mark processing ────────────────────────────────────────
      await db.runTransaction(async (transaction) => {
        const currentSnapshot = await transaction.get(docRef);
        if (!currentSnapshot.exists) {
          const error = new Error("Report draft no longer exists.");
          error.status = 409;
          throw error;
        }
        const current = currentSnapshot.data();
        const currentDraftSession = Boolean(draftAccessKey)
          && current.draftAccessKey === draftAccessKey;
        const currentRegeneration = Boolean(regenerationAccessKey)
          && current.regenerationAccessKey === regenerationAccessKey;
        const currentLegacyPending = !current.draftAccessKey
          && !draftAccessKey
          && current.status === "pending";
        if (!currentDraftSession && !currentRegeneration && !currentLegacyPending) {
          const error = new Error("This device does not have permission to submit that draft.");
          error.status = 403;
          throw error;
        }
        const currentClaimableStatus = currentRegeneration
          ? current.status === "regenerating"
          : currentLegacyPending
            ? current.status === "pending"
            : ["draft", "failed", "pending"].includes(current.status);
        if (!currentClaimableStatus) {
          const error = new Error("This report has already been submitted.");
          error.status = 409;
          throw error;
        }
        transaction.update(docRef, {
          status: "processing",
          startedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          submittedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          submissionPayload: storedPayload,
          draftSnapshot: firebaseAdmin.firestore.FieldValue.delete(),
          draftBytes: firebaseAdmin.firestore.FieldValue.delete(),
          regenerationAccessKey: firebaseAdmin.firestore.FieldValue.delete(),
        });
        if (!isServerRegeneration) {
          transaction.set(submissionActivityRef, {
            kind: "lifecycle",
            type: "report.submitted",
            label: "Report submitted",
            actor: activityActor,
            createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          });
        }
      });
      claimed = true;
      logStage("generation.claimed");

      // ── 2. Download all assets in parallel ───────────────────────
      // Runs up to CONCURRENCY fetches at a time to avoid hammering Storage.
      // zipAssets — references to raw originals for the streamed download ZIP
      // photoAssets — small compressed buffers retained for the PDF only
      // Limit simultaneous image processing so decoded images stay bounded.
      const CONCURRENCY = 6;
      const { default: sharp } = await import("sharp");
      const bucket = firebaseAdmin.storage().bucket();
      const storagePrefix = `${schema.collection}/${inspectionId}/`;

      async function loadReportAsset(asset, storagePathKey = "storagePath", urlKey = "url") {
        const storagePath = asset?.[storagePathKey];
        if (typeof storagePath === "string" && storagePath.startsWith(storagePrefix)) {
          const [buffer] = await bucket.file(storagePath).download();
          return buffer;
        }

        if (isLegacyPendingSubmission && asset?.[urlKey]) {
          const parsedUrl = new URL(asset[urlKey]);
          if (!["firebasestorage.googleapis.com", "storage.googleapis.com"].includes(parsedUrl.hostname)) {
            throw new Error("Legacy report asset URL is not an approved Firebase Storage host.");
          }
          const response = await fetchAsset(asset[urlKey]);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return Buffer.from(await response.arrayBuffer());
        }

        throw new Error(`Report asset is missing a valid Storage path under ${storagePrefix}`);
      }
      async function openReportAssetStream(asset, storagePathKey = "storagePath", urlKey = "url") {
        const storagePath = asset?.[storagePathKey];
        if (typeof storagePath === "string" && storagePath.startsWith(storagePrefix)) {
          const source = bucket.file(storagePath).createReadStream();
          // GCS retry streams already register several lifecycle listeners;
          // Archiver and pipeline add more while consuming this one source.
          // Each source is still opened and closed serially by writeReportZip.
          source.setMaxListeners(Math.max(source.getMaxListeners(), 20));
          return source;
        }

        if (isLegacyPendingSubmission && asset?.[urlKey]) {
          const parsedUrl = new URL(asset[urlKey]);
          if (!["firebasestorage.googleapis.com", "storage.googleapis.com"].includes(parsedUrl.hostname)) {
            throw new Error("Legacy report asset URL is not an approved Firebase Storage host.");
          }
          const response = await fetchAsset(asset[urlKey]);
          if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
          return Readable.fromWeb(response.body);
        }

        throw new Error(`Report asset is missing a valid Storage path under ${storagePrefix}`);
      }
      let downloadedImageBytes = 0;
      const trackImageBytes = (buffer) => {
        downloadedImageBytes += buffer.length;
      };

      async function runConcurrent(tasks) {
        const results = [];
        let idx = 0;
        async function worker() {
          while (idx < tasks.length) {
            const i = idx++;
            results[i] = await tasks[i]();
          }
        }
        await Promise.all(Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, worker));
        return results;
      }

      // Build flat task list for all room photos
      const photoTasks = rooms.flatMap((room) =>
        (room.photos ?? []).map((photo, i) => async () => {
          if (!photo?.url && !photo?.storagePath) return null;
          try {
            const raw = await loadReportAsset(photo);
            trackImageBytes(raw);
            const filename = `${safeArchiveKey(room.id, "room")}_${i + 1}.${originalImageExtension(photo)}`;
            const { data: compressed, info } = await sharp(raw)
              .rotate()
              .resize(500, null, { withoutEnlargement: true })
              .jpeg({ quality: 60 })
              .toBuffer({ resolveWithObject: true });
            return {
              zip: {
                filename,
                roomLabel: room.label,
                roomId: room.id,
                storagePath: photo.storagePath ?? null,
                url: photo.url ?? null,
              },
              pdf: { buffer: compressed, width: info.width, height: info.height, filename, caption: photo.caption ?? "", roomLabel: room.label, roomId: room.id, storagePath: photo.storagePath ?? null },
            };
          } catch (err) {
            console.warn(`Photo fetch failed for room ${room.id}, photo ${i}:`, err.message);
            return null;
          }
        }),
      );

      const photoResults = await runConcurrent(photoTasks);
      const zipAssets = photoResults.filter(Boolean).map((r) => r.zip);
      const photoAssets = photoResults.filter(Boolean).map((r) => r.pdf);
      if (photoAssets.length !== photoTasks.length) {
        throw new Error(
          `Could not retrieve ${photoTasks.length - photoAssets.length} of ${photoTasks.length} report photos. The existing report was not replaced.`,
        );
      }

      // ── 2b. Download signature images (parallel) ────────────────
      const tenantList = Array.isArray(signatures?.tenants) ? signatures.tenants : [];
      const signatureIsExpected = (signature, requireNamedSignature = false) => Boolean(
        signature
        && (
          signature.signatureUrl
          || signature.signatureStoragePath
          || signature.signature
          || (requireNamedSignature && (signature.name || signature.date))
        )
      );
      async function downloadSignature(signature, label) {
        if (!signature?.signatureUrl && !signature?.signatureStoragePath) {
          if (signatureIsExpected(signature, label === "staff")) {
            console.warn(`Signature URL is missing for ${label}`);
          }
          return null;
        }
        try {
          return await loadReportAsset(signature, "signatureStoragePath", "signatureUrl");
        } catch (error) {
          console.warn(`Signature fetch failed for ${label}:`, error.message);
          return null;
        }
      }
      const [staffSigRaw, ...tenantSigRaws] = await Promise.all([
        downloadSignature(signatures?.staff, "staff"),
        ...tenantList.map((tenant, index) => downloadSignature(tenant, `tenant ${index + 1}`)),
      ]);
      const missingSignatures = [];
      if (signatureIsExpected(signatures?.staff, true) && !staffSigRaw) {
        missingSignatures.push("staff signature");
      }
      tenantList.forEach((tenant, index) => {
        if (signatureIsExpected(tenant) && !tenantSigRaws[index]) {
          missingSignatures.push(`tenant signature ${index + 1}`);
        }
      });
      if (missingSignatures.length) {
        throw new Error(
          `Could not retrieve ${missingSignatures.join(", ")}. The existing report was not replaced.`,
        );
      }

      const sigAssets = {
        staff: staffSigRaw ? {
          buffer: staffSigRaw,
          name: signatures.staff.name ?? inspectorName ?? "",
          date: signatures.staff.date ?? inspectionDate ?? "",
        } : null,
        tenants: tenantSigRaws.map((buf, ti) =>
          buf ? { buffer: buf, name: tenantList[ti]?.name ?? "", date: tenantList[ti]?.date ?? "" } : null
        ),
      };

      // ── 2c. Download marketing photos in parallel ────────────────
      const marketingEntries = marketingPhotos && typeof marketingPhotos === "object"
        ? Object.entries(marketingPhotos).flatMap(([slotKey, photos]) =>
            Array.isArray(photos)
              ? photos.map((mp, i) => ({ slotKey, mp, i }))
              : [],
          )
        : [];

      const marketingResults = await runConcurrent(
        marketingEntries.map(async ({ slotKey, mp, i }) => {
          try {
            if (!mp?.url && !mp?.storagePath) return { status: "fulfilled", value: null };
            const raw = await loadReportAsset(mp);
            trackImageBytes(raw);
            const safeSlotKey = safeArchiveKey(slotKey, "marketing");
            return {
              status: "fulfilled",
              value: {
                filename: `${safeSlotKey}_${i + 1}.${originalImageExtension(mp)}`,
                slotKey,
                storagePath: mp.storagePath ?? null,
                url: mp.url ?? null,
              },
            };
          } catch (reason) {
            return { status: "rejected", reason };
          }
        }),
      );

      const marketingAssets = marketingResults
        .map((r, idx) => {
          if (r.status === "rejected") {
            const { slotKey, i } = marketingEntries[idx];
            console.warn(`Marketing photo fetch failed for ${slotKey}[${i}]:`, r.reason?.message);
            return null;
          }
          return r.value;
        })
        .filter(Boolean);
      if (marketingAssets.length !== marketingEntries.length) {
        throw new Error(
          `Could not retrieve ${marketingEntries.length - marketingAssets.length} of ${marketingEntries.length} marketing photos. The existing report was not replaced.`,
        );
      }
      logStage("assets.validated", {
        roomPhotos: photoAssets.length,
        marketingPhotos: marketingAssets.length,
        imageBytes: downloadedImageBytes,
      });

      const dateLabel = formatDate(inspectionDate);
      const emailSubjectTitle = docTitle || schema.emailSubjectPrefix;
      const subjectAddress = propertyAddress.replace(/[\r\n]+/g, " ").slice(0, 500);
      const subject = `${emailSubjectTitle} — ${subjectAddress} — ${dateLabel}`;
      const cleanAddr = (propertyAddress ?? "Property").replace(
        /[^a-zA-Z0-9]/g,
        "_",
      );
      const filePrefix = emailSubjectTitle.replace(/\s+/g, "_");
      const pdfName = `${filePrefix}_${cleanAddr}_${inspectionDate}_Report.pdf`;
      const zipName = `${inspectionDate}_${filePrefix}_${cleanAddr}_Report.zip`
        .replace(/[^a-zA-Z0-9._-]/g, "_");

      // ── 3. Build/save PDF while streaming originals into a ZIP ───
      // These workloads are independent. Running them together lets native
      // image/PDF work use the second CPU while the archive waits on Storage.
      // ZIP sources remain serial and bounded inside writeReportZip.
      const { pdfStoragePath, zipStoragePath } = buildReportArtifactPaths(
        schema.collection,
        inspectionId,
        generationId,
      );
      const zipFile = bucket.file(zipStoragePath);
      const zipAbortController = new AbortController();

      const pdfBuild = buildPDF({
        propertyAddress,
        inspectionDate,
        inspectorName,
        rooms,
        photoAssets,
        schema,
        docTitle,
        sigAssets,
        reportSubtype,
      }).then((pdfBuffer) => {
        logStage("pdf.built", { pdfBytes: pdfBuffer.length });
        return pdfBuffer;
      });

      const pdfWork = pdfBuild.then(async (pdfBuffer) => {
        await bucket.file(pdfStoragePath)
          .save(pdfBuffer, { metadata: { contentType: "application/pdf" } });
        const [pdfUrl] = await bucket.file(pdfStoragePath).getSignedUrl({
          action: "read",
          expires: Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
        });
        logStage("pdf.saved", { pdfBytes: pdfBuffer.length, pdfStoragePath });
        return { pdfBuffer, pdfUrl };
      }).catch((error) => {
        zipAbortController.abort(error);
        throw error;
      });

      const zipWork = writeReportZip({
        zipAssets,
        marketingAssets,
        inspectionDate,
        reportFile: pdfBuild.then((pdfBuffer) => ({ filename: pdfName, buffer: pdfBuffer })),
        openAssetStream: openReportAssetStream,
        signal: zipAbortController.signal,
        destination: zipFile.createWriteStream({
          resumable: false,
          metadata: {
            contentType: "application/zip",
            contentDisposition: `attachment; filename="${zipName}"`,
          },
        }),
      }).then(async ({ sourceBytes, zipBytes }) => {
        const [photosDownloadUrl] = await zipFile.getSignedUrl({
          action: "read",
          expires: Date.now() + 90 * 24 * 60 * 60 * 1000,
        });
        logStage("zip.saved", {
          zipBytes,
          archivedImageBytes: sourceBytes,
          zipStoragePath,
        });
        return { photosDownloadUrl, sourceBytes, zipBytes };
      });

      const [pdfOutcome, zipOutcome] = await Promise.allSettled([pdfWork, zipWork]);
      if (pdfOutcome.status === "rejected" || zipOutcome.status === "rejected") {
        zipAbortController.abort(
          pdfOutcome.status === "rejected" ? pdfOutcome.reason : zipOutcome.reason,
        );
        throw pdfOutcome.status === "rejected" ? pdfOutcome.reason : zipOutcome.reason;
      }

      const { pdfBuffer, pdfUrl } = pdfOutcome.value;
      const zipResult = zipOutcome.value;
      const { photosDownloadUrl, sourceBytes: archivedImageBytes, zipBytes } = zipResult;
      logStage("artifacts.saved", {
        pdfBytes: pdfBuffer.length,
        zipBytes,
        archivedImageBytes,
        pdfStoragePath,
        zipStoragePath,
      });

      // ── 6. Send emails via Resend ──────────────────────────────────
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY.value());
      const attachments = [
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
              reportSubtype,
              photosDownloadUrl,
            }),
            attachments,
          }),
        ),
      );

      const emailDelivery = normaliseEmailDeliveries(emailResults, targets);
      const adminDelivery = emailDelivery.find((delivery) => delivery.isAdmin);
      if (!adminDelivery?.sent) {
        const reason = adminDelivery?.error ?? "Unknown";
        throw new Error(`Admin email send failed: ${reason}`);
      }
      const emailsSent = emailDelivery
        .filter((delivery) => delivery.sent)
        .map((delivery) => delivery.email);
      const emailFailures = emailDelivery
        .filter((delivery) => !delivery.sent)
        .map((delivery) => ({ email: delivery.email, error: delivery.error }));

      logStage("email.finished", {
        sentCount: emailsSent.length,
        failedCount: emailFailures.length,
        providerIds: emailDelivery
          .filter((delivery) => delivery.providerId)
          .map((delivery) => delivery.providerId),
      });

      const publishBatch = db.batch();
      publishBatch.set(docRef.collection("artifactGenerations").doc(generationId), {
        generationId,
        reportType,
        reportSubtype: reportSubtype ?? null,
        pdfUrl,
        pdfStoragePath,
        photosDownloadUrl,
        photosStoragePath: zipStoragePath,
        pdfBytes: pdfBuffer.length,
        zipBytes,
        emailsSent,
        emailFailures,
        publishedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      });
      publishBatch.set(docRef.collection("activity").doc(), {
        kind: "lifecycle",
        type: isServerRegeneration ? "report.regenerated" : "report.generated",
        label: isServerRegeneration ? "Report regenerated" : "Report generated",
        actor: activityActor,
        generationId,
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      });
      for (const delivery of emailDelivery) {
        publishBatch.set(docRef.collection("activity").doc(), {
          ...emailActivityRecord(delivery, {
            action: isServerRegeneration ? "regeneration" : "generation",
            actor: activityActor,
            generationId,
          }),
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        });
      }
      publishBatch.update(docRef, {
        status: "complete",
        pdfUrl,
        pdfStoragePath,
        photosDownloadUrl,
        photosStoragePath: zipStoragePath,
        generationId,
        emailsSent,
        emailFailures,
        emailProviderIds: emailDelivery
          .filter((delivery) => delivery.providerId)
          .map((delivery) => ({ email: delivery.email, id: delivery.providerId })),
        error: firebaseAdmin.firestore.FieldValue.delete(),
        regenerationError: firebaseAdmin.firestore.FieldValue.delete(),
        generationDeadlineWarning: firebaseAdmin.firestore.FieldValue.delete(),
        generationDeadlineReachedAt: firebaseAdmin.firestore.FieldValue.delete(),
        regenerationPhase: firebaseAdmin.firestore.FieldValue.delete(),
        regenerationPhaseStartedAt: firebaseAdmin.firestore.FieldValue.delete(),
        regenerationProgress: firebaseAdmin.firestore.FieldValue.delete(),
        regenerationRunId: firebaseAdmin.firestore.FieldValue.delete(),
        regenerationRequestedBy: firebaseAdmin.firestore.FieldValue.delete(),
        completedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      });
      await publishBatch.commit();
      logStage("report.published");
      published = true;
      clearTimeout(_deadlineTimer);
      _deadlineTimer = null;

      // ── 7. Delete individual photos from Storage ───────────────────
      const toDelete = [
        ...zipAssets.filter((p) => p.storagePath),
        ...marketingAssets.filter((p) => p.storagePath),
      ];
      // Note: zipStoragePath is intentionally NOT deleted here.
      // It persists so reports can be regenerated after individual photos are
      // removed. Signature files also persist because they are not in the ZIP.

      const sourcePhotoPrefixes = [
        `${storagePrefix}photos/`,
        `${storagePrefix}marketing/`,
      ];
      const restoredRegenerationPaths = toDelete
        .map((photo) => photo.storagePath)
        .filter((storagePath) =>
          storagePath
          && !sourcePhotoPrefixes.some((prefix) => storagePath.startsWith(prefix)),
        );
      const deleteResults = await Promise.allSettled([
        ...sourcePhotoPrefixes.map((prefix) => bucket.deleteFiles({ prefix })),
        ...restoredRegenerationPaths.map((storagePath) =>
          bucket.file(storagePath).delete({ ignoreNotFound: true }),
        ),
      ]);
      const failedDeletes = deleteResults.filter(
        (r) => r.status === "rejected",
      ).length;
      if (failedDeletes) {
        console.warn(
          `${failedDeletes}/${deleteResults.length} photo cleanup operations failed — manual cleanup needed for ${schema.collection}/${inspectionId}/`,
        );
      }

      // ── 8. Mark complete ───────────────────────────────────────────
      clearTimeout(_deadlineTimer);
      if (res.headersSent) return; // deadline fired while we were finishing up
      return res.status(200).json({
        success: true,
        pdfUrl,
        emailsSent,
        emailFailures,
      });
    } catch (err) {
      clearTimeout(_deadlineTimer);
      if (res.headersSent) return; // deadline already responded
      console.error("generateInspectionReport failed:", err);
      if (!claimed) {
        return res.status(err.status ?? 409).json({
          error: err.message ?? "Report could not be claimed for generation.",
        });
      }
      if (!published) {
        await firebaseAdmin.storage().bucket()
          .deleteFiles({ prefix: `${schema.collection}/${inspectionId}/generations/${generationId}/` })
          .catch(() => {});
      }
      const failureUpdate = isServerRegeneration && draftData.pdfUrl
        ? {
              status: "complete",
              regenerationError: err.message,
              regenerationPhase: "failed",
              regenerationFinishedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
              regenerationProgress: firebaseAdmin.firestore.FieldValue.delete(),
              regenerationRunId: firebaseAdmin.firestore.FieldValue.delete(),
              regenFailedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
              generationDeadlineWarning: firebaseAdmin.firestore.FieldValue.delete(),
              generationDeadlineReachedAt: firebaseAdmin.firestore.FieldValue.delete(),
            }
          : {
              status: "failed",
              error: err.message,
              failedAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
              generationDeadlineWarning: firebaseAdmin.firestore.FieldValue.delete(),
              generationDeadlineReachedAt: firebaseAdmin.firestore.FieldValue.delete(),
            };
      await docRef
        .update(failureUpdate)
        .catch(() => {});
      await docRef.collection("activity").add({
        kind: "lifecycle",
        type: isServerRegeneration ? "report.regeneration_failed" : "report.generation_failed",
        label: isServerRegeneration ? "Regeneration failed" : "Report generation failed",
        actor: activityActor,
        generationId,
        error: err.message ?? "Unknown generation failure",
        createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
      }).catch(() => {});
      return res
        .status(500)
        .json({ error: "Report generation failed", details: err.message });
    }
  },
);

// ─── PDF Builder ──────────────────────────────────────────────────────────────

export async function buildPDF({
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
    const iStats = computeItemStats(rooms, schema, reportSubtype);
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
      const groups = getRoomGroups(schema, room);
      const itemStatuses = room.items ?? {};
      const itemInputs = room.inputs ?? {};

      // Tally item stats for this room (exclude non-status types and failed showIf conditions)
      const statusItems = getActiveStatusItems(groups, itemStatuses, itemInputs, schema, reportSubtype);
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

      // Groups and their items. PDFKit can still wrap text when lineBreak is
      // false, so every row must be measured before it is drawn.
      const ITEM_ROW_MIN_H = 16;
      const ITEM_ROW_PAD_Y = 3;
      const ITEM_FONT_SIZE = 8.5;
      const GROUP_HEADER_H = 12;
      const INPUT_VALUE_W = 230;
      const INPUT_LABEL_W = CONTENT_W - INPUT_VALUE_W - 24;
      const STATUS_LABEL_W = CONTENT_W - 100;

      function measureTextHeight(text, font, fontSize, width) {
        doc.font(font).fontSize(fontSize);
        return doc.heightOfString(String(text), { width });
      }

      function getItemLayout(item) {
        const isInput =
          item.type === "number" ||
          item.type === "text" ||
          item.type === "date" ||
          item.type === "multiline";
        const isYesNo = item.type === "yesno";
        const labelFont = item.sda ? "Helvetica-Bold" : "Helvetica";
        const displayLabel = item.badges?.length
          ? `${item.badges.join("/")}: ${item.label}`
          : item.label;
        const labelW = isInput ? INPUT_LABEL_W : STATUS_LABEL_W;
        const labelH = measureTextHeight(
          displayLabel,
          labelFont,
          ITEM_FONT_SIZE,
          labelW,
        );

        let displayVal = "";
        let hasVal = false;
        let valueH = 0;

        if (isInput) {
          const inputVal = itemInputs[item.id];
          hasVal =
            inputVal !== undefined && inputVal !== null && inputVal !== "";
          displayVal = hasVal ? String(inputVal) : "—";
          valueH = measureTextHeight(
            displayVal,
            "Helvetica-Bold",
            8,
            INPUT_VALUE_W - 8,
          );
        }

        const rowH = Math.max(
          ITEM_ROW_MIN_H,
          Math.ceil(labelH + ITEM_ROW_PAD_Y * 2),
          isInput ? Math.ceil(valueH + ITEM_ROW_PAD_Y * 2 + 2) : 0,
        );

        return {
          isInput,
          isYesNo,
          labelFont,
          displayLabel,
          labelW,
          labelH,
          displayVal,
          hasVal,
          valueH,
          rowH,
        };
      }

      function centeredTextY(rowY, rowH, textH) {
        return rowY + Math.max(ITEM_ROW_PAD_Y, (rowH - textH) / 2);
      }

      for (const group of groups) {
        const visibleItems = group.items.filter((item) =>
          itemIsVisible(item, itemStatuses, itemInputs, schema, reportSubtype),
        );
        if (!visibleItems.length) continue;

        const firstItemLayout = getItemLayout(visibleItems[0]);

        // Group header
        y = ensureSpace(y, GROUP_HEADER_H + firstItemLayout.rowH);
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

        for (let i = 0; i < visibleItems.length; i++) {
          const item = visibleItems[i];
          const layout = i === 0 ? firstItemLayout : getItemLayout(item);

          y = ensureSpace(y, layout.rowH);

          if (layout.isInput) {
            // ── Input / multiline item ────────────────────────────
            const valColor = layout.hasVal ? "#0F172A" : "#CBD5E1";
            const isMultiline = item.type === "multiline";

            // Alternating row tint
            if (i % 2 === 0) {
              doc.rect(MARGIN, y, CONTENT_W, layout.rowH).fill("#FAFAFA");
            }

            // Small square indicator
            doc
              .rect(MARGIN + 4, y + layout.rowH / 2 - 3, 6, 6)
              .fillAndStroke("#EFF6FF", "#BFDBFE");

            // Item label (left side, fully visible)
            doc
              .font(layout.labelFont)
              .fontSize(ITEM_FONT_SIZE)
              .fillColor("#334155")
              .text(
                layout.displayLabel,
                MARGIN + 16,
                centeredTextY(y, layout.rowH, layout.labelH),
                {
                  width: layout.labelW,
                },
              );

            // Value box (right side, wraps safely when needed)
            doc
              .roundedRect(
                PAGE_W - MARGIN - INPUT_VALUE_W,
                y + 2,
                INPUT_VALUE_W,
                layout.rowH - 4,
                2,
              )
              .fill("#EFF6FF");
            doc
              .font("Helvetica-Bold")
              .fontSize(8)
              .fillColor(valColor)
              .text(
                layout.displayVal,
                PAGE_W - MARGIN - INPUT_VALUE_W + 4,
                isMultiline
                  ? y + ITEM_ROW_PAD_Y + 1
                  : centeredTextY(y, layout.rowH, layout.valueH),
                {
                  width: INPUT_VALUE_W - 8,
                  align: isMultiline ? "left" : "center",
                },
              );

          } else if (layout.isYesNo) {
            // ── Yes / No item ─────────────────────────────────────
            const val = itemInputs[item.id];
            const isYes = val === "yes";
            const isNo = val === "no";
            const answered = isYes || isNo;

            if (i % 2 === 0) {
              doc.rect(MARGIN, y, CONTENT_W, layout.rowH).fill("#FAFAFA");
            }

            // Diamond indicator instead of dot or square
            const dX = MARGIN + 7;
            const dY = y + layout.rowH / 2;
            doc
              .save()
              .translate(dX, dY)
              .path("M 0 -4 L 4 0 L 0 4 L -4 0 Z")
              .fill(answered ? (isYes ? "#10B981" : "#F43F5E") : "#CBD5E1")
              .restore();

            // Item label
            doc
              .font(layout.labelFont)
              .fontSize(ITEM_FONT_SIZE)
              .fillColor(answered ? "#334155" : "#94A3B8")
              .text(
                layout.displayLabel,
                MARGIN + 16,
                centeredTextY(y, layout.rowH, layout.labelH),
                {
                  width: layout.labelW,
                },
              );

            // Yes / No pill (right-aligned)
            if (answered) {
              const pillText = isYes ? "YES" : "NO";
              const pillColor = isYes ? "#10B981" : "#F43F5E";
              const pillBg = isYes ? "#D1FAE5" : "#FFE4E6";
              drawPill(
                PAGE_W - MARGIN - 36,
                y + (layout.rowH - 13) / 2,
                pillText,
                pillColor,
                pillBg,
              );
            } else {
              doc
                .font("Helvetica")
                .fontSize(7.5)
                .fillColor("#CBD5E1")
                .text("—", PAGE_W - MARGIN - 36, y + (layout.rowH - 7.5) / 2, {
                  width: 34,
                  align: "center",
                  lineBreak: false,
                });
            }

          } else {
            // ── Status item (ok / attention / issue / na / unchecked) ──
            if (i % 2 === 0) {
              doc.rect(MARGIN, y, CONTENT_W, layout.rowH).fill("#FAFAFA");
            }

            const status = itemStatuses[item.id] ?? "unchecked";
            const sc = STATUS_META[status]?.hex ?? "#94A3B8";
            const sl = STATUS_META[status]?.label ?? "Not Inspected";

            drawDot(MARGIN + 7, y + layout.rowH / 2, sc);

            const labelColor =
              status === "unchecked" ? "#94A3B8" : "#334155";
            doc
              .font(layout.labelFont)
              .fontSize(ITEM_FONT_SIZE)
              .fillColor(labelColor)
              .text(
                layout.displayLabel,
                MARGIN + 16,
                centeredTextY(y, layout.rowH, layout.labelH),
                {
                  width: layout.labelW,
                },
              );

            const statusBoxW = 80;
            const statusRightPad = 2;
            const statusFontSize = 7.5;
            const statusTextY = y + (layout.rowH - statusFontSize) / 2 - 0.5;

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

          y += layout.rowH;
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

// ─── Email HTML ───────────────────────────────────────────────────────────────

function buildEmailHtml({
  propertyAddress,
  inspectionDate,
  inspectorName,
  rooms,
  isAdmin,
  schema,
  docTitle,
  reportSubtype,
  photosDownloadUrl,
}) {
  const safeAddress = escapeHtml(propertyAddress);
  const safeInspectorName = escapeHtml(inspectorName || "Unknown");
  const flagged = rooms
    .filter((r) => r.status === "issue" || r.status === "attention")
    .sort((a, b) => (a.status === "issue" ? -1 : 1));

  const iStats = computeItemStats(rooms, schema, reportSubtype);

  // Collect flagged individual items (issues first, then attention, max 20 for email)
  // Excludes items whose showIf condition is not met.
  const flaggedItems = [];
  for (const room of rooms) {
    const itemStatuses = room.items ?? {};
    const itemInputs = room.inputs ?? {};
    const groups = getRoomGroups(schema, room);
    for (const group of groups) {
      for (const item of group.items) {
        if (!itemIsVisible(item, itemStatuses, itemInputs, schema, reportSubtype)) continue;
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
            <td style="padding:7px 12px;font-size:13px;color:#1E293B;border-bottom:1px solid #F1F5F9;">${escapeHtml(r.label)}</td>
            <td style="padding:7px 12px;font-size:12px;font-weight:700;color:${STATUS_META[r.status]?.hex};border-bottom:1px solid #F1F5F9;">${STATUS_META[r.status]?.label}</td>
            <td style="padding:7px 12px;font-size:12px;color:#64748B;border-bottom:1px solid #F1F5F9;">${escapeHtml(r.notes || "—")}</td>
        </tr>`,
    )
    .join("");

  const itemRows = displayItems
    .map(
      (it) => `
        <tr>
            <td style="padding:5px 12px;font-size:12px;color:#64748B;border-bottom:1px solid #F1F5F9;">${escapeHtml(it.roomLabel)}</td>
            <td style="padding:5px 12px;font-size:12px;color:#1E293B;border-bottom:1px solid #F1F5F9;">
                ${escapeHtml(it.itemLabel)}${it.sda ? ' <span style="font-size:10px;font-weight:700;color:#7C3AED;background:#EDE9FE;padding:1px 5px;border-radius:4px;">SDA</span>' : ""}
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
    <p style="margin:0;padding:0 0 4px 0;font-size:17px;font-weight:700;color:#1E293B;">${safeAddress}</p>
    <p style="margin:0;padding:0 0 20px 0;font-size:13px;color:#64748B;">${escapeHtml(inspectionDate)} &middot; ${safeInspectorName}</p>

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

    <p style="font-size:12px;color:#94A3B8;line-height:1.7;margin:0 0 16px;">
      The full inspection report (PDF) is attached to this email.
      ${isAdmin ? `<br>Everhomes Staff: ${safeInspectorName}` : "A copy has also been sent to the Everhomes administration team."}
    </p>

    ${photosDownloadUrl ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
      <tr>
        <td>
          <a href="${escapeHtml(photosDownloadUrl)}" style="display:inline-block;background:#7C3AED;color:#fff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:8px;">
            &#8595; Download Report Package (ZIP)
          </a>
          <p style="margin:8px 0 0;font-size:11px;color:#CBD5E1;">Includes the PDF and original photos in a SharePoint-ready date folder. Link expires in 90 days.</p>
        </td>
      </tr>
    </table>` : ""}
  </div>
  <div style="padding:14px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;">
    <p style="margin:0;font-size:11px;color:#CBD5E1;">Everhomes Pty Ltd &middot; Automated message, please do not reply directly.</p>
  </div>
</div>
</body></html>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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
