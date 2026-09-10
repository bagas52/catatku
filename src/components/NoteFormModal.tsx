import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Bell } from 'lucide-react';
import { Note, CategoryType } from '../types/note';
import { isPushSupported } from '../utils/pushManager';

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Note>) => void;
  editingNote: Note | null;
}

export const NoteFormModal: React.FC<NoteFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingNote,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryType>('Kuliah');
  const [isPinned, setIsPinned] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setContent(editingNote.content || '');
      setCategory(editingNote.category || 'Kuliah');
      setIsPinned(Boolean(editingNote.isPinned));
      setIsCompleted(Boolean(editingNote.isCompleted));
      if (editingNote.deadline) {
        const d = new Date(editingNote.deadline);
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setDeadline(local);
      } else {
        setDeadline('');
      }
      setEnableNotifications(Boolean(editingNote.notifyFlags));
    } else {
      setTitle('');
      setContent('');
      setCategory('Kuliah');
      setIsPinned(false);
      setDeadline('');
      setIsCompleted(false);
      setEnableNotifications(false);
    }
    setErrorMessage('');
  }, [editingNote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Judul catatan harus diisi.');
      return;
    }

    const payload: Partial<Note> = {
      title: title.trim(),
      content: content.trim(),
      category,
      isPinned,
      deadline: category === 'Tugas' && deadline ? new Date(deadline).toISOString() : undefined,
      isCompleted: category === 'Tugas' ? isCompleted : false,
      notifyFlags:
        category === 'Tugas' && deadline && enableNotifications
          ? { day: false, hour: false, thirtyMin: false }
          : undefined,
    };

    onSave(payload);
    onClose();
  };

  const setPresetDeadline = (days: number, hour: number = 23, min: number = 59) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    target.setHours(hour, min, 0, 0);
    const local = new Date(target.getTime() - target.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setDeadline(local);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs text-left">
      <div
        className="bg-surface w-full max-w-lg rounded-lg shadow-xl border border-muted/20 flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-muted/15 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-base sm:text-lg text-ink">
            {editingNote ? 'Ubah Catatan' : 'Tambah Catatan'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-left">
          {errorMessage && (
            <div className="p-2.5 rounded text-xs bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
              {errorMessage}
            </div>
          )}

          {/* Category selection */}
          <div>
            <label className="block text-xs font-heading font-medium text-muted mb-1.5 text-left">
              Kategori
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Kuliah', 'Tugas', 'Pribadi'] as CategoryType[]).map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 rounded text-xs font-heading font-medium border text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                      active
                        ? 'bg-accent/10 border-accent text-accent'
                        : 'bg-surface border-muted/25 text-muted hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-heading font-medium text-muted mb-1.5 text-left">
              Judul catatan
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Contoh: Arsitektur REST API"
              className="w-full px-3.5 py-2 bg-bg/50 border border-muted/25 rounded text-ink text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans"
              autoFocus
            />
          </div>

          {/* Deadline field when Category = Tugas */}
          {category === 'Tugas' && (
            <div className="p-3 bg-bg/70 rounded border border-muted/20 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-medium text-ink flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>Tenggat waktu (deadline)</span>
                </label>
                {deadline && (
                  <button
                    type="button"
                    onClick={() => setDeadline('')}
                    className="text-[11px] text-muted hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded"
                  >
                    Hapus tenggat
                  </button>
                )}
              </div>

              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-1.5 bg-surface border border-muted/25 rounded text-xs sm:text-sm text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPresetDeadline(0, 23, 59)}
                  className="text-[11px] px-2 py-0.5 bg-surface border border-muted/20 rounded text-muted hover:text-ink hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  Malam ini (23:59)
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDeadline(1, 23, 59)}
                  className="text-[11px] px-2 py-0.5 bg-surface border border-muted/20 rounded text-muted hover:text-ink hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  Besok malam (23:59)
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDeadline(3, 23, 59)}
                  className="text-[11px] px-2 py-0.5 bg-surface border border-muted/20 rounded text-muted hover:text-ink hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  3 hari lagi
                </button>
              </div>

              {editingNote && (
                <div className="pt-2 border-t border-muted/15 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modalTaskDone"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className="w-4 h-4 rounded text-accent focus:ring-accent"
                  />
                  <label htmlFor="modalTaskDone" className="text-xs text-ink cursor-pointer">
                    Tandai tugas ini sudah selesai
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Notification toggle for Tugas with deadline */}
          {category === 'Tugas' && deadline && isPushSupported() && (
            <div className="flex items-center justify-between p-3 bg-bg/70 rounded border border-muted/20">
              <div className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-heading font-medium text-ink">Notifikasi push ke HP</span>
              </div>
              <button
                type="button"
                onClick={() => setEnableNotifications(!enableNotifications)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                  enableNotifications ? 'bg-accent' : 'bg-muted/30'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                    enableNotifications ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Body / Content */}
          <div>
            <label className="block text-xs font-heading font-medium text-muted mb-1.5 text-left">
              Isi catatan
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis materi perkuliahan, instruksi tugas, atau catatan pribadi..."
              className="w-full px-3.5 py-2 bg-bg/50 border border-muted/25 rounded text-ink text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-note-body leading-relaxed"
            />
          </div>

          {/* Star toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                isPinned
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-surface border-muted/25 text-muted hover:text-ink'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isPinned ? 'fill-accent text-accent' : ''}`} />
              <span>{isPinned ? 'Ditandai penting' : 'Tandai sebagai catatan penting'}</span>
            </button>
          </div>

          {/* Buttons: Simpan & Batal (active Indonesian verbs) */}
          <div className="pt-4 border-t border-muted/15 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-muted hover:text-ink rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-heading font-semibold bg-accent text-white hover:opacity-90 rounded transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
