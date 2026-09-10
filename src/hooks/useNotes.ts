import { useState, useMemo, useCallback } from 'react';
import { Note, FilterCategory } from '../types/note';
import { getStoredNotes, saveStoredNotes, getSampleNotes } from '../utils/storage';
import { playChimeSound } from '../utils/audioAlarm';
import { syncSubscriptionToBackend, removeNoteFromBackend } from '../utils/pushManager';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => getStoredNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('Kuliah'); // default start or 'Kuliah'

  const persistNotes = useCallback((newNotes: Note[]) => {
    setNotes(newNotes);
    saveStoredNotes(newNotes);
  }, []);

  const addNote = useCallback((data: Partial<Note>) => {
    const nowISO = new Date().toISOString();
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title?.trim() || 'Catatan Baru',
      content: data.content?.trim() || '',
      category: data.category || 'Kuliah',
      isPinned: Boolean(data.isPinned),
      createdAt: nowISO,
      updatedAt: nowISO,
      deadline: data.deadline,
      isCompleted: false,
      notified: false,
      notifyFlags: data.notifyFlags,
    };
    persistNotes([newNote, ...notes]);
    playChimeSound();

    // Sync to backend if Tugas with deadline + notifications enabled
    if (newNote.category === 'Tugas' && newNote.deadline && newNote.notifyFlags) {
      syncSubscriptionToBackend(newNote.id, newNote.title, newNote.deadline).catch(() => {});
    }
  }, [notes, persistNotes]);

  const updateNote = useCallback((id: string, data: Partial<Note>) => {
    const nowISO = new Date().toISOString();
    const oldNote = notes.find((n) => n.id === id);
    const updated = notes.map((n) => {
      if (n.id === id) {
        return {
          ...n,
          ...data,
          updatedAt: nowISO,
          notified: data.deadline !== n.deadline ? false : n.notified,
        };
      }
      return n;
    });
    persistNotes(updated);

    // Sync to backend if Tugas with deadline + notifications
    const updatedNote = updated.find((n) => n.id === id);
    if (updatedNote?.category === 'Tugas' && updatedNote.deadline) {
      if (updatedNote.notifyFlags) {
        syncSubscriptionToBackend(id, updatedNote.title, updatedNote.deadline).catch(() => {});
      } else if (oldNote?.notifyFlags) {
        // Notifications were disabled — remove from backend
        removeNoteFromBackend(id).catch(() => {});
      }
    }
  }, [notes, persistNotes]);

  const deleteNote = useCallback((id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    persistNotes(updated);

    // Remove from backend if it had notifications
    const deletedNote = notes.find((n) => n.id === id);
    if (deletedNote?.notifyFlags) {
      removeNoteFromBackend(id).catch(() => {});
    }
  }, [notes, persistNotes]);

  const toggleStar = useCallback((id: string) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    );
    persistNotes(updated);
  }, [notes, persistNotes]);

  const toggleComplete = useCallback((id: string) => {
    const target = notes.find((n) => n.id === id);
    const nextState = !target?.isCompleted;
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isCompleted: nextState } : n
    );
    persistNotes(updated);
    if (nextState) {
      playChimeSound();
    }
  }, [notes, persistNotes]);

  const markNotesNotified = useCallback((ids: string[]) => {
    const updated = notes.map((n) =>
      ids.includes(n.id) ? { ...n, notified: true } : n
    );
    persistNotes(updated);
  }, [notes, persistNotes]);

  const resetDefaults = useCallback(() => {
    const initial = getSampleNotes();
    persistNotes(initial);
  }, [persistNotes]);

  const enableNoteNotifications = useCallback((id: string) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, notifyFlags: { day: false, hour: false, thirtyMin: false } } : n
    );
    persistNotes(updated);
  }, [notes, persistNotes]);

  const disableNoteNotifications = useCallback((id: string) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, notifyFlags: undefined } : n
    );
    persistNotes(updated);
    removeNoteFromBackend(id).catch(() => {});
  }, [notes, persistNotes]);

  // Filter notes based on activeCategory and searchQuery
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Category filter
      if (activeCategory !== 'Semua' && note.category !== activeCategory) {
        return false;
      }

      // Real-time search by title and content
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = note.title.toLowerCase().includes(q);
        const matchBody = note.content.toLowerCase().includes(q);
        if (!matchTitle && !matchBody) return false;
      }

      return true;
    });
  }, [notes, activeCategory, searchQuery]);

  // Starred / Important notes (displayed separate / on top)
  const pinnedNotes = useMemo(() => {
    return filteredNotes
      .filter((n) => n.isPinned)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  }, [filteredNotes]);

  // Regular notes (non-pinned)
  const regularNotes = useMemo(() => {
    return filteredNotes
      .filter((n) => !n.isPinned)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  }, [filteredNotes]);

  // Counts for tabs
  const categoryCounts = useMemo(() => {
    return {
      Kuliah: notes.filter((n) => n.category === 'Kuliah').length,
      Tugas: notes.filter((n) => n.category === 'Tugas').length,
      Pribadi: notes.filter((n) => n.category === 'Pribadi').length,
      Semua: notes.length,
    };
  }, [notes]);

  return {
    notes,
    filteredNotes,
    pinnedNotes,
    regularNotes,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    categoryCounts,
    addNote,
    updateNote,
    deleteNote,
    toggleStar,
    toggleComplete,
    markNotesNotified,
    resetDefaults,
    enableNoteNotifications,
    disableNoteNotifications,
    setNotes: persistNotes,
  };
}
