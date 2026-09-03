import React, { useState, useRef, useEffect } from 'react';
import { Star, MoreVertical, Edit3, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Note } from '../types/note';
import { formatNoteDate, checkDeadlineStatus } from '../utils/dateUtils';
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '../tokens/categoryColors';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onToggleStar: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onEdit,
  onDelete,
  onToggleStar,
  onToggleComplete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const borderColor = CATEGORY_COLORS[note.category] || DEFAULT_CATEGORY_COLOR;
  const deadlineStatus = checkDeadlineStatus(note.deadline, note.isCompleted);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  // Format meta date
  const metaDateStr = note.deadline
    ? formatNoteDate(note.deadline)
    : formatNoteDate(note.createdAt);

  return (
    <article
      onClick={() => onEdit(note)}
      style={{ borderLeftColor: borderColor }}
      className={`bg-surface hover:bg-muted/5 transition-colors border-l-[3px] py-3.5 px-4 sm:px-5 cursor-pointer border-b border-muted/15 relative text-left ${
        note.isCompleted ? 'opacity-70' : ''
      }`}
    >
      {/* Row 1: Title + Star */}
      <div className="flex items-start justify-between gap-3 text-left">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {note.category === 'Tugas' && onToggleComplete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(note.id);
              }}
              className="mt-0.5 text-muted hover:text-accent transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded"
              title={note.isCompleted ? 'Tandai belum selesai' : 'Tandai sudah selesai'}
            >
              {note.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-accent" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
          )}

          <h2
            className={`font-heading font-semibold text-[15px] sm:text-[16px] text-ink leading-snug tracking-tight text-left ${
              note.isCompleted ? 'line-through text-muted' : ''
            }`}
          >
            {note.title}
          </h2>
        </div>

        {/* Right: Star icon & options menu */}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Star Button */}
          <button
            type="button"
            onClick={() => onToggleStar(note.id)}
            className="p-1 rounded text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            title={note.isPinned ? 'Lepas bintang' : 'Beri bintang penting'}
            aria-label="Star"
          >
            <Star
              className={`w-4 h-4 ${
                note.isPinned ? 'fill-accent text-accent' : 'text-muted/60 hover:text-accent'
              }`}
            />
          </button>

          {/* Context Options */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded text-muted hover:text-ink hover:bg-muted/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              aria-label="Opsi catatan"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-surface rounded shadow-md border border-muted/20 py-1 z-20 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(note);
                  }}
                  className="w-full text-left px-3 py-1.5 text-ink hover:bg-muted/10 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(note);
                  }}
                  className="w-full text-left px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-muted/10 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Preview 2 lines */}
      {note.content && (
        <p className="font-note-body text-[15px] text-ink/80 mt-1.5 line-clamp-2 max-w-[70ch] leading-relaxed text-left">
          {note.content}
        </p>
      )}

      {/* Row 3: Meta line: Category · Date [Deadline] [warn badge if <24h] */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] sm:text-[13px] text-muted text-left">
        <span className="font-normal text-muted">{note.category}</span>
        <span>·</span>
        <span>{metaDateStr}</span>

        {/* Deadline Badge — EXCLUSIVELY uses --warn */}
        {deadlineStatus.isUrgent && (
          <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-medium bg-warn text-white shadow-xs">
            {deadlineStatus.label}
          </span>
        )}

        {note.isCompleted && (
          <span className="ml-auto text-[11px] text-accent font-medium">
            Selesai
          </span>
        )}
      </div>
    </article>
  );
};
