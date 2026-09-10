import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Note } from '../types/note';
import {
  requestNotificationPermission,
  syncSubscriptionToBackend,
  removeNoteFromBackend,
  isPushSupported,
} from '../utils/pushManager';

interface NotificationToggleProps {
  note: Note;
  onNotifyEnabled: (noteId: string) => void;
  onNotifyDisabled: (noteId: string) => void;
}

export const NotificationToggle: React.FC<NotificationToggleProps> = ({
  note,
  onNotifyEnabled,
  onNotifyDisabled,
}) => {
  const [loading, setLoading] = useState(false);

  if (note.category !== 'Tugas' || !note.deadline || note.isCompleted) return null;
  if (!isPushSupported()) return null;

  const isEnabled = Boolean(note.notifyFlags);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    try {
      if (isEnabled) {
        await removeNoteFromBackend(note.id);
        onNotifyDisabled(note.id);
      } else {
        const granted = await requestNotificationPermission();
        if (!granted) {
          setLoading(false);
          return;
        }
        await syncSubscriptionToBackend(note.id, note.title, note.deadline!);
        onNotifyEnabled(note.id);
      }
    } catch (err) {
      console.error('Notification toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`p-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
        isEnabled
          ? 'text-accent hover:text-accent/70'
          : 'text-muted/50 hover:text-accent'
      } ${loading ? 'opacity-50' : ''}`}
      title={isEnabled ? 'Nonaktifkan notifikasi' : 'Aktifkan notifikasi'}
      aria-label={isEnabled ? 'Nonaktifkan notifikasi' : 'Aktifkan notifikasi'}
    >
      {isEnabled ? (
        <Bell className="w-3.5 h-3.5 fill-accent" />
      ) : (
        <BellOff className="w-3.5 h-3.5" />
      )}
    </button>
  );
};
