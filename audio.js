/**
 * Sound Engine for Hãy Chọn Giá Đúng (The Price Is Right) - Halloween Spooky Edition 🎃👻🦇
 * - Pure Web Audio API synthesis: zero external audio files, zero latency, runs offline.
 * - Catchy, playful, spooky Halloween Dance/Carnival BGM (D Minor spooky groove).
 * - Full Halloween SFX suite: Ghostly join woo, haunted clock tick, potion chime, dungeon buzzer, witch cheer fanfare.
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

    // --- HALLOWEEN SFX SUITE ---

    // Ghostly playful "Woo-hoo!" pop when player enters room
    playJoin() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // Ghostly sweep: 440Hz -> 880Hz -> 660Hz
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.22);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.45, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    // Clock tick in a haunted mansion (bone-click / hollow tick)
    playTick(isUrgent = false) {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Woodblock / bone click tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isUrgent ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(isUrgent ? 880 : 587.33, now); // A5 or D5
        osc.frequency.exponentialRampToValueAtTime(isUrgent ? 300 : 220, now + 0.05);

        gain.gain.setValueAtTime(this.sfxVolume * (isUrgent ? 0.38 : 0.22), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.055);
    }

    // Magical Witch's Cauldron / Bullseye Chime
    playCorrect() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        // Spooky mystical whole-tone / major-minor arpeggio (D5, F#5, A5, C6, D6, F#6)
        const notes = [587.33, 739.99, 880.00, 1046.50, 1174.66, 1479.98];

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0.001, now + idx * 0.07);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.45, now + idx * 0.07 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.5);
        });
    }

    // Spooky Dungeon / Phantom Organ Wrong Buzzer
    playWrong() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Dissonant minor second chord (Eb + D) to sound like a creepy pipe organ!
        [155.56, 146.83, 73.42].forEach((freq) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.linearRampToValueAtTime(freq * 0.85, now + 0.38);

            gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.38);
        });
    }

    // Spooky Carnival Fanfare & Jack-o'-Lantern Fireworks
    playCheer() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        // Halloween Grand Fanfare: D Minor into triumphant D Major
        const fanfare = [
            { f: 293.66, t: 0.0 },   // D4
            { f: 369.99, t: 0.12 },  // F#4
            { f: 440.00, t: 0.24 },  // A4
            { f: 587.33, t: 0.36 },  // D5
            { f: 739.99, t: 0.50 },  // F#5
            { f: 880.00, t: 0.65 }   // A5
        ];

        fanfare.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, now + item.t);

            gain.gain.setValueAtTime(0.001, now + item.t);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, now + item.t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + 0.75);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + item.t);
            osc.stop(now + item.t + 0.75);
        });
    }

    // Playful Witch Cackle / Spooky Sound
    playWitchLaugh() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const freqs = [600, 750, 620, 800, 650, 850, 700];

        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, now + i * 0.06);

            gain.gain.setValueAtTime(this.sfxVolume * 0.25, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.055);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.055);
        });
    }

    // --- CATCHY & PLAYFUL HALLOWEEN GROOVE BGM (D MINOR SPOOKY CARNIVAL) ---
    startBGM() {
        if (this.isBgmPlaying) return;
        this.init();
        this.isBgmPlaying = true;
        this.stepIndex = 0;

        // Spooky music-box / xylophone melody (32-step loop in D Minor)
        // Danse Macabre & Addams Family mysterious, catchy dance vibe:
        const melody = [
            587.33, 0,      698.46, 880.00,  // D5 . F5 A5
            1174.66, 1108.73, 880.00, 830.61,// D6 C#6 A5 G#5 (Spooky tritone!)
            587.33, 0,      698.46, 880.00,  // D5 . F5 A5
            1046.50, 987.77, 880.00, 739.99, // C6 B5 A5 F#5
            783.99, 0,      932.33, 1174.66, // G5 . Bb5 D6
            1108.73, 987.77, 880.00, 783.99, // C#6 B5 A5 G5
            880.00, 0,      1108.73, 1318.51,// A5 . C#6 E6
            1174.66, 1046.50, 932.33, 880.00 // D6 C6 Bb5 A5
        ];

        // Ghostly theremin / eerie whistle glide on select measures
        const eerieWhistle = [
            0,      0,      0,      1174.66,
            0,      0,      1108.73, 0,
            0,      0,      0,      1046.50,
            0,      0,      987.77,  0,
            0,      0,      0,      1174.66,
            0,      0,      1108.73, 0,
            0,      0,      0,      1318.51,
            0,      0,      1174.66, 0
        ];

        // Bouncing gothic bassline (D minor -> G minor -> A major -> D minor)
        const bassline = [
            146.83, 146.83, 220.00, 146.83,  // D3 D3 A3 D3
            146.83, 174.61, 207.65, 220.00,  // D3 F3 G#3 A3
            196.00, 196.00, 293.66, 196.00,  // G3 G3 D4 G3
            220.00, 277.18, 329.63, 220.00   // A3 C#4 E4 A3
        ];

        const bpm = 126; // High-energy Spooky Dance Tempo
        const stepTime = (60 / bpm) / 4; // 16th note step

        const scheduleBeat = () => {
            if (!this.isBgmPlaying) return;
            const now = this.ctx.currentTime;
            const step = this.stepIndex % 32;

            // 1. Spooky Staccato Skeleton Marimba / Harpsichord Melody
            const noteFreq = melody[step];
            if (noteFreq && !this.isMuted) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(noteFreq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(this.bgmVolume * 0.32, now + 0.012);
                gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 1.6);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + stepTime * 1.6);
            }

            // 2. Ghostly Theremin / Whistle Sound (every 4th step when present)
            const whistleFreq = eerieWhistle[step];
            if (whistleFreq && !this.isMuted) {
                const wOsc = this.ctx.createOscillator();
                const wGain = this.ctx.createGain();

                wOsc.type = 'sine';
                wOsc.frequency.setValueAtTime(whistleFreq, now);
                wOsc.frequency.linearRampToValueAtTime(whistleFreq * 1.02, now + stepTime * 2);

                wGain.gain.setValueAtTime(0.001, now);
                wGain.gain.linearRampToValueAtTime(this.bgmVolume * 0.15, now + 0.04);
                wGain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 3.5);

                wOsc.connect(wGain);
                wGain.connect(this.ctx.destination);

                wOsc.start(now);
                wOsc.stop(now + stepTime * 3.5);
            }

            // 3. Groovy Spooky Bassline
            const bassIdx = Math.floor(step / 2) % bassline.length;
            const bassFreq = bassline[bassIdx];
            if (bassFreq && (step % 2 === 0) && !this.isMuted) {
                const bOsc = this.ctx.createOscillator();
                const bGain = this.ctx.createGain();

                bOsc.type = 'sawtooth';
                bOsc.frequency.setValueAtTime(bassFreq, now);

                // Low-pass feel
                bGain.gain.setValueAtTime(0.001, now);
                bGain.gain.linearRampToValueAtTime(this.bgmVolume * 0.38, now + 0.02);
                bGain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 1.8);

                bOsc.connect(bGain);
                bGain.connect(this.ctx.destination);

                bOsc.start(now);
                bOsc.stop(now + stepTime * 1.8);
            }

            // 4. Punchy Haunted Kick (Beats 1, 2, 3, 4)
            if (step % 4 === 0 && !this.isMuted) {
                const kOsc = this.ctx.createOscillator();
                const kGain = this.ctx.createGain();

                kOsc.type = 'sine';
                kOsc.frequency.setValueAtTime(140, now);
                kOsc.frequency.exponentialRampToValueAtTime(42, now + 0.12);

                kGain.gain.setValueAtTime(this.bgmVolume * 0.55, now);
                kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

                kOsc.connect(kGain);
                kGain.connect(this.ctx.destination);

                kOsc.start(now);
                kOsc.stop(now + 0.12);
            }

            // 5. Crisp Skeleton Bone Snare / Clap on beats 2 & 4 (steps 4, 12, 20, 28)
            if ((step % 8 === 4) && !this.isMuted) {
                const sOsc = this.ctx.createOscillator();
                const sGain = this.ctx.createGain();

                sOsc.type = 'triangle';
                sOsc.frequency.setValueAtTime(550, now);
                sOsc.frequency.exponentialRampToValueAtTime(190, now + 0.09);

                sGain.gain.setValueAtTime(this.bgmVolume * 0.38, now);
                sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

                sOsc.connect(sGain);
                sGain.connect(this.ctx.destination);

                sOsc.start(now);
                sOsc.stop(now + 0.09);
            }

            // 6. Cobweb Hi-Hat Ticks on offbeats
            if ((step % 2 === 1) && !this.isMuted) {
                const hOsc = this.ctx.createOscillator();
                const hGain = this.ctx.createGain();

                hOsc.type = 'square';
                hOsc.frequency.setValueAtTime(2200, now);

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
