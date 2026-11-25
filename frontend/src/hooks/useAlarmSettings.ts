import { useState, useEffect, useCallback, useRef } from 'react';
import { saveAlarmAudio, getAlarmAudio, deleteAlarmAudio } from '../utils/alarmDb';

const SETTINGS_KEY = 'catatku_alarm_settings_v1';

export type AlarmPreset = 'gentle' | 'standard' | 'urgent' | 'melodic';

export interface AlarmSettingsState {
  mode: 'synth' | 'mp3';
  preset: AlarmPreset;
  waveType: OscillatorType;
  volume: number; // 0–100
  durationSec: number; // 30 | 60 | 120 | 0 (unlimited)
  mp3Name: string | null;
}

const DEFAULT_SETTINGS: AlarmSettingsState = {
  mode: 'synth',
  preset: 'standard',
  waveType: 'triangle',
  volume: 22,
  durationSec: 60,
  mp3Name: null,
};

function loadSettings(): AlarmSettingsState {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function persistSettings(settings: AlarmSettingsState): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    console.warn('Gagal menyimpan pengaturan alarm');
  }
}

export const PRESET_CONFIG: Record<AlarmPreset, { freqs: number[]; repeatMs: number; waveType: OscillatorType }> = {
  gentle:   { freqs: [440, 554.37],  repeatMs: 1200, waveType: 'sine' },
  standard: { freqs: [880, 1174.66], repeatMs: 950,  waveType: 'triangle' },
  urgent:   { freqs: [880, 1174.66], repeatMs: 500,  waveType: 'square' },
  melodic:  { freqs: [523.25, 783.99, 1046.5], repeatMs: 800, waveType: 'sine' },
};

export function useAlarmSettings() {
  const [settings, setSettingsRaw] = useState<AlarmSettingsState>(loadSettings);
  const [mp3BlobUrl, setMp3BlobUrl] = useState<string | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  const replaceBlobUrl = useCallback((newUrl: string | null) => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    if (newUrl) {
      blobUrlRef.current = newUrl;
    }
    setMp3BlobUrl(newUrl);
  }, []);

  // Restore blob URL + file name from IndexedDB on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const audio = await getAlarmAudio();
        if (audio && !cancelled) {
          const url = URL.createObjectURL(audio.blob);
          replaceBlobUrl(url);
          // Restore mp3Name if it was missing from localStorage
          setSettingsRaw((prev) => {
            if (prev.mp3Name === audio.name) return prev;
            const next = { ...prev, mp3Name: audio.name };
            persistSettings(next);
            return next;
          });
        }
      } catch {
        // IndexedDB not available or empty
      } finally {
        if (!cancelled) setIsAudioReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [replaceBlobUrl]);

  // Revoke blob URL only on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const setSettings = useCallback((partial: Partial<AlarmSettingsState>) => {
    setSettingsRaw((prev) => {
      const next = { ...prev, ...partial };
      persistSettings(next);
      return next;
    });
  }, []);

  const uploadAudio = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      throw new Error('File harus berupa audio (MP3, WAV, OGG, dll).');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Ukuran file melebihi batas 5MB.');
    }
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    await saveAlarmAudio(blob, file.name);
    replaceBlobUrl(URL.createObjectURL(blob));
    setIsAudioReady(true);
    setSettings({ mode: 'mp3', mp3Name: file.name });
  }, [replaceBlobUrl, setSettings]);

  const removeAudio = useCallback(async () => {
    await deleteAlarmAudio();
    replaceBlobUrl(null);
    setIsAudioReady(true);
    setSettings({ mode: 'synth', mp3Name: null });
  }, [replaceBlobUrl, setSettings]);

  return {
    settings,
    setSettings,
    mp3BlobUrl,
    isAudioReady,
    uploadAudio,
    removeAudio,
    presetConfig: PRESET_CONFIG[settings.preset],
  };
}
