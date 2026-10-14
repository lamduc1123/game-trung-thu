/**
 * Sound Engine for Hãy Chọn Giá Đúng (The Price Is Right) - Đại Hội 20/10 Phụ Nữ Việt Nam 🌸💖
 * - Pure Web Audio API synthesis: zero external audio files, zero latency, runs offline.
 * - Upbeat, sparkling, celebratory Pop / Dance BGM tailored for Women's Day party.
 * - Full SFX suite: Player join pop, countdown tick/urgent, correct chime, wrong buzzer, reveal fanfare, finale fireworks.
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
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.12);

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
        osc.frequency.setValueAtTime(isUrgent ? 987.77 : 587.33, now); // B5 or D5
        osc.frequency.exponentialRampToValueAtTime(isUrgent ? 493.88 : 293.66, now + 0.05);

        gain.gain.setValueAtTime(this.sfxVolume * (isUrgent ? 0.35 : 0.2), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Correct Answer / Bullseye Chime
    playCorrect() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.001, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.45, now + idx * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.45);
        });
    }

    // Wrong / Time-out Buzzer
    playWrong() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.3);

        gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Grand Cheer & Confetti Fireworks
    playCheer() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Fanfare Arpeggio
        const fanfare = [
            { f: 523.25, t: 0.0 },
            { f: 659.25, t: 0.1 },
            { f: 783.99, t: 0.2 },
            { f: 1046.50, t: 0.3 },
            { f: 1318.51, t: 0.45 },
            { f: 1567.98, t: 0.6 }
        ];

        fanfare.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, now + item.t);

            gain.gain.setValueAtTime(0.001, now + item.t);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, now + item.t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + 0.7);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + item.t);
            osc.stop(now + item.t + 0.7);
        });
    }

    // --- UPBEAT & JOYFUL WOMEN'S DAY 20/10 BGM SYNTHESIZER ---
    startBGM() {
        if (this.isBgmPlaying) return;
        this.init();
        this.isBgmPlaying = true;
        this.stepIndex = 0;

        // Melodic Pop Progression: C Major -> G Major -> A Minor -> F Major (Vui tươi, rạng rỡ, tràn đầy năng lượng)
        // 32-step 16th-note loop
        const melody = [
            523.25, 659.25, 783.99, 1046.50, // C5 E5 G5 C6 (C Major arpeggio)
            783.99, 659.25, 880.00, 783.99,  // G5 E5 A5 G5
            392.00, 587.33, 783.99, 987.77,  // G4 D5 G5 B5 (G Major)
            783.99, 587.33, 659.25, 587.33,  // G5 D5 E5 D5
            440.00, 523.25, 659.25, 880.00,  // A4 C5 E5 A5 (Am)
            659.25, 523.25, 783.99, 659.25,  // E5 C5 G5 E5
            349.23, 440.00, 523.25, 698.46,  // F4 A4 C5 F5 (F Major)
            659.25, 587.33, 523.25, 587.33   // E5 D5 C5 D5
        ];

        // Bouncy disco pop bassline
        const bassline = [
            130.81, 130.81, 196.00, 261.63,  // C3 C3 G3 C4
            98.00,  98.00,  146.83, 196.00,  // G2 G2 D3 G3
            110.00, 110.00, 164.81, 220.00,  // A2 A2 E3 A3
            87.31,  87.31,  130.81, 174.61   // F2 F2 C3 F3
        ];

        const bpm = 126; // Chuẩn tempo Dance-Pop sôi động
        const stepTime = (60 / bpm) / 4; // 16th note timing

        const scheduleBeat = () => {
            if (!this.isBgmPlaying) return;
            const now = this.ctx.currentTime;
            const step = this.stepIndex % 32;

            // 1. Sparkling Marimba / Synth Melody
            const noteFreq = melody[step];
            if (noteFreq && (step % 2 === 0 || step === 7 || step === 15 || step === 23 || step === 31) && !this.isMuted) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(noteFreq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(this.bgmVolume * 0.28, now + 0.015);
                gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 1.8);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + stepTime * 1.8);
            }

            // 2. Groovy Pop Bass
            const bassIdx = Math.floor(step / 2) % bassline.length;
            const bassFreq = bassline[bassIdx];
            if (bassFreq && (step % 2 === 0) && !this.isMuted) {
                const bOsc = this.ctx.createOscillator();
                const bGain = this.ctx.createGain();

                bOsc.type = 'sine';
                bOsc.frequency.setValueAtTime(bassFreq, now);

                bGain.gain.setValueAtTime(0.001, now);
                bGain.gain.linearRampToValueAtTime(this.bgmVolume * 0.4, now + 0.02);
                bGain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 1.9);

                bOsc.connect(bGain);
                bGain.connect(this.ctx.destination);

                bOsc.start(now);
                bOsc.stop(now + stepTime * 1.9);
            }

            // 3. Four-on-the-Floor Pop Kick (Beats 1, 2, 3, 4)
            if (step % 4 === 0 && !this.isMuted) {
                const kOsc = this.ctx.createOscillator();
                const kGain = this.ctx.createGain();

                kOsc.type = 'sine';
                kOsc.frequency.setValueAtTime(150, now);
                kOsc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

                kGain.gain.setValueAtTime(this.bgmVolume * 0.55, now);
                kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

                kOsc.connect(kGain);
                kGain.connect(this.ctx.destination);

                kOsc.start(now);
                kOsc.stop(now + 0.12);
            }

            // 4. Pop Snare / Hand Clap on beats 2 & 4 (steps 4, 12, 20, 28)
            if ((step % 8 === 4) && !this.isMuted) {
                const sOsc = this.ctx.createOscillator();
                const sGain = this.ctx.createGain();

                sOsc.type = 'triangle';
                sOsc.frequency.setValueAtTime(420, now);
                sOsc.frequency.exponentialRampToValueAtTime(180, now + 0.09);

                sGain.gain.setValueAtTime(this.bgmVolume * 0.38, now);
                sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

                sOsc.connect(sGain);
                sGain.connect(this.ctx.destination);

                sOsc.start(now);
                sOsc.stop(now + 0.09);
            }

            // 5. Crisp Hi-Hat Ticks on offbeats (steps 2, 6, 10, 14, 18, 22, 26, 30)
            if ((step % 2 === 1) && !this.isMuted) {
                const hOsc = this.ctx.createOscillator();
                const hGain = this.ctx.createGain();

                hOsc.type = 'square';
                hOsc.frequency.setValueAtTime(1800, now);

                hGain.gain.setValueAtTime(this.bgmVolume * 0.08, now);
                hGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

                hOsc.connect(hGain);
                hGain.connect(this.ctx.destination);

                hOsc.start(now);
                hOsc.stop(now + 0.035);
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
