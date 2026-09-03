import React from 'react';
import { Trash2 } from 'lucide-react';
import { Note } from '../types/note';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  note,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs text-left">
      <div
        className="bg-surface w-full max-w-sm rounded-lg shadow-xl border border-muted/20 p-5"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="w-9 h-9 rounded bg-muted/10 text-ink flex items-center justify-center mb-3">
          <Trash2 className="w-4 h-4" />
        </div>

        <h3 className="font-heading font-semibold text-base text-ink mb-1 text-left">
          Hapus Catatan
        </h3>
        <p className="text-xs sm:text-sm text-muted mb-4 leading-relaxed text-left">
          Catatan <span className="font-medium text-ink">"{note.title}"</span> akan dihapus permanen.
        </p>

        {/* Buttons: active verbs "Hapus" & "Batal" */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-muted hover:text-ink rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs sm:text-sm font-heading font-semibold bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700 text-white rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
