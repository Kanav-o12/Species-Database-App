// Frontend/scripts/db.js
const DB_NAME = "sba_offline_db";
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      // species (English)
      if (!db.objectStoreNames.contains("species_en")) {
        db.createObjectStore("species_en", { keyPath: "species_id" });
      }

      // species (Tetum)
      if (!db.objectStoreNames.contains("species_tet")) {
        db.createObjectStore("species_tet", { keyPath: "species_id" });
      }

      // media blobs + metadata
      if (!db.objectStoreNames.contains("media")) {
        db.createObjectStore("media", { keyPath: "media_id" });
      }

      // misc metadata (lastSync, bundleVersion, etc.)
      if (!db.objectStoreNames.contains("metadata")) {
        db.createObjectStore("metadata", { keyPath: "key" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(storeName, mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = fn(store);

    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function dbPut(storeName, value) {
  return withStore(storeName, "readwrite", (store) => store.put(value));
}

export async function dbGet(storeName, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGetAll(storeName) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function metaSet(key, value) {
  return dbPut("metadata", { key, value });
}

export async function metaGet(key) {
  const row = await dbGet("metadata", key);
  return row ? row.value : null;
}
