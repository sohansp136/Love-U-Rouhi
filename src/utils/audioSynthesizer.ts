/**
 * Browser-native Web Audio Acapella Vocal Synthesizer & Speech Reciter.
 * Produces pure solo vocal humming/singing using formant synthesis (formant filters + vibrato)
 * without any backing instruments, drums, chords, or background music.
 */

interface SongVocalNote {
  freq: number;
  duration: number; // in seconds
  lyricSyllable?: string;
}

export const VOCAL_MELODIES: Record<string, SongVocalNote[]> = {
  'song-b1': [ // Amar Poran Jaha Chay
    { freq: 392.00, duration: 0.8, lyricSyllable: 'A-' },
    { freq: 440.00, duration: 0.8, lyricSyllable: 'mar' },
    { freq: 493.88, duration: 1.0, lyricSyllable: 'po-' },
    { freq: 587.33, duration: 1.2, lyricSyllable: 'ran' },
    { freq: 493.88, duration: 0.8, lyricSyllable: 'ja-' },
    { freq: 440.00, duration: 0.8, lyricSyllable: 'ha' },
    { freq: 392.00, duration: 1.4, lyricSyllable: 'chay...' },
    { freq: 329.63, duration: 0.8, lyricSyllable: 'tu-' },
    { freq: 392.00, duration: 0.8, lyricSyllable: 'mi' },
    { freq: 440.00, duration: 1.5, lyricSyllable: 'tai,' },
    { freq: 392.00, duration: 0.8, lyricSyllable: 'tu-' },
    { freq: 329.63, duration: 0.8, lyricSyllable: 'mi' },
    { freq: 293.66, duration: 1.8, lyricSyllable: 'tai go...' }
  ],
  'song-b2': [ // Ei Shundor Shornali Shondhyay
    { freq: 329.63, duration: 0.7, lyricSyllable: 'Ei' },
    { freq: 392.00, duration: 0.7, lyricSyllable: 'shun-' },
    { freq: 440.00, duration: 0.9, lyricSyllable: 'dor' },
    { freq: 493.88, duration: 0.9, lyricSyllable: 'shor-' },
    { freq: 587.33, duration: 1.1, lyricSyllable: 'na-' },
    { freq: 523.25, duration: 0.8, lyricSyllable: 'li' },
    { freq: 493.88, duration: 1.4, lyricSyllable: 'shondhyay...' },
    { freq: 440.00, duration: 0.8, lyricSyllable: 'e-' },
    { freq: 392.00, duration: 0.8, lyricSyllable: 'ki' },
    { freq: 329.63, duration: 0.9, lyricSyllable: 'bon-' },
    { freq: 392.00, duration: 1.0, lyricSyllable: 'dho-' },
    { freq: 440.00, duration: 1.6, lyricSyllable: 'ne...' }
  ],
  'song-b3': [ // Tumi Je Amar
    { freq: 261.63, duration: 0.8, lyricSyllable: 'Tu-' },
    { freq: 329.63, duration: 0.8, lyricSyllable: 'mi' },
    { freq: 392.00, duration: 1.0, lyricSyllable: 'je' },
    { freq: 440.00, duration: 1.5, lyricSyllable: 'a-' },
    { freq: 392.00, duration: 1.2, lyricSyllable: 'mar...' },
    { freq: 329.63, duration: 0.8, lyricSyllable: 'o-' },
    { freq: 392.00, duration: 0.8, lyricSyllable: 'go' },
    { freq: 440.00, duration: 0.9, lyricSyllable: 'tu-' },
    { freq: 493.88, duration: 0.9, lyricSyllable: 'mi' },
    { freq: 523.25, duration: 1.6, lyricSyllable: 'je amar...' }
  ],
  'song-b4': [ // Jodi Himaloy Hoye Dukkho Aashe
    { freq: 349.23, duration: 0.8, lyricSyllable: 'Jo-' },
    { freq: 392.00, duration: 0.8, lyricSyllable: 'di' },
    { freq: 440.00, duration: 1.0, lyricSyllable: 'Hi-' },
    { freq: 523.25, duration: 1.2, lyricSyllable: 'ma-' },
    { freq: 440.00, duration: 0.9, lyricSyllable: 'loy' },
    { freq: 392.00, duration: 0.8, lyricSyllable: 'ho-' },
    { freq: 349.23, duration: 1.4, lyricSyllable: 'ye...' }
  ],
  'song-h1': [ // Pal Pal Dil Ke Paas
    { freq: 329.63, duration: 0.7, lyricSyllable: 'Pal' },
    { freq: 392.00, duration: 0.7, lyricSyllable: 'pal' },
    { freq: 440.00, duration: 0.8, lyricSyllable: 'dil' },
    { freq: 493.88, duration: 0.9, lyricSyllable: 'ke' },
    { freq: 493.88, duration: 1.2, lyricSyllable: 'paas...' },
    { freq: 440.00, duration: 0.8, lyricSyllable: 'tum' },
    { freq: 392.00, duration: 0.8, lyricSyllable: 'reh-' },
    { freq: 329.63, duration: 0.8, lyricSyllable: 'ti' },
    { freq: 440.00, duration: 1.5, lyricSyllable: 'ho...' }
  ],
  'song-h2': [ // Lag Jaa Gale
    { freq: 293.66, duration: 0.8, lyricSyllable: 'Lag' },
    { freq: 369.99, duration: 0.9, lyricSyllable: 'jaa' },
    { freq: 440.00, duration: 1.2, lyricSyllable: 'ga-' },
    { freq: 493.88, duration: 1.4, lyricSyllable: 'le...' },
    { freq: 440.00, duration: 0.8, lyricSyllable: 'ki' },
    { freq: 369.99, duration: 0.8, lyricSyllable: 'phir' },
    { freq: 329.63, duration: 0.8, lyricSyllable: 'ye' },
    { freq: 293.66, duration: 0.9, lyricSyllable: 'ha-' },
    { freq: 369.99, duration: 0.9, lyricSyllable: 'seen' },
    { freq: 440.00, duration: 1.6, lyricSyllable: 'raat ho na ho...' }
  ],
  'song-h3': [ // Humein Tumse Pyar Kitna
    { freq: 329.63, duration: 0.8, lyricSyllable: 'Hu-' },
    { freq: 415.30, duration: 0.8, lyricSyllable: 'mein' },
    { freq: 493.88, duration: 1.0, lyricSyllable: 'tum-' },
    { freq: 554.37, duration: 1.2, lyricSyllable: 'se' },
    { freq: 493.88, duration: 0.9, lyricSyllable: 'pyar' },
    { freq: 415.30, duration: 0.9, lyricSyllable: 'kit-' },
    { freq: 369.99, duration: 1.4, lyricSyllable: 'na...' }
  ],
  'song-h4': [ // Tere Bina Zindagi Se
    { freq: 349.23, duration: 0.8, lyricSyllable: 'Te-' },
    { freq: 440.00, duration: 0.8, lyricSyllable: 're' },
    { freq: 523.25, duration: 1.0, lyricSyllable: 'bi-' },
    { freq: 587.33, duration: 1.3, lyricSyllable: 'na...' },
    { freq: 523.25, duration: 0.8, lyricSyllable: 'zin-' },
    { freq: 440.00, duration: 0.8, lyricSyllable: 'da-' },
    { freq: 392.00, duration: 0.8, lyricSyllable: 'gi' },
    { freq: 349.23, duration: 1.5, lyricSyllable: 'se...' }
  ]
};

class RomanticAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTimeout: number | null = null;
  private activeVocalNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private onNoteCallback?: (noteIdx: number, syllable?: string) => void;
  private onEndCallback?: () => void;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single soft chime
  playChimeNote(freq: number, duration: number = 2.0, volume: number = 0.15) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore
    }
  }

  playSealBreakSound() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChimeNote(freq, 1.8, 0.12);
        }, idx * 90);
      });
    } catch {
      // Ignore
    }
  }

  playRedeemFanfare() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playChimeNote(freq, 2.2, 0.15);
        }, idx * 110);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * PURE SOLO VOCAL FORMANT SYNTHESIS (Acapella / Human Vocal Humming)
   * Strictly solo voice: NO instruments, NO chords, NO drums, NO guitar/piano.
   * Uses vocal tract formants (F1, F2 bandpass filters) + human vibrato LFO.
   */
  startAcapellaVocalMelody(
    songId: string,
    onNote?: (noteIdx: number, syllable?: string) => void,
    onFinish?: () => void
  ) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.onNoteCallback = onNote;
    this.onEndCallback = onFinish;

    const melody = VOCAL_MELODIES[songId] || VOCAL_MELODIES['song-b1'];
    let noteIdx = 0;

    const playNextVocalNote = () => {
      if (!this.isPlaying || !this.ctx) return;

      if (noteIdx >= melody.length) {
        // Loop back after a sweet vocal breath pause
        noteIdx = 0;
        this.currentTimeout = window.setTimeout(playNextVocalNote, 1200);
        return;
      }

      const note = melody[noteIdx];
      const startTime = this.ctx.currentTime;
      const dur = note.duration;

      // 1. Vocal Chord Fundament Oscillator (vocal tract glottal source)
      const voiceOsc = this.ctx.createOscillator();
      voiceOsc.type = 'triangle'; // triangle has even/odd harmonics similar to vocal folds
      voiceOsc.frequency.setValueAtTime(note.freq, startTime);

      // Subtle vocal portamento (slide) into the note
      voiceOsc.frequency.exponentialRampToValueAtTime(note.freq, startTime + 0.08);

      // 2. Human Vibrato (5.2 Hz LFO for natural, warm human singing)
      const vibrato = this.ctx.createOscillator();
      vibrato.frequency.setValueAtTime(5.2, startTime);
      const vibratoGain = this.ctx.createGain();
      vibratoGain.gain.setValueAtTime(4.5, startTime); // +/- 4.5 Hz natural pitch waver
      vibrato.connect(voiceOsc.frequency);
      vibrato.start(startTime);
      vibrato.stop(startTime + dur);

      // 3. Human Vocal Formant Filter 1 (Chest resonance / 'Ah'-'Oh' vowel around 650Hz)
      const formant1 = this.ctx.createBiquadFilter();
      formant1.type = 'bandpass';
      formant1.frequency.setValueAtTime(650, startTime);
      formant1.Q.setValueAtTime(4.0, startTime);

      // 4. Human Vocal Formant Filter 2 (Oral resonance around 1250Hz)
      const formant2 = this.ctx.createBiquadFilter();
      formant2.type = 'bandpass';
      formant2.frequency.setValueAtTime(1250, startTime);
      formant2.Q.setValueAtTime(5.0, startTime);

      // 5. Vocal Envelope Gain (smooth human breath attack and gentle release)
      const vocalGain = this.ctx.createGain();
      vocalGain.gain.setValueAtTime(0.0001, startTime);
      vocalGain.gain.linearRampToValueAtTime(0.18, startTime + 0.12); // gentle vocal onset
      vocalGain.gain.setValueAtTime(0.18, startTime + dur - 0.15);
      vocalGain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur); // breath taper

      // Routing: voice -> formants -> master gain -> speakers
      voiceOsc.connect(formant1);
      voiceOsc.connect(formant2);

      formant1.connect(vocalGain);
      formant2.connect(vocalGain);

      vocalGain.connect(this.ctx.destination);

      voiceOsc.start(startTime);
      voiceOsc.stop(startTime + dur);

      // Notify UI for spinning ribbon / lyrics sync
      if (this.onNoteCallback) {
        this.onNoteCallback(noteIdx, note.lyricSyllable);
      }

      noteIdx++;
      this.currentTimeout = window.setTimeout(playNextVocalNote, dur * 1000);
    };

    playNextVocalNote();
  }

  /**
   * Spoken Romantic Vocal Recitation
   * Uses browser speech synthesis with intimate romantic cadence
   */
  reciteVocalPoetry(
    lines: string[],
    onLine?: (lineIdx: number) => void,
    onEnd?: () => void
  ) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    let lineIdx = 0;
    const reciteNext = () => {
      if (lineIdx >= lines.length) {
        if (onEnd) onEnd();
        return;
      }

      const text = lines[lineIdx];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // slightly slower, intimate poetic tempo
      utterance.pitch = 0.95; // warm, gentle pitch

      utterance.onstart = () => {
        if (onLine) onLine(lineIdx);
      };

      utterance.onend = () => {
        lineIdx++;
        setTimeout(reciteNext, 600);
      };

      utterance.onerror = () => {
        lineIdx++;
        reciteNext();
      };

      window.speechSynthesis.speak(utterance);
    };

    reciteNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.activeVocalNodes.forEach(({ osc, gain }) => {
      try {
        gain.gain.setValueAtTime(0, 0);
        osc.stop();
      } catch {}
    });
    this.activeVocalNodes = [];
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = new RomanticAudioSynthesizer();
