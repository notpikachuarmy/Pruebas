import { Scene } from './Scene.js';
import { Backdrop } from '../ui/Backdrop.js';

const DURATION = 4.2;

/** Entre dos sueños de la misma noche: el soñador anterior se calma y se sintoniza el siguiente. */
export class DreamTransitionScene extends Scene {
  constructor(game, from, to, onDone) {
    super(game);
    this.from = from; this.to = to; this.onDone = onDone;
    this.backdrop = new Backdrop(40);
    this.done = false;
  }

  enter() { this.game.audio.stopMusic(); this.game.audio.play('cleared', { pitch: 0.7 }); }

  update(dt) {
    super.update(dt);
    const skip = this.time > 1.2 && this.game.input.isPressed('UI_CONFIRM');
    if (!this.done && (this.time >= DURATION || skip)) {
      this.done = true;
      this.game.popScene();
      this.onDone();
    }
  }

  renderWorld(g) {
    this.backdrop.render(g, this.time, {
      sprite: this.game.assets.sprite('player'),
      player: { x: 240, y: 230, scale: 3 },
    });
  }

  renderUI(r) {
    const t = this.time;
    const a1 = Math.min(1, t * 2, Math.max(0, (2 - t) * 2));
    const a2 = Math.min(1, Math.max(0, (t - 1.8) * 2));
    r.text(this.from.text.transition ?? `${this.from.owner.name} duerme tranquilo.`, 240, 96, { size: 12, color: '#c9bde6', align: 'center', alpha: a1 });
    r.text('Sintonizando otro sueño…', 240, 116, { size: 9, color: '#9b8fc7', align: 'center', alpha: Math.min(a1 + a2, 1) * 0.8 });
    r.text(this.to.name, 240, 96, { size: 20, weight: 700, color: '#fff6d6', align: 'center', alpha: a2 });
    r.text(`${this.to.owner.name}, ${this.to.owner.age} años`, 240, 132, { size: 10, color: '#c9bde6', align: 'center', alpha: a2 });
    r.text(this.to.owner.summary, 240, 148, { size: 8, color: '#9b8fc7', align: 'center', alpha: a2 });
  }
}
