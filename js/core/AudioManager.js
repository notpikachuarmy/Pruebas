// Audio con Web Audio API.
// Cada sonido/música se define en data/audio/. Si existe un archivo (src) se usa;
// si no, se genera un placeholder sintetizado. Sustituir un placeholder = añadir `src`.

const MIN_GAP = 0.03; // no repetir el mismo efecto más de una vez cada 30 ms

export class AudioManager {
  constructor(settings, { sfx, music }) {
    this.settings = settings;
    this.sfxDefs = sfx;
    this.musicDefs = music;
    this.ctx = null;
    this.buffers = new Map();
    this.lastPlayed = new Map();
    this.currentMusic = null;
    this.musicNode = null;
    this.seq = null;
  }

  /** Los navegadores exigen un gesto del usuario (tecla/clic) antes de sonar. */
  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain.connect(this.master);
      this.musicGain.connect(this.master);
      this.applyVolumes();
      this._preloadFiles();
      if (this.pendingMusic) { const id = this.pendingMusic; this.pendingMusic = null; this.playMusic(id); }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  get ready() { return !!this.ctx && this.ctx.state === 'running'; }

  applyVolumes() {
    if (!this.ctx) return;
    this.sfxGain.gain.value = this.settings.sfxVolume;
    this.musicGain.gain.value = this.settings.musicVolume * 0.6;
  }

  async _preloadFiles() {
    const all = [...Object.entries(this.sfxDefs), ...Object.entries(this.musicDefs)];
    await Promise.all(all.filter(([, d]) => d.src).map(async ([id, d]) => {
      try {
        const res = await fetch(d.src);
        if (!res.ok) throw new Error(res.status);
        this.buffers.set(id, await this.ctx.decodeAudioData(await res.arrayBuffer()));
      } catch { /* sin archivo: se usará el sintetizador */ }
    }));
  }

  // ---------- Efectos ----------

  play(id, { pitch = 1, volume = 1 } = {}) {
    if (!this.ready) return;
    const now = this.ctx.currentTime;
    if (now - (this.lastPlayed.get(id) ?? -1) < MIN_GAP) return;
    this.lastPlayed.set(id, now);

    const buf = this.buffers.get(id);
    if (buf) {
      const src = this.ctx.createBufferSource();
      const g = this.ctx.createGain();
      src.buffer = buf; src.playbackRate.value = pitch; g.gain.value = volume;
      src.connect(g).connect(this.sfxGain);
      src.start();
      return;
    }
    const def = this.sfxDefs[id];
    if (def) this._synth(def, pitch, volume);
  }

  _synth(def, pitch, volume) {
    const ctx = this.ctx, t = ctx.currentTime;
    const g = ctx.createGain();
    const vol = (def.volume ?? 0.3) * volume;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + def.duration);
    g.connect(this.sfxGain);

    let src;
    if (def.wave === 'noise') {
      src = ctx.createBufferSource();
      src.buffer = this._noiseBuffer();
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = (def.from ?? 1000) * pitch;
      src.connect(f).connect(g);
    } else {
      src = ctx.createOscillator();
      src.type = def.wave ?? 'square';
      src.frequency.setValueAtTime((def.from ?? 440) * pitch, t);
      src.frequency.exponentialRampToValueAtTime(Math.max(20, (def.to ?? def.from ?? 440) * pitch), t + def.duration);
      src.connect(g);
    }
    src.start(t);
    src.stop(t + def.duration + 0.02);
  }

  _noiseBuffer() {
    if (this._noise) return this._noise;
    const len = this.ctx.sampleRate * 0.5;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return (this._noise = buf);
  }

  // ---------- Música ----------

  playMusic(id) {
    if (this.currentMusic === id) return;
    if (!this.ctx) { this.pendingMusic = id; return; }
    this.stopMusic();
    this.currentMusic = id;
    const def = this.musicDefs[id];
    if (!def) return;
    const buf = this.buffers.get(id);
    if (buf) {
      const src = this.ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      src.connect(this.musicGain);
      src.start();
      this.musicNode = src;
    } else if (def.pattern) {
      this._startSequencer(def);
    }
  }

  stopMusic() {
    this.currentMusic = null;
    this.pendingMusic = null;
    if (this.musicNode) { try { this.musicNode.stop(); } catch { /* ya parado */ } this.musicNode = null; }
    if (this.seq) { clearInterval(this.seq.timer); this.seq = null; }
  }

  /** Secuenciador mínimo para música placeholder (notas en semitonos sobre `root`). */
  _startSequencer(def) {
    const stepDur = 60 / def.bpm / 2; // corcheas
    const seq = { step: 0, next: this.ctx.currentTime + 0.1, timer: 0 };
    const schedule = () => {
      while (seq.next < this.ctx.currentTime + 0.15) {
        for (const voice of def.pattern) {
          const note = voice.notes[seq.step % voice.notes.length];
          if (note !== null && note !== undefined) this._note(def.root * 2 ** (note / 12) * (voice.octave ?? 1), seq.next, stepDur * (voice.length ?? 0.9), voice);
        }
        seq.step++;
        seq.next += stepDur;
      }
    };
    seq.timer = setInterval(schedule, 40);
    schedule();
    this.seq = seq;
  }

  _note(freq, when, dur, voice) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = voice.wave ?? 'triangle';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(voice.volume ?? 0.15, when + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(g).connect(this.musicGain);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }
}
