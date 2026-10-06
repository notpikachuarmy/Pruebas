import { Pool } from '../core/Pool.js';

/**
 * Zonas en el suelo que afectan al jugador (charcos de tinta, etc.).
 * Cada tipo define su efecto en HAZARD_TYPES: así un enemigo nuevo puede reutilizarlos.
 */
export const HAZARD_TYPES = {
  ink: {
    color: '#25307a', edge: '#3d4ca8',
    onPlayer(player) { player.slowFactor = Math.min(player.slowFactor, 0.55); },
  },
};

export class Hazards {
  constructor(world, capacity = 128) {
    this.world = world;
    this.pool = new Pool(() => ({ active: false, type: 'ink', x: 0, y: 0, r: 6, life: 0, max: 1, seed: 0 }), capacity);
  }

  spawn(type, x, y, r, life) {
    let h = this.pool.spawn();
    if (!h) {
      // Pool lleno: reciclamos el charco más viejo en lugar de perder el nuevo
      h = this.pool.active.reduce((a, b) => (a.life < b.life ? a : b));
    }
    h.type = type; h.x = x; h.y = y; h.r = r; h.life = life; h.max = life; h.seed = Math.random() * 10;
    return h;
  }

  update(dt) {
    const player = this.world.player;
    for (const h of this.pool.active) {
      h.life -= dt;
      if (h.life <= 0) { h.active = false; continue; }
      if (player.alive && !player.isDashing) {
        const dx = player.x - h.x, dy = (player.y - h.y) * 1.6; // elipse
        if (dx * dx + dy * dy < h.r * h.r) HAZARD_TYPES[h.type].onPlayer(player, h);
      }
    }
    this.pool.sweep();
  }

  render(g) {
    for (const h of this.pool.active) {
      const t = HAZARD_TYPES[h.type];
      const a = Math.min(1, h.life / 0.6, (h.max - h.life) / 0.1);
      const r = h.r * (0.7 + 0.3 * Math.min(1, (h.max - h.life) / 0.25));
      g.globalAlpha = a * 0.85;
      g.fillStyle = t.color;
      g.beginPath();
      g.ellipse(Math.round(h.x), Math.round(h.y), r, r * 0.6, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = t.edge;
      g.fillRect(Math.round(h.x - r * 0.4), Math.round(h.y - r * 0.3), 2, 1);
    }
    g.globalAlpha = 1;
  }

  clear() { this.pool.clear(); }
}
