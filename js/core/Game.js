import { VIEW_W, VIEW_H, FIXED_DT, MAX_FRAME_DT, SAVE_KEY, DEBUG } from './config.js';
import { Renderer } from './Renderer.js';
import { Input } from './Input.js';
import { Haptics } from './Haptics.js';
import { SaveSystem } from './SaveSystem.js';
import { AudioManager } from './AudioManager.js';
import { Assets } from './Assets.js';
import { EventBus } from './EventBus.js';
import { Toasts } from '../ui/Toasts.js';
import { MetaStats } from '../progression/MetaStats.js';
import { CONTENT } from '../../data/registry.js';

/**
 * Núcleo: bucle de paso fijo + pila de escenas + servicios compartidos.
 * Las escenas reciben `game` y usan sus servicios (input, audio, save, assets...).
 */
export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.content = CONTENT;
    this.debug = DEBUG;
    this.events = new EventBus();
    this.save = new SaveSystem(SAVE_KEY);
    this.save.load();
    const { settings, bindings } = this.save.data;

    this.renderer = new Renderer(canvas, VIEW_W, VIEW_H);
    this.input = new Input(settings, bindings);
    this.haptics = new Haptics(this.input, settings);
    this.audio = new AudioManager(settings, CONTENT.audio);
    this.assets = new Assets();
    this.toasts = new Toasts(this);
    this.meta = new MetaStats(this);

    this.scenes = [];
    this.time = 0;
    this.fps = 60;
    this._acc = 0;
    this._last = 0;
    this._frame = this._frame.bind(this);

    this.input.onChange((e) => this._onInputEvent(e));
    const unlock = () => this.audio.unlock();
    window.addEventListener('keydown', unlock);
    window.addEventListener('pointerdown', unlock);
  }

  async boot() {
    // Espera a la fuente (máx. 1,5 s) para que el texto no cambie de golpe.
    if (document.fonts?.load) {
      await Promise.race([document.fonts.load('10px "Pixelify Sans"'), new Promise((r) => setTimeout(r, 1500))]).catch(() => {});
    }
    await this.assets.load(CONTENT.assets);
    if (this.assets.missing.length) console.warn('[Game] Assets que faltan (se usan placeholders):', this.assets.missing);
  }

  start(scene) {
    this.setScene(scene);
    this.canvas.focus();
    requestAnimationFrame((t) => { this._last = t; requestAnimationFrame(this._frame); });
  }

  // ---------- Escenas ----------

  get scene() { return this.scenes[this.scenes.length - 1]; }

  setScene(scene) {
    while (this.scenes.length) this.scenes.pop().exit?.();
    this.scenes.push(scene);
    scene.enter?.();
  }

  pushScene(scene) {
    this.scene?.pause?.();
    this.scenes.push(scene);
    scene.enter?.();
  }

  popScene() {
    const s = this.scenes.pop();
    s?.exit?.();
    this.scene?.resume?.();
  }

  // ---------- Bucle ----------

  _frame(t) {
    let dt = (t - this._last) / 1000;
    this._last = t;
    if (dt > MAX_FRAME_DT) dt = MAX_FRAME_DT;
    if (dt > 0) this.fps += (1 / dt - this.fps) * 0.05;

    this._acc += dt;
    while (this._acc >= FIXED_DT) {
      this.input.update(FIXED_DT);
      this.scene?.update(FIXED_DT);
      this.toasts.update(FIXED_DT);
      this.time += FIXED_DT;
      this._acc -= FIXED_DT;
    }

    const r = this.renderer;
    r.beginFrame();
    const visible = this._visibleScenes();
    for (const s of visible) s.renderWorld?.(r.world, r);
    r.present();
    for (const s of visible) s.renderUI?.(r);
    this.toasts.render(r);
    if (this.save.data.settings.showFps) r.text(`${Math.round(this.fps)} fps`, 4, VIEW_H - 4, { size: 7, color: '#9b8fc7' });

    requestAnimationFrame(this._frame);
  }

  /** Desde la última escena opaca hasta la superior (las superpuestas dejan ver las de abajo). */
  _visibleScenes() {
    let i = this.scenes.length - 1;
    while (i > 0 && this.scenes[i].overlay) i--;
    return this.scenes.slice(i);
  }

  _onInputEvent(e) {
    if (e.type === 'connected') {
      const style = { xbox: 'Xbox', playstation: 'PlayStation', nintendo: 'Nintendo' }[e.style] ?? 'genérico';
      this.toasts.show(`Mando conectado (${style})`);
      if (e.mapping !== 'standard') this.toasts.show('Mando sin mapeo estándar: algunos botones pueden variar');
    } else if (e.type === 'disconnected') {
      this.toasts.show('Mando desconectado');
      this.events.emit('input:padLost');
    }
  }
}
