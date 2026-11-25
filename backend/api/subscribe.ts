import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setSubscription, upsertNotes } from './_lib/kv.js';
import type { PushNote } from './_lib/kv.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription, notes, noteId, title, deadline } = req.body;

    if (!subscription?.endpoint) {
      return res.status(400).json({ error: 'Missing subscription' });
    }

    // Format lama (satu catatan) tetap didukung untuk client yang belum di-update.
    const incoming: PushNote[] = Array.isArray(notes)
      ? notes
      : noteId && deadline
        ? [{ noteId, title: title || 'Tugas', deadline }]
        : [];

    for (const note of incoming) {
      if (!note?.noteId || !note?.deadline) {
        return res.status(400).json({ error: 'Invalid note payload' });
      }
    }

    await setSubscription(subscription);
    await upsertNotes(
      incoming.map((note) => ({
        noteId: note.noteId,
        title: note.title || 'Tugas',
        deadline: note.deadline,
        notifyFlags: note.notifyFlags || { day: false, hour: false, thirtyMin: false },
      }))
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
