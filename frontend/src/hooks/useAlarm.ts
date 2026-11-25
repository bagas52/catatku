import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types/note';
import {
  startDeadlineAlarm,
  stopDeadlineAlarm,
  playChimeSound,
  AlarmConfig,
} from '../utils/audioAlarm';
import { AlarmSettingsState, PRESET_CONFIG } from './useAlarmSettings';

interface UseAlarmInput {
  settings: AlarmSettingsState;
  mp3BlobUrl: string | null;
  isAudioReady: boolean;
}

export function useAlarm(notes: Note[], onMarkNoteNotified: (ids: string[]) => void, input?: UseAlarmInput) {
  const [activeAlarmNotes, setActiveAlarmNotes] = useState<Note[]>([]);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isTestingSound, setIsTestingSound] = useState(false);

  const settings = input?.settings;
  const mp3BlobUrl = input?.mp3BlobUrl ?? null;
  const isAudioReady = input?.isAudioReady ?? true;

  const buildConfig = useCallback(
    (overrides?: Partial<AlarmConfig>): AlarmConfig | null => {
      if (settings && settings.mode === 'mp3') {
        if (!isAudioReady || !mp3BlobUrl) {
          // MP3 belum siap dimuat — jangan jatuh ke synth, tunggu interval berikutnya
          return null;
        }
        return {
          mode: 'mp3',
          waveType: 'triangle',
          volume: settings.volume / 100,
          synthFreqs: [880, 1174.66],
          repeatMs: 950,
          mp3BlobUrl,
          durationMs: settings.durationSec * 1000,
          ...overrides,
        };
      }

      const preset = PRESET_CONFIG[settings?.preset ?? 'standard'];
      return {
        mode: 'synth',
        waveType: settings?.waveType ?? preset.waveType,
        volume: (settings?.volume ?? 22) / 100,
        synthFreqs: preset.freqs,
        repeatMs: preset.repeatMs,
        mp3BlobUrl: '',
        durationMs: (settings?.durationSec ?? 60) * 1000,
        ...overrides,
      };
    },
    [settings, mp3BlobUrl, isAudioReady],
  );

  // Periksa tenggat secara periodik (setiap 20 detik)
  useEffect(() => {
    const checkDeadlines = () => {
      const now = Date.now();
      const newlyTriggered: Note[] = [];

      notes.forEach((note) => {
        if (note.category === 'Tugas' && note.deadline && !note.isCompleted && !note.notified) {
          const deadlineTime = new Date(note.deadline).getTime();
          const diffMs = deadlineTime - now;

          // Bunyikan alarm jika deadline sudah lewat atau sisa waktu <= 30 menit
          if (diffMs <= 30 * 60 * 1000) {
            newlyTriggered.push(note);
          }
        }
      });

      if (newlyTriggered.length > 0) {
        const config = buildConfig();
        if (config) {
          setActiveAlarmNotes(newlyTriggered);
          setIsAlarmActive(true);
          startDeadlineAlarm(config);
          onMarkNoteNotified(newlyTriggered.map((n) => n.id));
        }
      }
    };

    const interval = setInterval(checkDeadlines, 20000);
    return () => clearInterval(interval);
  }, [notes, onMarkNoteNotified, buildConfig]);

  const dismissAlarm = useCallback(() => {
    stopDeadlineAlarm();
    setIsAlarmActive(false);
    setActiveAlarmNotes([]);
  }, []);

  const testSound = useCallback(() => {
    if (isTestingSound) {
      stopDeadlineAlarm();
      setIsTestingSound(false);
      return;
    }
    const config = buildConfig({
      durationMs: 4000,
      onAutoStop: () => setIsTestingSound(false),
    });
    if (!config) return;
    setIsTestingSound(true);
    startDeadlineAlarm(config);
    setTimeout(() => {
      stopDeadlineAlarm();
      setIsTestingSound(false);
    }, 4000);
  }, [isTestingSound, buildConfig]);

  return {
    isAlarmActive,
    activeAlarmNotes,
    dismissAlarm,
    testSound,
    isTestingSound,
    playChimeSound,
  };
}
