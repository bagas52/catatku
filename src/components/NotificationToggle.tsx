import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Note } from '../types/note';
import { isPushSupported } from '../utils/pushManager';

interface NotificationToggleProps {
  note: Note;
  onNotifyEnabled: (noteId: string) => void | Promise<boolean>;
  onNotifyDisabled: (noteId: string) => void | Promise<boolean>;
}

export const NotificationToggle: React.FC<NotificationToggleProps> = ({
  note,
  onNotifyEnabled,
  onNotifyDisabled,
}) => {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  if (note.category !== 'Tugas' || !note.deadline || note.isCompleted) return null;
  if (!isPushSupported()) return null;

  const isEnabled = Boolean(note.notifyFlags);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    setFailed(false);

    try {
      const ok = isEnabled
        ? await onNotifyDisabled(note.id)
        : await onNotifyEnabled(note.id);
      if (ok === false) setFailed(true);
    } catch (err) {
      console.error('Notification toggle error:', err);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const title = failed
    ? 'Gagal — izinkan notifikasi & buka sebagai PWA'
    : isEnabled
      ? 'Nonaktifkan notifikasi'
      : 'Aktifkan notifikasi';

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
        isEnabled
          ? 'text-accent hover:text-accent/70'
          : failed
            ? 'text-warn hover:text-warn/70'
            : 'text-muted/50 hover:text-accent'
      } ${loading ? 'opacity-50' : ''}`}
      title={title}
      aria-label={title}
    >
      {isEnabled ? (
        <Bell className="w-3.5 h-3.5 fill-accent" />
      ) : (
        <BellOff className="w-3.5 h-3.5" />
      )}
    </button>
  );
};
