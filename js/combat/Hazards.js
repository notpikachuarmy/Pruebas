import { Pool } from '../core/Pool.js';

/**
 * Zonas en el suelo que afectan al jugador. Cada tipo define:
 *  onPlayer(player, h, world)  mientras el jugador está dentro
 *  onExpire(h, world)          al terminar (opcional)
 *  ink: true                   su duración se multiplica por world.mods.inkLife (regla "La tinta no se seca")
 */
export const HAZARD_TYPES = {
  ink: {
    ink: true, color: '#25307a', edge: '#3d4ca8',
    onPlayer(player) { player.slowFactor = Math.min(player.slowFactor, 0.55); },
  },
  redInk: {
    ink: true, color: '#b72025', edge: '#eb5a4a',
    onPlayer(player, h, world) {
      player.slowFactor = Math.min(player.slowFactor, 0.75);
      world.damage.hurtPlayer(1);
    },
  },
  // Tipp-Ex: línea blanca del jugador que borra proyectiles enemigos
  whiteLine: {
    color: '#fff6d6', edge: '#ffffff',
    onUpdate(h, world, dt) {
      world.projectiles.eraseInRadius(h.x, h.y, h.r + 2, 'enemy');
      // Sinergia Corrector: también daña a los enemigos de tinta
      if (!world.items.hasSynergy('corrector')) return;
      for (const e of world.enemies.query(h.x, h.y, 12)) {
        if (!e.canBeHit() || !e.def.tags?.includes('tinta')) continue;
        if ((e.x - h.x) ** 2 + (e.y - h.y) ** 2 > 100) continue;
        e.hp -= 2.5 * dt; e.flash = 0.03;
        if (e.hp <= 0) world.damage.killEnemy(e);
      }
    },
  },
  // Cruz roja de corrección: aviso que explota al terminar
  mark: {
    render(g, h) {
      const k = 1 - h.life / h.max;
      const blink = h.life < 0.3 ? Math.floor(h.life * 30) % 2 : 1;
      if (!blink) return;
      const r = Math.round(h.r * (0.5 + k * 0.5));
      g.fillStyle = '#d6403a';
      for (let i = -r; i <= r; i++) {
        g.fillRect(Math.round(h.x) + i, Math.round(h.y) + Math.round(i * 0.6), 2, 2);
        g.fillRect(Math.round(h.x) + i, Math.round(h.y) - Math.round(i * 0.6), 2, 2);
      }
    },
    onExpire(h, world) {
      const p = world.player;
      const dx = p.x - h.x, dy = (p.y - h.y) * 1.6;
      if (p.alive && dx * dx + dy * dy < h.r * h.r) world.damage.hurtPlayer(1, dx, dy);
      world.effects.burst(h.x, h.y, 12, '#d6403a', 80, 0.4);
      world.hazards.spawn('redInk', h.x, h.y, h.r * 0.8, 2.2);
      world.game.audio.play('killEnemy', { pitch: 1.4, volume: 0.6 });
    },
  },
};

export class Hazards {
  constructor(world, capacity = 160) {
    this.world = world;
    this.pool = new Pool(() => ({ active: false, type: 'ink', x: 0, y: 0, r: 6, life: 0, max: 1, seed: 0 }), capacity);
  }

  spawn(type, x, y, r, life) {
    let h = this.pool.spawn();
    if (!h) {
      // Pool lleno: reciclamos el charco más viejo en lugar de perder el nuevo
      h = this.pool.active.reduce((a, b) => (a.life < b.life ? a : b));
    }
    if (HAZARD_TYPES[type].ink) life *= this.world.mods.inkLife;
    h.type = type; h.x = x; h.y = y; h.r = r; h.life = life; h.max = life; h.seed = Math.random() * 10;
    return h;
  }

  update(dt) {
    const world = this.world, player = world.player;
    for (const h of this.pool.active) {
      if (!h.active) continue;
      const t = HAZARD_TYPES[h.type];
      h.life -= dt;
      if (h.life <= 0) { h.active = false; t.onExpire?.(h, world); continue; }
      t.onUpdate?.(h, world, dt);
      if (t.onPlayer && player.alive && !player.isDashing) {
        const dx = player.x - h.x, dy = (player.y - h.y) * 1.6; // elipse
        if (dx * dx + dy * dy < h.r * h.r) t.onPlayer(player, h, world);
      }
    }
    this.pool.sweep();
  }

  render(g) {
    for (const h of this.pool.active) {
      const t = HAZARD_TYPES[h.type];
      if (t.render) { t.render(g, h); continue; }
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

  /** Quita lo que hace daño (cruces, tinta roja) sin activar sus efectos de final. */
  clearDangerous() {
    for (const h of this.pool.active) if (h.type === 'mark' || h.type === 'redInk') h.active = false;
    this.pool.sweep();
  }
}
