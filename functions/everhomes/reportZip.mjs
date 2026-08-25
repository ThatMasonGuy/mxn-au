import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

function reportPhotoFolder(propertyAddress, inspectionDate) {
  const cleanAddress = (propertyAddress ?? "Property")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  return `${cleanAddress}_${inspectionDate}_Photos`;
}

/**
 * Stream original report photos into a ZIP destination. Asset streams are
 * opened by the caller so this helper works with both Cloud Storage objects
 * and legacy approved download URLs without buffering the complete archive.
 */
export async function writeReportZip({
  zipAssets,
  marketingAssets = [],
  propertyAddress,
  inspectionDate,
  openAssetStream,
  destination,
  signal,
}) {
  const { ZipArchive } = await import("archiver");
  // Report originals are already compressed image formats. Recompressing them
  // consumed CPU while barely changing archive size, so store them directly.
  const archive = new ZipArchive({ store: true });
  const folder = reportPhotoFolder(propertyAddress, inspectionDate);
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
      await appendAsset(asset, `${folder}/${asset.filename}`);
    }
    for (const asset of marketingAssets) {
      await appendAsset(asset, `${folder}/marketing/${asset.filename}`);
    }

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
