import { kv } from '@vercel/kv';

export interface PushNote {
  noteId: string;
  title: string;
  deadline: string;
  notifyFlags: { day: boolean; hour: boolean; thirtyMin: boolean };
}

const SUB_KEY = 'push:subscription';
const NOTES_KEY = 'push:notes';

export async function getSubscription() {
  return kv.get<Record<string, unknown> | null>(SUB_KEY);
}

export async function setSubscription(sub: Record<string, unknown>) {
  await kv.set(SUB_KEY, sub);
}

export async function getNotes(): Promise<PushNote[]> {
  const raw = await kv.get<PushNote[]>(NOTES_KEY);
  return raw || [];
}

export async function setNotes(notes: PushNote[]) {
  await kv.set(NOTES_KEY, notes);
}

export async function addNote(note: PushNote) {
  await upsertNotes([note]);
}

export async function upsertNotes(incoming: PushNote[]) {
  if (!incoming.length) return;

  const existing = await getNotes();
  const byId = new Map(existing.map((n) => [n.noteId, n]));

  for (const note of incoming) {
    const previous = byId.get(note.noteId);
    // Edit judul/catatan tidak boleh mengirim ulang pengingat yang sudah terkirim.
    // Flag hanya di-reset ketika tenggatnya berubah.
    const notifyFlags =
      previous && previous.deadline === note.deadline
        ? previous.notifyFlags
        : note.notifyFlags;
    byId.set(note.noteId, { ...note, notifyFlags });
  }

  await setNotes(Array.from(byId.values()));
}

export async function removeNote(noteId: string) {
  const existing = await getNotes();
  await setNotes(existing.filter((n) => n.noteId !== noteId));
}

export async function clearNotes() {
  await kv.del(NOTES_KEY);
}

export async function clearAll() {
  await kv.del(SUB_KEY);
  await kv.del(NOTES_KEY);
}
