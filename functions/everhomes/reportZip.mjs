import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

function reportDateFolder(inspectionDate) {
  const value = String(inspectionDate ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "Undated";
}

function safeReportFilename(value) {
  const basename = String(value ?? "Report.pdf")
    .replaceAll("\\", "/")
    .split("/")
    .pop();
  const safe = basename
    .replace(/[\u0000-\u001f<>:"|?*]/g, "_")
    .replace(/^\.+/, "")
    .trim()
    .slice(0, 200);
  return safe || "Report.pdf";
}

/**
 * Stream a SharePoint-ready report package into a ZIP destination. Original
 * asset streams are opened by the caller so the archive stays bounded without
 * buffering the complete photo set or ZIP in memory.
 */
export async function writeReportZip({
  zipAssets,
  marketingAssets = [],
  inspectionDate,
  reportFile,
  openAssetStream,
  destination,
  signal,
}) {
  if (!reportFile) throw new TypeError("reportFile is required for a report package.");
  const { ZipArchive } = await import("archiver");
  // Report originals are already compressed image formats. Recompressing them
  // consumed CPU while barely changing archive size, so store them directly.
  const archive = new ZipArchive({ store: true });
  const folder = reportDateFolder(inspectionDate);
  let sourceBytes = 0;
  let zipBytes = 0;

  const outputCounter = new Transform({
    transform(chunk, _encoding, callback) {
      zipBytes += chunk.length;
      callback(null, chunk);
    },
  });
  const completion = pipeline(archive, outputCounter, destination);
  let activeSource = null;

  const abortError = () => {
    if (signal?.reason instanceof Error) return signal.reason;
    const error = new Error("Report ZIP generation was aborted.");
    error.name = "AbortError";
    return error;
  };

  const failArchive = (error) => {
    if (activeSource && !activeSource.destroyed) activeSource.destroy(error);
    if (!archive.destroyed) archive.destroy(error);
  };

  const handleAbort = () => {
    const error = abortError();
    failArchive(error);
    if (!destination.destroyed) destination.destroy(error);
  };

  signal?.addEventListener("abort", handleAbort, { once: true });

  const appendAsset = async (asset, archivePath) => {
    if (signal?.aborted) throw abortError();
    const source = await openAssetStream(asset);
    if (!source || typeof source.pipe !== "function") {
      throw new Error(`Could not open report photo stream for ${archivePath}`);
    }

    activeSource = source;
    const sourceCounter = new Transform({
      transform(chunk, _encoding, callback) {
        sourceBytes += chunk.length;
        callback(null, chunk);
      },
    });
    archive.append(sourceCounter, { name: archivePath });
    try {
      // Wait until Archiver has consumed this source before opening the next
      // one. This keeps the number of live Storage streams bounded and avoids
      // listener and buffer growth as photo counts increase.
      await pipeline(source, sourceCounter);
    } finally {
      activeSource = null;
    }
  };

  try {
    for (const asset of zipAssets) {
      await appendAsset(asset, `${folder}/Photos/${asset.filename}`);
    }
    for (const asset of marketingAssets) {
      await appendAsset(asset, `${folder}/Photos/marketing/${asset.filename}`);
    }

    const resolvedReportFile = await reportFile;
    if (!Buffer.isBuffer(resolvedReportFile?.buffer)) {
      throw new TypeError("reportFile.buffer must be a PDF Buffer.");
    }
    archive.append(resolvedReportFile.buffer, {
      name: `${folder}/${safeReportFilename(resolvedReportFile.filename)}`,
    });

    const finalized = archive.finalize();
    await Promise.all([finalized, completion]);
    return { sourceBytes, zipBytes };
  } catch (error) {
    failArchive(error);
    destination.destroy(error);
    await completion.catch(() => {});
    throw error;
  } finally {
    signal?.removeEventListener("abort", handleAbort);
  }
}
