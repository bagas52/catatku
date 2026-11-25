import React from 'react';
import { Note } from '../types/note';
import { NoteItem } from './NoteItem';
import { Star, BookOpen } from 'lucide-react';

interface NoteListProps {
  pinnedNotes: Note[];
  regularNotes: Note[];
  searchQuery: string;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleStar: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onOpenCreate: () => void;
  onNotifyEnabled?: (id: string) => void;
  onNotifyDisabled?: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  pinnedNotes,
  regularNotes,
  searchQuery,
  onEdit,
  onDelete,
  onToggleStar,
  onToggleComplete,
  onOpenCreate,
  onNotifyEnabled,
  onNotifyDisabled,
}) => {
  const hasAnyNotes = pinnedNotes.length > 0 || regularNotes.length > 0;

  if (!hasAnyNotes) {
    return (
      <div className="py-16 text-left">
        <div className="w-10 h-10 mb-3 rounded bg-muted/10 flex items-center justify-center text-muted">
          <BookOpen className="w-5 h-5" />
        </div>
        {searchQuery ? (
          <p className="text-sm text-muted font-sans max-w-sm">
            Tidak ada catatan yang cocok dengan "{searchQuery}".
          </p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-ink font-heading font-medium">
              Belum ada catatan. Mulai catat materi kuliah hari ini.
            </p>
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-accent text-white rounded text-xs sm:text-sm font-heading font-semibold hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              + Tambah Catatan
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* 4. Star important note — shows separate/on top */}
      {pinnedNotes.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2 text-xs font-heading font-semibold text-accent">
            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
            <span>Penting ({pinnedNotes.length})</span>
          </div>

          <div className="bg-surface rounded border border-muted/20 divide-y divide-muted/10 overflow-hidden shadow-xs">
            {pinnedNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStar={onToggleStar}
                onToggleComplete={onToggleComplete}
                onNotifyEnabled={onNotifyEnabled}
                onNotifyDisabled={onNotifyDisabled}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Notes */}
      {regularNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <div className="mb-2 text-xs font-heading font-medium text-muted">
              <span>Catatan Lainnya ({regularNotes.length})</span>
            </div>
          )}

          <div className="bg-surface rounded border border-muted/20 divide-y divide-muted/10 overflow-hidden shadow-xs">
            {regularNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStar={onToggleStar}
                onToggleComplete={onToggleComplete}
                onNotifyEnabled={onNotifyEnabled}
                onNotifyDisabled={onNotifyDisabled}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
