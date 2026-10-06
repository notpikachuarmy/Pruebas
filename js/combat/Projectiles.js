import { Pool } from '../core/Pool.js';

function makeProjectile() {
  return {
    active: false, team: 'player',
    x: 0, y: 0, z: 8,           // z = altura visual sobre el suelo
    vx: 0, vy: 0, radius: 3,
    damage: 1, knockback: 0,
    travelLeft: 0, age: 0, pierce: 0,
    color: '#fff', trail: '#eb2f2d',
    hitIds: new Set(),          // evita golpear dos veces al mismo enemigo al perforar
  };
}

/** Todos los proyectiles (del jugador y enemigos) en un único pool. */
export class Projectiles {
  constructor(world, capacity = 512) {
    this.world = world;
    this.pool = new Pool(makeProjectile, capacity);
  }

  spawn(opts) {
    const p = this.pool.spawn();
    if (!p) return null;
    p.team = opts.team;
    p.x = opts.x; p.y = opts.y; p.z = opts.z ?? 8;
    p.vx = opts.vx; p.vy = opts.vy;
    p.radius = opts.radius ?? 3;
    p.damage = opts.damage ?? 1;
    p.knockback = opts.knockback ?? 0;
    p.travelLeft = opts.range ?? 200;
    p.pierce = opts.pierce ?? 0;
    p.color = opts.color ?? '#fff';
    p.trail = opts.trail ?? p.color;
    p.age = 0;
    p.hitIds.clear();
    return p;
  }

  update(dt) {
    const { room, enemies, player, damage, effects } = this.world;
    for (const p of this.pool.active) {
      if (!p.active) continue;
      const sx = p.vx * dt, sy = p.vy * dt;
      p.x += sx; p.y += sy; p.age += dt;
      p.travelLeft -= Math.hypot(sx, sy);

      // Al final del recorrido, el proyectil "cae" (como las ondas que se apagan)
      if (p.travelLeft <= 0) { this._kill(p, false); continue; }
      if (room.isSolidAt(p.x, p.y)) {
        if (p.team === 'player') this.world.onWallShot(p.x, p.y);
        this._kill(p, true);
        continue;
      }

      if (p.team === 'player') {
        const hits = enemies.query(p.x, p.y, p.radius + 12);
        for (const e of hits) {
          if (!e.canBeHit() || p.hitIds.has(e.uid)) continue;
          // Comparación en el plano del suelo (z es solo visual)
          const ex = e.x, ey = e.y - e.def.bodyHeight * 0.5;
          const rr = p.radius + e.def.bodyRadius;
          if ((ex - p.x) ** 2 + (ey - p.y) ** 2 > rr * rr) continue;
          p.hitIds.add(e.uid);
          damage.hitEnemy(e, p.damage, p.vx, p.vy, p.knockback);
          effects.burst(p.x, p.y, 4, p.trail, 50, 0.25);
          if (p.pierce-- <= 0) { p.active = false; break; }
        }
      } else if (player.alive) {
        const rr = p.radius + player.bodyRadius;
        const px = player.x, py = player.y - player.bodyHeight * 0.5;
        if ((px - p.x) ** 2 + (py - p.y) ** 2 < rr * rr && damage.hurtPlayer(p.damage, p.vx, p.vy)) {
          this._kill(p, false);
        }
      }
    }
    this.pool.sweep();
  }

  _kill(p, wall) {
    p.active = false;
    this.world.effects.burst(p.x, p.y, wall ? 5 : 3, p.trail, wall ? 60 : 30, 0.3);
    if (wall) this.world.game.audio.play('wallHit', { volume: 0.6 });
  }

  clear() { this.pool.clear(); }

  render(g) {
    for (const p of this.pool.active) {
      const x = Math.round(p.x), y = Math.round(p.y - p.z);
      // sombra
      g.fillStyle = 'rgba(20,14,40,0.25)';
      g.fillRect(Math.round(p.x) - p.radius + 1, Math.round(p.y) - 1, p.radius * 2 - 2, 2);
      // anillo de "onda" + núcleo
      const pulse = 1 + Math.floor((p.age * 12) % 2);
      g.fillStyle = p.trail;
      g.fillRect(x - p.radius - pulse + 1, y - p.radius + 1, (p.radius + pulse) * 2 - 2, p.radius * 2 - 2);
      g.fillRect(x - p.radius + 1, y - p.radius - pulse + 1, p.radius * 2 - 2, (p.radius + pulse) * 2 - 2);
      g.fillStyle = p.color;
      g.fillRect(x - p.radius + 1, y - p.radius + 1, p.radius * 2 - 2, p.radius * 2 - 2);
    }
  }
}
