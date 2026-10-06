import { VIEW_W, VIEW_H } from '../core/config.js';
import { Random } from '../core/Random.js';

/** Fondo de los menús: cielo nocturno con estrellas y "Z" flotando. Puramente decorativo. */
export class Backdrop {
  constructor(count = 60) {
    const rng = new Random('cielo');
    this.stars = Array.from({ length: count }, () => ({
      x: rng.range(0, VIEW_W), y: rng.range(0, VIEW_H * 0.75), p: rng.range(0, 6.28), s: rng.chance(0.25) ? 2 : 1,
    }));
    this.zs = Array.from({ length: 5 }, (_, i) => ({ t: i * 1.3 }));
  }

  render(g, time, { player, sprite } = {}) {
    g.fillStyle = '#17122b';
    g.fillRect(0, 0, VIEW_W, VIEW_H);
    // Bandas de color: atardecer de sueño hacia abajo
    const bands = ['#1b1533', '#211a3e', '#281f4a', '#2e2552'];
    bands.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, VIEW_H - (4 - i) * 22, VIEW_W, 22); });
    for (const s of this.stars) {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(time * 0.8 + s.p));
      g.globalAlpha = a;
      g.fillStyle = s.s === 2 ? '#e8e6dc' : '#9b8fc7';
      g.fillRect(Math.round(s.x), Math.round(s.y + Math.sin(time * 0.2 + s.p) * 2), s.s, s.s);
    }
    g.globalAlpha = 1;
    if (sprite && player) {
      const { x, y, scale } = player;
      sprite.draw(g, 'idle', time, x, y, { scale });
      // "Z" que suben desde los auriculares
      for (const z of this.zs) {
        const t = (time + z.t) % 6.5 / 6.5;
        g.globalAlpha = Math.sin(t * Math.PI);
        g.fillStyle = '#c9bde6';
        const zx = Math.round(x + 28 + t * 30 + Math.sin(t * 8) * 4), zy = Math.round(y - 90 - t * 60);
        const k = 3 + Math.round(t * 4);           // tamaño de la "Z"
        g.fillRect(zx, zy, k, 1);
        for (let i = 1; i < k - 1; i++) g.fillRect(zx + k - 1 - i, zy + i, 1, 1);
        g.fillRect(zx, zy + k - 1, k, 1);
      }
      g.globalAlpha = 1;
    }
  }
}
