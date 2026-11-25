import type { VercelRequest, VercelResponse } from '@vercel/node';
import { removeNote, clearAll, clearNotes } from './_lib/kv.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { noteId, clearAll: clear, clearNotes: clearNotesOnly } = req.body;

    if (clear) {
      await clearAll();
      return res.status(200).json({ ok: true, cleared: true });
    }

    if (clearNotesOnly) {
      await clearNotes();
      return res.status(200).json({ ok: true, notesCleared: true });
    }

    if (!noteId) {
      return res.status(400).json({ error: 'Missing noteId or clearAll' });
    }

    await removeNote(noteId);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('unsubscribe error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
