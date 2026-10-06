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
    shape: 'wave', expire: null, glyph: '',
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
    p.shape = opts.shape ?? (opts.team === 'player' ? 'wave' : 'ink');
    p.expire = opts.expire ?? null;   // 'ink' | 'redInk': deja un charco al terminar su recorrido
    p.glyph = opts.glyph ?? '';
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
      if (p.travelLeft <= 0) {
        if (p.expire) this.world.hazards.spawn(p.expire, p.x, p.y, 8, 2.5);
        this._kill(p, false);
        continue;
      }
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

  /** Proyectil enemigo: gota de tinta con borde claro (se distingue bien sobre el papel). */
  _renderInk(g, p, x, y) {
    const r = p.radius;
    g.fillStyle = p.trail;
    g.fillRect(x - r - 1, y - r, (r + 1) * 2, r * 2);
    g.fillRect(x - r, y - r - 1, r * 2, (r + 1) * 2);
    g.fillStyle = p.color;
    g.fillRect(x - r, y - r, r * 2, r * 2);
    if (p.glyph === '?') { g.fillStyle = '#fff6d6'; g.fillRect(x - 1, y - 2, 2, 1); g.fillRect(x, y - 1, 1, 1); g.fillRect(x - 1, y + 1, 1, 1); }
    else if (p.glyph) { g.fillStyle = '#fff6d6'; g.fillRect(x - 1, y - 1, 2, 2); }
  }

  _kill(p, wall) {
    p.active = false;
    this.world.effects.burst(p.x, p.y, wall ? 5 : 3, p.trail, wall ? 60 : 30, 0.3);
    if (wall) this.world.game.audio.play('wallHit', { volume: 0.6 });
  }

  clear() { this.pool.clear(); }

  clearTeam(team) {
    for (const p of this.pool.active) if (p.team === team) { p.active = false; this.world.effects.burst(p.x, p.y - p.z, 2, p.trail, 20, 0.2); }
    this.pool.sweep();
  }

  /** Borra proyectiles de un equipo dentro de un radio (la Goma Gastada). Devuelve cuántos. */
  eraseInRadius(x, y, r, team = 'player') {
    let n = 0;
    for (const p of this.pool.active) {
      if (!p.active || p.team !== team) continue;
      if ((p.x - x) ** 2 + (p.y - y) ** 2 < r * r) {
        p.active = false; n++;
        this.world.effects.burst(p.x, p.y - p.z, 3, '#ffffff', 30, 0.25);
      }
    }
    return n;
  }

  render(g) {
    for (const p of this.pool.active) {
      const x = Math.round(p.x), y = Math.round(p.y - p.z);
      // sombra
      g.fillStyle = 'rgba(20,14,40,0.25)';
      g.fillRect(Math.round(p.x) - p.radius + 1, Math.round(p.y) - 1, p.radius * 2 - 2, 2);
      // anillo de "onda" + núcleo
      if (p.shape === 'ink') { this._renderInk(g, p, x, y); continue; }
      const pulse = 1 + Math.floor((p.age * 12) % 2);
      g.fillStyle = p.trail;
      g.fillRect(x - p.radius - pulse + 1, y - p.radius + 1, (p.radius + pulse) * 2 - 2, p.radius * 2 - 2);
      g.fillRect(x - p.radius + 1, y - p.radius - pulse + 1, p.radius * 2 - 2, (p.radius + pulse) * 2 - 2);
      g.fillStyle = p.color;
      g.fillRect(x - p.radius + 1, y - p.radius + 1, p.radius * 2 - 2, p.radius * 2 - 2);
    }
  }
}
