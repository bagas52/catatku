import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSubscription, getNotes, setNotes, clearAll } from '../_lib/kv.js';
import { sendPush } from '../_lib/webpush.js';

export const config = {
  maxDuration: 30,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const subscription = await getSubscription();
    const notes = await getNotes();

    if (!subscription || !notes.length) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    const now = Date.now();
    const results: { noteId: string; sent: string }[] = [];
    let updated = false;

    for (const note of notes) {
      note.notifyFlags = note.notifyFlags || { day: false, hour: false, thirtyMin: false };
      const deadlineMs = new Date(note.deadline).getTime();
      const diffMs = deadlineMs - now;
      const diffMin = diffMs / (1000 * 60);

      // Tiap pengingat hanya aktif di jendela waktu sendiri agar tidak terkirim
      // bertumpukan (misal tugas dibuat 10 menit sebelum tenggat).
      const checks = [
        { key: 'day' as const, min: 60, max: 1440, label: 'Besok', emoji: '📅' },
        { key: 'hour' as const, min: 30, max: 60, label: '1 Jam Lagi', emoji: '⏰' },
        { key: 'thirtyMin' as const, min: 0, max: 30, label: '30 Menit Lagi', emoji: '🔔' },
      ];

      for (const check of checks) {
        if (
          !note.notifyFlags?.[check.key] &&
          diffMin > check.min &&
          diffMin <= check.max
        ) {
          const result = await sendPush(subscription as never, {
            title: `${check.emoji} CatatKu — ${check.label}`,
            body: `Tugas: ${note.title}`,
            icon: '/favicon-192.png',
            badge: '/favicon-192.png',
            tag: `catatku-${note.noteId}-${check.key}`,
            data: { noteId: note.noteId, url: '/' },
          });

          if (result === 'EXPIRED') {
            await clearAll();
            return res.status(200).json({ ok: true, subscriptionExpired: true });
          }

          note.notifyFlags[check.key] = true;
          updated = true;
          results.push({ noteId: note.noteId, sent: check.key });
        }
      }

      if (diffMs < 0) {
        updated = true;
      }
    }

    if (updated) {
      const cleaned = notes.filter((n) => new Date(n.deadline).getTime() > now);
      await setNotes(cleaned);
    }

    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error('cron check error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
