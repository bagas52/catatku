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
  const existing = await getNotes();
  const updated = existing.filter((n) => n.noteId !== note.noteId);
  updated.push(note);
  await setNotes(updated);
}

export async function removeNote(noteId: string) {
  const existing = await getNotes();
  await setNotes(existing.filter((n) => n.noteId !== noteId));
}

export async function clearAll() {
  await kv.del(SUB_KEY);
  await kv.del(NOTES_KEY);
}
