import webPush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webPush.setVapidDetails(
  'mailto:catatku-pwa@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

export async function sendPush(
  subscription: webPush.PushSubscription,
  payload: PushPayload
): Promise<'OK' | 'EXPIRED'> {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
    return 'OK';
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) {
      return 'EXPIRED';
    }
    throw err;
  }
}
