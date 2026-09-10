import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setSubscription, addNote } from './_lib/kv.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription, noteId, title, deadline } = req.body;

    if (!subscription?.endpoint || !noteId || !deadline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await setSubscription(subscription);

    await addNote({
      noteId,
      title,
      deadline,
      notifyFlags: { day: false, hour: false, thirtyMin: false },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
