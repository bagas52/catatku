const DB_NAME = 'catatku_alarm_db';
const DB_VERSION = 1;
const STORE_NAME = 'audio_files';
const AUDIO_KEY = 'alarm_audio';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveAlarmAudio(blob: Blob, name: string): Promise<void> {
  if (blob.size > MAX_SIZE) {
    throw new Error('Ukuran file melebihi batas 5MB.');
  }
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ blob, name, savedAt: Date.now() }, AUDIO_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function getAlarmAudio(): Promise<{ blob: Blob; name: string } | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(AUDIO_KEY);
    req.onsuccess = () => {
      db.close();
      const result = req.result;
      if (result && result.blob instanceof Blob) {
        resolve({ blob: result.blob, name: result.name });
      } else {
        resolve(null);
      }
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function deleteAlarmAudio(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(AUDIO_KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}
