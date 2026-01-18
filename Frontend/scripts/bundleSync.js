/* Frontend/scripts/bundleSync.js
   Sync bundle from backend /api/bundle into IndexedDB (species + media blobs)
   Works standalone (no external libs).
*/

import { dbPut, dbGetAll, metaGet, metaSet } from "./db.js";

const DEFAULT_SYNC_OPTIONS = {
  baseUrl:
    typeof API_CONFIG !== "undefined" && API_CONFIG.baseUrl
      ? API_CONFIG.baseUrl
      : "http://127.0.0.1:5000",
  bundlePath: "/api/bundle",
  mediaConcurrency: 4,
  force: false,
  onProgress: null,
};

// ---------- Fetch helpers ----------
async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status} ${res.statusText}`);
  return res.json();
}

function normalizeMediaItem(raw, fallbackId) {
  const media_id = raw.media_id ?? raw.id ?? fallbackId;
  const download_link = raw.download_link ?? raw.media_url ?? raw.url;
  const streaming_link = raw.streaming_link ?? raw.stream_url ?? download_link;

  return {
    media_id,
    species_id: raw.species_id ?? null,
    species_name: raw.species_name ?? raw.scientific_name ?? "",
    media_type: raw.media_type ?? raw.type ?? "Unknown",
    download_link,
    streaming_link,
    alt_text: raw.alt_text ?? raw.alt ?? "",
  };
}

async function downloadAsBlob(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok)
    throw new Error(`Media download failed: ${res.status} ${res.statusText}`);
  const blob = await res.blob();
  const contentType =
    res.headers.get("content-type") || blob.type || "application/octet-stream";
  return { blob, contentType };
}

// ---------- Concurrency pool ----------
async function runPool(items, concurrency, worker) {
  let i = 0;

  async function runner() {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, concurrency) }, runner)
  );
}

// ---------- Helpers ----------
async function getMediaByDownloadLink(download_link) {
  const all = await dbGetAll("media");
  return all.find((m) => m?.download_link === download_link) || null;
}

async function putMany(storeName, items) {
  for (const item of items) await dbPut(storeName, item);
}

// ---------- Main sync ----------
export async function syncBundle(options = {}) {
  const opt = { ...DEFAULT_SYNC_OPTIONS, ...options };
  const progress = typeof opt.onProgress === "function" ? opt.onProgress : null;

  const bundleUrl = new URL(opt.bundlePath, opt.baseUrl).toString();

  const localVersion = await metaGet("bundle_version");
  progress?.({ phase: "version", message: `Local: ${localVersion ?? "none"}` });

  const bundle = await fetchJson(bundleUrl);
  const remoteVersion = bundle.version ?? bundle.bundle_version ?? 1;
  progress?.({ phase: "version", message: `Remote: ${remoteVersion}` });

  const speciesEn = bundle.species_en ?? [];
  const speciesTet = bundle.species_tet ?? [];
  const mediaRaw = bundle.media ?? [];

  if (
    !opt.force &&
    localVersion !== null &&
    Number(localVersion) === Number(remoteVersion)
  ) {
    progress?.({ phase: "done", message: "No changes detected." });
    return;
  }

  await putMany("species_en", speciesEn);
  await putMany("species_tet", speciesTet);

  // 🔹 Normalize media
  const normalizedMedia = mediaRaw
    .map((m, idx) => normalizeMediaItem(m, idx + 1))
    .filter((m) => m.download_link);

  // 🔹 🔹 🔹 IMPORTANT PART (Service Worker integration)
  if (navigator.serviceWorker?.controller && normalizedMedia.length) {
    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_MEDIA",
      urls: normalizedMedia.map((m) => m.download_link),
    });
  }

  // 🔹 Download & store media blobs
  let completed = 0;

  await runPool(normalizedMedia, opt.mediaConcurrency, async (m) => {
    const existing = await getMediaByDownloadLink(m.download_link);
    if (existing?.blob) return;

    try {
      const { blob, contentType } = await downloadAsBlob(m.download_link);

      await dbPut("media", {
        ...m,
        blob,
        contentType,
        cachedAt: new Date().toISOString(),
      });

      completed++;
      progress?.({
        phase: "media",
        current: completed,
        total: normalizedMedia.length,
        message: "Cached",
      });
    } catch (e) {
      await dbPut("media", {
        ...m,
        blob: null,
        error: String(e),
      });
    }
  });

  await metaSet("bundle_version", Number(remoteVersion));
  progress?.({ phase: "done", message: "Bundle sync finished" });
}

// Optional helper
export async function syncBundleOnceOnLoad(options = {}) {
  return syncBundle(options);
}
