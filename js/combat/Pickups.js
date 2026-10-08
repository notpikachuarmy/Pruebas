import { Pool } from '../core/Pool.js';

/** Recogibles: Lucidez (moneda de la run) y medio corazón. */
export const PICKUP_TYPES = {
  lucidity: {
    magnet: 46,
    collect(world, p) {
      world.run.lucidity += 1;
      world.game.audio.play('pickup', { pitch: 0.9 + Math.random() * 0.3 });
      world.game.events.emit('pickup:lucidity', { amount: 1 });
      return true;
    },
    render(g, x, y, t) {
      const s = (Math.floor(t * 6) % 2);
      g.fillStyle = '#c9bde6'; g.fillRect(x - 2, y - 2 - s, 4, 4);
      g.fillStyle = '#ffffff'; g.fillRect(x - 1, y - 1 - s, 2, 2);
    },
  },
  heart: {
    magnet: 0,
    collect(world) {
      if (!world.damage.healPlayer(1)) return false; // con la vida llena no se recoge
      world.game.audio.play('heal');
      return true;
    },
    render(g, x, y, t) {
      const b = Math.round(Math.sin(t * 4));
      g.fillStyle = '#eb2f2d';
      g.fillRect(x - 3, y - 4 + b, 3, 3); g.fillRect(x, y - 4 + b, 3, 3); g.fillRect(x - 2, y - 1 + b, 4, 2); g.fillRect(x - 1, y + 1 + b, 2, 1);
      g.fillStyle = '#ffb3a8'; g.fillRect(x - 2, y - 3 + b, 1, 1);
    },
  },
};

export class Pickups {
  constructor(world, capacity = 96) {
    this.world = world;
    this.pool = new Pool(() => ({ active: false, type: 'lucidity', x: 0, y: 0, vx: 0, vy: 0, t: 0 }), capacity);
  }

  spawn(type, x, y, still = false) {
    const p = this.pool.spawn();
    if (!p) return;
    const a = Math.random() * Math.PI * 2;
    p.type = type; p.x = x; p.y = y; p.t = still ? 1 : 0;
    const s = still ? 0 : 50;
    p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
  }

  /** Para guardar los recogibles que quedan en una sala al salir de ella. */
  serialize() { return this.pool.active.map((p) => ({ type: p.type, x: p.x, y: p.y })); }

  restore(list) { for (const p of list) this.spawn(p.type, p.x, p.y, true); }

  /** Aplica la tabla `drops` de un enemigo. */
  dropFrom(enemy) {
    const rng = this.world.rngLoot;
    for (const d of enemy.def.drops ?? []) {
      const luck = this.world.items.hasEffect('luck') ? 1.35 : 1;
      if (!rng.chance(Math.min(1, d.chance * luck))) continue;
      const n = d.amount ? rng.int(d.amount[0], d.amount[1]) : 1;
      for (let i = 0; i < n; i++) this.spawn(d.type, enemy.x, enemy.y - 2);
    }
  }

  update(dt) {
    const { player, room } = this.world;
    for (const p of this.pool.active) {
      p.t += dt;
      const type = PICKUP_TYPES[p.type];
      const dx = player.x - p.x, dy = (player.y - 4) - p.y;
      const d = Math.hypot(dx, dy);
      if (player.alive && type.magnet && d < type.magnet && p.t > 0.3) {
        p.vx += (dx / d) * 600 * dt; p.vy += (dy / d) * 600 * dt;
      }
      p.vx *= 1 - Math.min(1, 5 * dt); p.vy *= 1 - Math.min(1, 5 * dt);
      const nx = p.x + p.vx * dt, ny = p.y + p.vy * dt;
      if (!room.isSolidAt(nx, ny)) { p.x = nx; p.y = ny; } else { p.vx *= -0.5; p.vy *= -0.5; }
      if (player.alive && d < 9 && p.t > 0.25 && type.collect(this.world, p)) p.active = false;
    }
    this.pool.sweep();
  }

  render(g) {
    for (const p of this.pool.active) {
      g.fillStyle = 'rgba(20,14,40,0.25)';
      g.fillRect(Math.round(p.x) - 2, Math.round(p.y) + 3, 4, 1);
      PICKUP_TYPES[p.type].render(g, Math.round(p.x), Math.round(p.y), p.t);
    }
  }

  clear() { this.pool.clear(); }
}
