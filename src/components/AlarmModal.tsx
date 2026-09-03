import React from 'react';
import { BellRing, CheckCircle2, Clock } from 'lucide-react';
import { Note } from '../types/note';
import { formatNoteDate } from '../utils/dateUtils';

interface AlarmModalProps {
  isOpen: boolean;
  notes: Note[];
  onDismiss: () => void;
  onComplete: (id: string) => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  isOpen,
  notes,
  onDismiss,
  onComplete,
}) => {
  if (!isOpen || notes.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs text-left">
      <div
        className="bg-surface w-full max-w-md rounded-lg shadow-xl border border-muted/30 p-5 text-left"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded bg-accent/15 text-accent flex items-center justify-center">
            <BellRing className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-base text-ink">
              Pengingat Tenggat Waktu
            </h3>
            <p className="text-xs text-muted">
              Tugas telah mendekati batas akhir pengumpulan
            </p>
          </div>
        </div>

        <div className="my-3 space-y-2 max-h-52 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-bg rounded border border-muted/20 flex items-start justify-between gap-2 text-left"
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-heading font-semibold text-xs sm:text-sm text-ink truncate">
                  {note.title}
                </h4>
                {note.deadline && (
                  <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>Tenggat: {formatNoteDate(note.deadline)}</span>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onComplete(note.id)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-accent/15 text-accent hover:bg-accent/25 rounded transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tandai Selesai</span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-muted/15">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full sm:w-auto px-4 py-1.5 text-xs sm:text-sm font-heading font-semibold bg-accent text-white hover:opacity-90 rounded transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            Matikan Alarm
          </button>
        </div>
      </div>
    </div>
  );
};
