import { VIEW_W, VIEW_H } from '../core/config.js';

/** Avisos breves en la esquina (mando conectado, guardado, etc.). */
export class Toasts {
  constructor(game) { this.game = game; this.items = []; }

  show(text, duration = 2.6) {
    this.items.push({ text, t: 0, duration });
    if (this.items.length > 4) this.items.shift();
  }

  update(dt) {
    for (const it of this.items) it.t += dt;
    this.items = this.items.filter((it) => it.t < it.duration);
  }

  render(r) {
    let y = VIEW_H - 10;
    for (const it of this.items) {
      const a = Math.min(1, it.t * 6, (it.duration - it.t) * 3);
      const w = r.measure(it.text, 8) + 12;
      const ctx = r.ui;
      ctx.globalAlpha = a * 0.85;
      ctx.fillStyle = '#2e2552';
      ctx.fillRect(VIEW_W - w - 6, y - 8, w, 13);
      ctx.globalAlpha = 1;
      r.text(it.text, VIEW_W - 12, y + 1, { size: 8, align: 'right', color: '#e8e6dc', alpha: a, shadow: null });
      y -= 16;
    }
  }
}
