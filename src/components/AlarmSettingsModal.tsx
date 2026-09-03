import React, { useRef, useState } from 'react';
import { X, Upload, Trash2, BellRing, Volume2 } from 'lucide-react';
import { AlarmSettingsState, AlarmPreset, PRESET_CONFIG } from '../hooks/useAlarmSettings';

interface AlarmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AlarmSettingsState;
  setSettings: (partial: Partial<AlarmSettingsState>) => void;
  uploadAudio: (file: File) => Promise<void>;
  removeAudio: () => Promise<void>;
  onTestSound: () => void;
  isTestingSound: boolean;
}

const PRESETS: { key: AlarmPreset; label: string; desc: string }[] = [
  { key: 'gentle', label: 'Lembut', desc: 'Nada rendah tenang' },
  { key: 'standard', label: 'Standar', desc: 'Nada bip dua' },
  { key: 'urgent', label: 'Mendesak', desc: 'Bip cepat & tegas' },
  { key: 'melodic', label: 'Melodik', desc: 'Nada berurutan' },
];

const WAVES: { key: OscillatorType; label: string }[] = [
  { key: 'sine', label: 'Sine' },
  { key: 'triangle', label: 'Triangle' },
  { key: 'square', label: 'Square' },
  { key: 'sawtooth', label: 'Saw' },
];

const DURATIONS: { value: number; label: string }[] = [
  { value: 30, label: '30 dtk' },
  { value: 60, label: '60 dtk' },
  { value: 120, label: '120 dtk' },
  { value: 0, label: 'Tak Terbatas' },
];

export const AlarmSettingsModal: React.FC<AlarmSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  uploadAudio,
  removeAudio,
  onTestSound,
  isTestingSound,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      await uploadAudio(file);
      setMsg(`File "${file.name}" disimpan sebagai bunyi alarm.`);
      setTimeout(() => setMsg(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengunggah file.');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveAudio = async () => {
    setError(null);
    try {
      await removeAudio();
      setMsg('File audio dihapus. Kembali ke bunyi sintetis.');
      setTimeout(() => setMsg(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus file.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs text-left">
      <div
        className="bg-surface w-full max-w-md rounded-lg shadow-xl border border-muted/20 p-5 text-left max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-muted/15 pb-2.5 mb-3">
          <h3 className="font-heading font-semibold text-base text-ink">
            Pengaturan Bunyi Alarm
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {msg && (
          <div className="p-2 mb-3 text-xs rounded bg-accent/10 border border-accent/30 text-ink">
            {msg}
          </div>
        )}
        {error && (
          <div className="p-2 mb-3 text-xs rounded bg-red-500/10 border border-red-500/30 text-ink">
            {error}
          </div>
        )}

        {/* Sumber bunyi */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted mb-1.5">Sumber Bunyi</p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setSettings({ mode: 'synth' })}
              className={`px-3 py-2 rounded border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                settings.mode === 'synth'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-bg/50 border-muted/20 text-muted hover:text-ink'
              }`}
            >
              Sintetis
            </button>
            <button
              type="button"
              onClick={() => {
                if (settings.mp3Name) {
                  setSettings({ mode: 'mp3' });
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className={`px-3 py-2 rounded border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                settings.mode === 'mp3'
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-bg/50 border-muted/20 text-muted hover:text-ink'
              }`}
            >
              File Audio
            </button>
          </div>
        </div>

        {settings.mode === 'synth' ? (
          <>
            {/* Preset */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted mb-1.5">Preset Suara</p>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESETS.map((p) => {
                  const active = settings.preset === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => {
                        const cfg = PRESET_CONFIG[p.key];
                        setSettings({ preset: p.key, waveType: cfg.waveType });
                      }}
                      className={`px-3 py-2 rounded border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                        active
                          ? 'bg-accent/10 border-accent'
                          : 'bg-bg/50 border-muted/20 hover:border-muted/40'
                      }`}
                    >
                      <span className={`block text-xs font-medium ${active ? 'text-ink' : 'text-ink'}`}>
                        {p.label}
                      </span>
                      <span className="block text-[11px] text-muted">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gelombang */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted mb-1.5">Jenis Gelombang</p>
              <div className="flex flex-wrap gap-1.5">
                {WAVES.map((w) => {
                  const active = settings.waveType === w.key;
                  return (
                    <button
                      key={w.key}
                      type="button"
                      onClick={() => setSettings({ waveType: w.key })}
                      className={`px-3 py-1.5 rounded border text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                        active
                          ? 'bg-accent/10 border-accent text-accent'
                          : 'bg-bg/50 border-muted/20 text-muted hover:text-ink'
                      }`}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Mode MP3 */
          <div className="mb-4">
            <p className="text-xs font-medium text-muted mb-1.5">File Audio</p>
            <div className="p-2.5 bg-bg/50 rounded border border-muted/20 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-ink text-xs truncate">
                  {settings.mp3Name || 'Tidak ada file'}
                </p>
                <p className="text-[11px] text-muted">Maks 5MB · tersimpan di browser</p>
              </div>
              <button
                type="button"
                onClick={handleRemoveAudio}
                className="px-2.5 py-1.5 bg-surface border border-muted/25 text-muted hover:text-red-400 rounded text-xs flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                title="Hapus file"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full px-3 py-2 bg-surface border border-muted/25 hover:border-accent text-ink rounded text-xs flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload MP3 / Audio</span>
            </button>
          </div>
        )}

        {/* Volume */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-medium text-muted">Volume</p>
            <span className="text-xs font-medium text-ink flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-muted" />
              {settings.volume}%
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            value={settings.volume}
            onChange={(e) => setSettings({ volume: Number(e.target.value) })}
            className="w-full accent-accent"
          />
        </div>

        {/* Durasi */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted mb-1.5">Durasi Bunyi</p>
          <div className="flex flex-wrap gap-1.5">
            {DURATIONS.map((d) => {
              const active = settings.durationSec === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setSettings({ durationSec: d.value })}
                  className={`px-3 py-1.5 rounded border text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                    active
                      ? 'bg-accent/10 border-accent text-accent'
                      : 'bg-bg/50 border-muted/20 text-muted hover:text-ink'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Uji bunyi */}
        <div className="pt-3 mt-2 border-t border-muted/15 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onTestSound}
            className={`px-3.5 py-2 rounded text-xs font-medium flex items-center gap-1.5 bg-accent text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
              isTestingSound ? 'opacity-90' : 'hover:opacity-90'
            }`}
          >
            <BellRing className={`w-4 h-4 ${isTestingSound ? 'animate-bounce' : ''}`} />
            <span>{isTestingSound ? 'Menguji…' : 'Uji Bunyi Alarm'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs text-muted hover:text-ink rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Hidden file input — selalu dirender agar ref tersedia dari mode apa pun */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFile}
        accept="audio/*"
        className="hidden"
      />
    </div>
  );
};
