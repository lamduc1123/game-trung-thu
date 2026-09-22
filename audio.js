/**
 * Audio Engine for Mid-Autumn Word Scramble (Game Đoán Chữ Trung Thu)
 * - Pure Web Audio API synthesis: zero external audio files, zero latency, runs offline.
 * - Upbeat festive Mid-Autumn BGM (pentatonic scale + festival drums).
 * - Full SFX suite: Player join pop, countdown tick/urgent, correct fanfare, wrong buzzer, reveal drumroll, finale fireworks.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmVolume = 0.35;
        this.sfxVolume = 0.8;
        this.isBgmPlaying = false;
        this.bgmTimer = null;
        this.stepIndex = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.isBgmPlaying) {
            this.stopBGM();
            this.isBgmPlaying = false;
        }
        return this.isMuted;
    }

    setBgmVolume(val) {
        this.bgmVolume = Math.max(0, Math.min(1, val));
    }

    setSfxVolume(val) {
        this.sfxVolume = Math.max(0, Math.min(1, val));
    }

    // --- SFX SUITE ---

    // Pop sound when a player joins room
    playJoin() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

        gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Clock tick for countdown
    playTick(isUrgent = false) {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isUrgent ? 880 : 520, now);
        osc.frequency.exponentialRampToValueAtTime(isUrgent ? 440 : 260, now + 0.05);

        gain.gain.setValueAtTime(this.sfxVolume * (isUrgent ? 0.35 : 0.2), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Correct Answer Chime
    playCorrect() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = now + idx * 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.45, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.5);
        });
    }

    // Wrong / Buzzer sound
    playWrong() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.25);

        gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    // Reveal answer fanfare
    playReveal() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const chords = [
            [523.25, 659.25, 783.99],
            [587.33, 739.99, 880.00],
            [659.25, 830.61, 987.77],
            [1046.50, 1318.51, 1567.98]
        ];

        chords.forEach((chord, i) => {
            const time = now + i * 0.12;
            const dur = (i === chords.length - 1) ? 0.9 : 0.2;
            chord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, time);

                gain.gain.setValueAtTime(0.001, time);
                gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, time + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(time);
                osc.stop(time + dur);
            });
        });
    }

    // Grand Finale Fanfare
    playFinale() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];

        arpeggio.forEach((freq, idx) => {
            const t = now + idx * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 1.2);
        });
    }

    // --- FESTIVE MID-AUTUMN BGM SYNTHESIZER ---
    startBGM() {
        if (this.isBgmPlaying) return;
        this.init();
        this.isBgmPlaying = true;
        this.stepIndex = 0;

        // Vietnamese Pentatonic Scale: C4, D4, E4, G4, A4, C5, D5, E5, G5, A5
        const melody = [
            523.25, 659.25, 783.99, 880.00,  // C5, E5, G5, A5
            783.99, 659.25, 523.25, 587.33,  // G5, E5, C5, D5
            659.25, 783.99, 880.00, 1046.50, // E5, G5, A5, C6
            880.00, 783.99, 659.25, 523.25   // A5, G5, E5, C5
        ];

        const bassline = [
            130.81, 130.81, 196.00, 196.00,  // C3, G3
            164.81, 164.81, 220.00, 220.00,  // E3, A3
            146.83, 146.83, 196.00, 196.00,  // D3, G3
            130.81, 196.00, 130.81, 261.63   // C3, G3, C3, C4
        ];

        const bpm = 128;
        const stepTime = (60 / bpm) / 2; // 16th note timing

        const scheduleBeat = () => {
            if (!this.isBgmPlaying) return;
            const now = this.ctx.currentTime;

            // 1. Play melody note
            const noteFreq = melody[this.stepIndex % melody.length];
            if (noteFreq && this.stepIndex % 2 === 0 && !this.isMuted) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(noteFreq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(this.bgmVolume * 0.25, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 1.6);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + stepTime * 1.6);
            }

            // 2. Play bass note
            const bassFreq = bassline[Math.floor(this.stepIndex / 2) % bassline.length];
            if (bassFreq && this.stepIndex % 4 === 0 && !this.isMuted) {
                const bOsc = this.ctx.createOscillator();
                const bGain = this.ctx.createGain();

                bOsc.type = 'sine';
                bOsc.frequency.setValueAtTime(bassFreq, now);

                bGain.gain.setValueAtTime(0.001, now);
                bGain.gain.linearRampToValueAtTime(this.bgmVolume * 0.35, now + 0.03);
                bGain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 3);

                bOsc.connect(bGain);
                bGain.connect(this.ctx.destination);

                bOsc.start(now);
                bOsc.stop(now + stepTime * 3);
            }

            // 3. Play Mid-Autumn Drum (Trống rước đèn: Tùng - Rinh)
            if (this.stepIndex % 4 === 0 && !this.isMuted) {
                // "TÙNG" - Bass Drum
                const dOsc = this.ctx.createOscillator();
                const dGain = this.ctx.createGain();

                dOsc.type = 'sine';
                dOsc.frequency.setValueAtTime(140, now);
                dOsc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

                dGain.gain.setValueAtTime(this.bgmVolume * 0.5, now);
                dGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

                dOsc.connect(dGain);
                dGain.connect(this.ctx.destination);

                dOsc.start(now);
                dOsc.stop(now + 0.15);
            } else if ((this.stepIndex % 4 === 2 || this.stepIndex % 8 === 7) && !this.isMuted) {
                // "RĨNH" - Woodblock / Snare tap
                const wOsc = this.ctx.createOscillator();
                const wGain = this.ctx.createGain();

                wOsc.type = 'triangle';
                wOsc.frequency.setValueAtTime(650, now);
                wOsc.frequency.exponentialRampToValueAtTime(250, now + 0.06);

                wGain.gain.setValueAtTime(this.bgmVolume * 0.3, now);
                wGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

                wOsc.connect(wGain);
                wGain.connect(this.ctx.destination);

                wOsc.start(now);
                wOsc.stop(now + 0.06);
            }

            this.stepIndex++;
            this.bgmTimer = setTimeout(scheduleBeat, stepTime * 1000);
        };

        scheduleBeat();
    }

    stopBGM() {
        this.isBgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    toggleBGM() {
        if (this.isBgmPlaying) {
            this.stopBGM();
            return false;
        } else {
            this.startBGM();
            return true;
        }
    }
}

// Global Sound Engine Instance
window.soundEngine = new SoundEngine();
