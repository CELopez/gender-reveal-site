// Enhanced Sound Generator for Slot Machine
// Creates high-quality procedural audio for casino effects

class SoundGenerator {
    constructor() {
        this.audioContext = null;
        this.sampleRate = 44100;
        this.init();
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }
    
    // Generate anticipation/buildup sound
    generateAnticipationSound() {
        const duration = 2.0;
        const length = this.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, this.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / this.sampleRate;
            const progress = t / duration;
            
            // Rising frequency sweep with tension
            const baseFreq = 100 + progress * 300;
            const tremolo = Math.sin(t * 20) * 0.3 + 0.7;
            const envelope = Math.sin(progress * Math.PI) * (1 - progress * 0.3);
            
            // Combine multiple oscillators for richness
            const osc1 = Math.sin(2 * Math.PI * baseFreq * t);
            const osc2 = Math.sin(2 * Math.PI * baseFreq * 1.5 * t) * 0.5;
            const noise = (Math.random() - 0.5) * 0.1;
            
            data[i] = (osc1 + osc2 + noise) * envelope * tremolo * 0.3;
        }
        
        return this.bufferToDataURL(buffer);
    }
    
    // Generate handle pull sound
    generateHandlePullSound() {
        const duration = 0.8;
        const length = this.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, this.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / this.sampleRate;
            const progress = t / duration;
            
            // Mechanical click and whoosh
            let signal = 0;
            
            // Initial click (first 0.1 seconds)
            if (t < 0.1) {
                const clickEnv = Math.exp(-t * 50);
                const click = Math.sin(2 * Math.PI * 800 * t) + 
                            Math.sin(2 * Math.PI * 1200 * t) * 0.5;
                signal += click * clickEnv;
            }
            
            // Mechanical movement (0.1 to 0.6 seconds)
            if (t > 0.1 && t < 0.6) {
                const moveEnv = Math.sin((t - 0.1) / 0.5 * Math.PI);
                const lowFreq = 60 + Math.sin(t * 30) * 20;
                const movement = Math.sin(2 * Math.PI * lowFreq * t);
                const friction = (Math.random() - 0.5) * 0.3;
                signal += (movement + friction) * moveEnv * 0.4;
            }
            
            // Spring back (0.6 to 0.8 seconds)
            if (t > 0.6) {
                const springEnv = Math.exp(-(t - 0.6) * 10);
                const spring = Math.sin(2 * Math.PI * 400 * (t - 0.6));
                signal += spring * springEnv * 0.3;
            }
            
            data[i] = signal * 0.6;
        }
        
        return this.bufferToDataURL(buffer);
    }
    
    // Generate reel spinning sound
    generateReelSpinSound() {
        const duration = 3.0;
        const length = this.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, this.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / this.sampleRate;
            
            // Continuous mechanical whirring
            const baseFreq = 150 + Math.sin(t * 3) * 30;
            const harmonics = [1, 0.5, 0.25, 0.125];
            let signal = 0;
            
            harmonics.forEach((amp, idx) => {
                signal += Math.sin(2 * Math.PI * baseFreq * (idx + 1) * t) * amp;
            });
            
            // Add mechanical texture
            const texture = (Math.random() - 0.5) * 0.2;
            const flutter = Math.sin(t * 25) * 0.1 + 0.9;
            
            data[i] = (signal + texture) * flutter * 0.25;
        }
        
        return this.bufferToDataURL(buffer);
    }
    
    // Generate reel stop sound
    generateReelStopSound() {
        const duration = 1.2;
        const length = this.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, this.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / this.sampleRate;
            const progress = t / duration;
            
            // Deceleration sound with final thunk
            let signal = 0;
            
            // Deceleration (first 0.8 seconds)
            if (t < 0.8) {
                const decelFreq = 200 * (1 - progress * 0.7);
                const decelEnv = Math.exp(-t * 2) * (1 - progress);
                signal += Math.sin(2 * Math.PI * decelFreq * t) * decelEnv;
            }
            
            // Impact/thunk (0.8 to 1.2 seconds)
            if (t > 0.8) {
                const impactTime = t - 0.8;
                const impactEnv = Math.exp(-impactTime * 15);
                const lowThunk = Math.sin(2 * Math.PI * 80 * impactTime);
                const midThunk = Math.sin(2 * Math.PI * 200 * impactTime) * 0.7;
                const highClick = Math.sin(2 * Math.PI * 800 * impactTime) * 0.3;
                
                signal += (lowThunk + midThunk + highClick) * impactEnv;
            }
            
            data[i] = signal * 0.7;
        }
        
        return this.bufferToDataURL(buffer);
    }
    
    // Generate jackpot sound
    generateJackpotSound() {
        const duration = 2.5;
        const length = this.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, this.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / this.sampleRate;
            const progress = t / duration;
            
            // Triumphant fanfare-like sound
            let signal = 0;
            
            // Rising major chord progression
            const fundamentals = [262, 330, 392, 523]; // C major chord
            const envelope = Math.sin(progress * Math.PI * 2) * Math.exp(-progress * 1.5);
            
            fundamentals.forEach((freq, idx) => {
                const freqMod = freq * (1 + Math.sin(t * 8) * 0.02); // Slight vibrato
                const amplitude = 1 / (idx + 1); // Lower amplitude for higher harmonics
                signal += Math.sin(2 * Math.PI * freqMod * t) * amplitude;
            });
            
            // Add sparkle with higher frequencies
            const sparkle = Math.sin(2 * Math.PI * 1000 * t) * 
                          Math.sin(t * 30) * 0.3 * envelope;
            
            data[i] = (signal + sparkle) * envelope * 0.4;
        }
        
        return this.bufferToDataURL(buffer);
    }
    
    // Generate celebration sound
    generateCelebrationSound() {
        const duration = 3.0;
        const length = this.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, this.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            const t = i / this.sampleRate;
            const progress = t / duration;
            
            // Festive, uplifting melody
            let signal = 0;
            
            // Main melody
            const melodyNotes = [523, 659, 784, 1047]; // C, E, G, C (octave)
            const noteIndex = Math.floor(progress * melodyNotes.length);
            const noteFreq = melodyNotes[Math.min(noteIndex, melodyNotes.length - 1)];
            
            const melody = Math.sin(2 * Math.PI * noteFreq * t);
            const melodyEnv = Math.sin(progress * Math.PI);
            
            // Harmony
            const harmony = Math.sin(2 * Math.PI * noteFreq * 0.75 * t) * 0.5;
            
            // Percussion-like rhythm
            const rhythm = Math.sin(2 * Math.PI * 80 * t) * 
                          (Math.sin(t * 16) > 0 ? 1 : 0) * 0.3;
            
            // High frequency sparkles
            const sparkles = Math.sin(2 * Math.PI * 2000 * t) * 
                           Math.sin(t * 50) * 0.2 * melodyEnv;
            
            signal = (melody + harmony + rhythm + sparkles) * melodyEnv;
            data[i] = signal * 0.5;
        }
        
        return this.bufferToDataURL(buffer);
    }
    
    // Convert audio buffer to data URL
    bufferToDataURL(buffer) {
        const length = buffer.length;
        const arrayBuffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(arrayBuffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, this.sampleRate, true);
        view.setUint32(28, this.sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * 2, true);
        
        // Convert float samples to 16-bit PCM
        const samples = buffer.getChannelData(0);
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }
        
        const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
        return URL.createObjectURL(blob);
    }
    
    // Generate all sounds and return URLs
    generateAllSounds() {
        if (!this.audioContext) {
            console.warn('Audio context not available');
            return {};
        }
        
        return {
            anticipation: this.generateAnticipationSound(),
            handlePull: this.generateHandlePullSound(),
            reelSpin: this.generateReelSpinSound(),
            reelStop: this.generateReelStopSound(),
            jackpot: this.generateJackpotSound(),
            celebration: this.generateCelebrationSound()
        };
    }
}

// Export for use in slot machine
window.SoundGenerator = SoundGenerator;