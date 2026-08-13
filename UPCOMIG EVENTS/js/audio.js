/**
 * ============================================================
 *  ONAM -> PORSCHE MICROSITE — AUDIO SYNTHESIZER ENGINE
 *  Web Audio API pure synthesized sound design (No external files needed)
 * ============================================================
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isInitialized = false;
    this.engineRevOsc = null;
    this.engineRevGain = null;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.ctx.state === 'suspended' && !this.isMuted) {
      this.ctx.resume();
    }
    return this.isMuted;
  }

  playWhoosh(speedFactor = 1) {
    if (!this.ctx || this.isMuted) return;
    
    const now = this.ctx.currentTime;
    const duration = 0.25;
    
    // Create white noise
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter sweep
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1800 * speedFactor, now + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(200, now + duration);
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12 * speedFactor, now + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  playClick() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playEngineRev() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const duration = 2.5;

    // Dual oscillator setup for deep Porsche Flat-6 engine roar
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    subOsc.type = 'triangle';

    // Pitch sweep: idle 80Hz -> rev 340Hz -> idle 70Hz
    osc1.frequency.setValueAtTime(75, now);
    osc1.frequency.exponentialRampToValueAtTime(320, now + 0.8);
    osc1.frequency.exponentialRampToValueAtTime(80, now + duration);

    osc2.frequency.setValueAtTime(150, now);
    osc2.frequency.exponentialRampToValueAtTime(640, now + 0.8);
    osc2.frequency.exponentialRampToValueAtTime(160, now + duration);

    subOsc.frequency.setValueAtTime(37.5, now);
    subOsc.frequency.exponentialRampToValueAtTime(160, now + 0.8);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + duration);

    // Lowpass filter sweep for exhaust growl
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.8);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);
    filter.Q.value = 4.0;

    // Volume Envelope
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    subOsc.start(now);

    osc1.stop(now + duration);
    osc2.stop(now + duration);
    subOsc.stop(now + duration);
  }
}

window.soundEngine = new AudioEngine();
