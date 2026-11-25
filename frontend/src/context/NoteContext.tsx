import React, { createContext, useContext } from 'react';
import { useNotes } from '../hooks/useNotes';

type NotesContextType = ReturnType<typeof useNotes>;

const NoteContext = createContext<NotesContextType | null>(null);

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notesState = useNotes();
  return <NoteContext.Provider value={notesState}>{children}</NoteContext.Provider>;
};

export function useNotesContext(): NotesContextType {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NoteProvider');
  }
  return context;
}
