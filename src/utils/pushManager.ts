// Client-side push notification manager
// Handles permission, subscription, and backend sync

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
export const PUSH_STATE_EVENT = 'catatku:push-state-change';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

function broadcastPushState(enabled: boolean): void {
  window.dispatchEvent(
    new CustomEvent(PUSH_STATE_EVENT, { detail: { enabled } })
  );
}

async function postJson(path: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return false;
    // Vite dev server mengembalikan index.html untuk route yang tidak ada;
    // jangan anggap itu sebagai respons API yang berhasil.
    if (!(res.headers.get('content-type') || '').includes('application/json')) {
      return false;
    }
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}

export function isPushSupported(): boolean {
  return (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

export function getPermissionState(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isPushSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  try {
    const reg = await navigator.serviceWorker.ready;
    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!VAPID_PUBLIC_KEY) {
    console.warn('VAPID public key not configured');
    return null;
  }

  const granted = await requestNotificationPermission();
  if (!granted) return null;

  try {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    return subscription;
  } catch (err) {
    console.error('Push subscribe failed:', err);
    return null;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const sub = await getExistingSubscription();
    if (sub) {
      await sub.unsubscribe();
    }
    broadcastPushState(false);
    return true;
  } catch {
    return false;
  }
}

export interface PushNoteInput {
  noteId: string;
  title: string;
  deadline: string;
}

export async function syncSubscriptionToBackend(
  noteId: string,
  title: string,
  deadline: string
): Promise<boolean> {
  return syncNotesToBackend([{ noteId, title, deadline }]);
}

/** Daftarkan subscription + seluruh tugas yang ingin diingatkan ke backend. */
export async function syncNotesToBackend(notes: PushNoteInput[]): Promise<boolean> {
  try {
    const sub = (await getExistingSubscription()) || (await subscribeToPush());
    if (!sub) return false;

    const ok = await postJson('/api/subscribe', {
      subscription: sub.toJSON(),
      notes,
    });
    if (!ok) return false;

    broadcastPushState(true);
    return true;
  } catch (err) {
    console.error('Sync subscription failed:', err);
    return false;
  }
}

export async function removeNoteFromBackend(noteId: string): Promise<boolean> {
  const ok = await postJson('/api/unsubscribe', { noteId });
  if (!ok) console.warn('Remove note from backend failed');
  return ok;
}

/** Hapus daftar tugas di backend tanpa mematikan subscription (dipakai saat import/reset). */
export async function clearBackendNotes(): Promise<boolean> {
  return postJson('/api/unsubscribe', { clearNotes: true });
}

/** Matikan notifikasi: unsubscribe di browser dan hapus data subscription di backend. */
export async function disablePushNotifications(): Promise<boolean> {
  const unsubscribed = await unsubscribeFromPush();
  const cleared = await postJson('/api/unsubscribe', { clearAll: true });
  return unsubscribed && cleared;
}
