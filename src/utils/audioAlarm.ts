// Web Audio API Synthesizer for CatatKu
// Clean, dependency-free audio generation directly in browser
// Now supports: synth mode (oscillator) and MP3 mode (HTMLAudioElement)

let audioContext: AudioContext | null = null;
let alarmIntervalId: number | null = null;
let alarmAutoStopId: number | null = null;
let currentMp3Audio: HTMLAudioElement | null = null;

export interface AlarmConfig {
  mode: 'synth' | 'mp3';
  // Synth mode
  waveType: OscillatorType;
  volume: number; // 0.0 – 1.0
  synthFreqs: number[];
  repeatMs: number;
  // MP3 mode
  mp3BlobUrl: string;
  // Common
  durationMs: number; // 0 = no auto-stop
  onAutoStop?: () => void;
}

function getAudioContext(): AudioContext {
  if (!audioContext) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioCtxClass();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Memutar nada chime halus saat menyimpan catatan atau menandai selesai
 */
export function playChimeSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    playTone(523.25, now, 0.35);       // C5
    playTone(659.25, now + 0.12, 0.5); // E5
    playTone(783.99, now + 0.28, 0.7); // G5
  } catch (err) {
    console.warn('Audio chime failed:', err);
  }
}

/**
 * Hentikan mode MP3 yang sedang berjalan
 */
function stopMp3Audio(): void {
  if (currentMp3Audio) {
    currentMp3Audio.pause();
    currentMp3Audio.currentTime = 0;
    currentMp3Audio.src = '';
    currentMp3Audio = null;
  }
}

/**
 * Mulai alarm tenggat tugas — mendukung mode synth (osilator) dan mp3
 */
export function startDeadlineAlarm(config?: AlarmConfig): void {
  stopDeadlineAlarm();

  const cfg: AlarmConfig = config ?? {
    mode: 'synth',
    waveType: 'triangle',
    volume: 0.22,
    synthFreqs: [880, 1174.66],
    repeatMs: 950,
    mp3BlobUrl: '',
    durationMs: 60000,
  };

  try {
    if (cfg.mode === 'mp3' && cfg.mp3BlobUrl) {
      // MP3 mode
      const audio = new Audio(cfg.mp3BlobUrl);
      audio.loop = true;
      audio.volume = cfg.volume;
      currentMp3Audio = audio;
      audio.play().catch(() => {
        console.warn('MP3 alarm autoplay blocked');
      });
    } else {
      // Synth mode
      const ctx = getAudioContext();

      const triggerTones = () => {
        const now = ctx.currentTime;

        cfg.synthFreqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.12;
          const dur = 0.22;

          osc.type = cfg.waveType;
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(cfg.volume, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + dur);
        });
      };

      triggerTones();
      alarmIntervalId = window.setInterval(triggerTones, cfg.repeatMs);
    }

    // Auto-stop (0 = no auto-stop, keep ringing until manual stop)
    if (cfg.durationMs > 0) {
      alarmAutoStopId = window.setTimeout(() => {
        stopDeadlineAlarm();
        if (cfg.onAutoStop) cfg.onAutoStop();
      }, cfg.durationMs);
    }
  } catch (err) {
    console.warn('Deadline alarm sound failed:', err);
  }
}

/**
 * Hentikan semua alarm (synth + mp3)
 */
export function stopDeadlineAlarm(): void {
  if (alarmIntervalId !== null) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
  if (alarmAutoStopId !== null) {
    clearTimeout(alarmAutoStopId);
    alarmAutoStopId = null;
  }
  stopMp3Audio();
}
