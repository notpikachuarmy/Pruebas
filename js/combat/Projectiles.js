import { Pool } from '../core/Pool.js';

function makeProjectile() {
  return {
    active: false, team: 'player',
    x: 0, y: 0, z: 8,             // z = altura visual sobre el suelo
    dirX: 1, dirY: 0, speed: 0,   // dirección normalizada y velocidad
    radius: 3, damage: 1, knockback: 0,
    travelLeft: 0, range: 0, age: 0, pierce: 0,
    color: '#fff', trailColor: '#eb2f2d',
    shape: 'wave', expire: null, glyph: '',
    // Modificadores (objetos)
    bounces: 0, bounceShrink: 1, splitOnBounce: false,
    waveAmp: 0, waveFreq: 0, wavePhase: 0, lateral: 0,
    homing: 0, homingRange: 0,
    boomerang: false, returned: false,
    trail: null, trailTimer: 0, splitOnExpire: 0, isFragment: false,
    strong: false, isEcho: false, source: null, variant: 0,
    hitIds: new Set(),            // evita golpear dos veces al mismo enemigo al perforar
  };
}

/** Todos los proyectiles (del jugador y enemigos) en un único pool. */
export class Projectiles {
  constructor(world, capacity = 600) {
    this.world = world;
    this.pool = new Pool(makeProjectile, capacity);
  }

  /**
   * opts: team, x, y, z, (vx, vy) o (angle, speed), radius, damage, knockback, range, pierce, color, trail...
   */
  spawn(opts) {
    const p = this.pool.spawn();
    if (!p) return null;
    p.team = opts.team;
    p.x = opts.x; p.y = opts.y; p.z = opts.z ?? 8;
    if (opts.angle !== undefined) {
      p.dirX = Math.cos(opts.angle); p.dirY = Math.sin(opts.angle); p.speed = opts.speed;
    } else {
      p.speed = Math.hypot(opts.vx, opts.vy) || 1;
      p.dirX = opts.vx / p.speed; p.dirY = opts.vy / p.speed;
    }
    p.radius = opts.radius ?? 3;
    p.damage = opts.damage ?? 1;
    p.knockback = opts.knockback ?? 0;
    p.range = p.travelLeft = opts.range ?? 200;
    p.pierce = opts.pierce ?? 0;
    p.color = opts.color ?? '#fff';
    p.trailColor = opts.trailColor ?? opts.trail ?? p.color;
    p.shape = opts.shape ?? (opts.team === 'player' ? 'wave' : 'ink');
    p.expire = opts.expire ?? null;   // 'ink' | 'redInk': deja un charco al terminar su recorrido
    p.glyph = opts.glyph ?? '';
    p.bounces = opts.bounces ?? 0;
    p.bounceShrink = opts.bounceShrink ?? 1;
    p.splitOnBounce = !!opts.splitOnBounce;
    p.waveAmp = opts.waveAmp ?? 0; p.waveFreq = opts.waveFreq ?? 0; p.wavePhase = opts.wavePhase ?? 0; p.lateral = 0;
    p.homing = opts.homing ?? 0; p.homingRange = opts.homingRange ?? 0;
    p.boomerang = !!opts.boomerang; p.returned = false;
    // hazardTrail puede ser un tipo o una lista de tipos (Tipp-Ex + Saxofón)
    const tr = opts.hazardTrail;
    p.trail = tr ? (Array.isArray(tr) ? tr : [tr]) : null; p.trailTimer = 0;
    p.splitOnExpire = opts.splitOnExpire ?? 0; p.isFragment = !!opts.isFragment;
    p.strong = !!opts.strong; p.isEcho = !!opts.isEcho;
    p.source = opts.source ?? null;
    p.variant = (Math.random() * 3) | 0;     // tipo de nota (♪, ♩ o ♫) solo visual
    p.age = 0;
    p.hitIds.clear();
    return p;
  }

  update(dt) {
    const { room, enemies, player, damage, effects } = this.world;
    const frozen = this.world.freezeTime > 0;
    for (const p of this.pool.active) {
      if (!p.active) continue;
      if (frozen && p.team === 'enemy') continue;   // Cinta de Casete: el tiempo enemigo se para
      p.age += dt;

      if (p.homing) this._steer(p, dt);

      // Avance + desplazamiento lateral (zigzag)
      const prevX = p.x, prevY = p.y;
      const step = p.speed * dt;
      p.x += p.dirX * step; p.y += p.dirY * step;
      if (p.waveAmp) {
        const lat = Math.sin(p.age * p.waveFreq + p.wavePhase) * p.waveAmp;
        const d = lat - p.lateral;
        p.x += -p.dirY * d; p.y += p.dirX * d;
        p.lateral = lat;
      }
      p.travelLeft -= step;

      if (p.boomerang && !p.returned && p.travelLeft <= p.range * 0.5) {
        p.returned = true; p.dirX = -p.dirX; p.dirY = -p.dirY;
        p.pierce += 3; p.hitIds.clear();
      }
      if (p.trail) {
        p.trailTimer -= dt;
        if (p.trailTimer <= 0) { p.trailTimer = 0.03; for (const t of p.trail) this.world.hazards.spawn(t, p.x, p.y, 5, 0.6); }
      }

      // Al final del recorrido, el proyectil "cae" (como las ondas que se apagan)
      if (p.travelLeft <= 0) {
        if (p.expire) this.world.hazards.spawn(p.expire, p.x, p.y, 8, 2.5, p.source);
        if (p.splitOnExpire && !p.isFragment) this._fragment(p);
        this._kill(p, false);
        continue;
      }
      if (room.isSolidAt(p.x, p.y)) {
        if (p.team === 'player') this.world.onWallShot(p.x, p.y);
        if (p.bounces > 0) { this._bounce(p, prevX, prevY); continue; }
        this._kill(p, true);
        continue;
      }

      if (p.team === 'player') {
        const hits = enemies.query(p.x, p.y, p.radius + 16);
        for (const e of hits) {
          if (!e.canBeHit() || p.hitIds.has(e.uid)) continue;
          // Comparación en el plano del suelo (z es solo visual)
          const ex = e.x, ey = e.y - e.def.bodyHeight * 0.5;
          const rr = p.radius + e.def.bodyRadius;
          if ((ex - p.x) ** 2 + (ey - p.y) ** 2 > rr * rr) continue;
          p.hitIds.add(e.uid);
          damage.hitEnemy(e, p.damage, p.dirX, p.dirY, p.knockback, p);
          effects.burst(p.x, p.y, 4, p.trailColor, 50, 0.25);
          if (p.pierce-- <= 0) { p.active = false; break; }
        }
      } else if (player.alive) {
        const rr = p.radius + player.bodyRadius;
        const px = player.x, py = player.y - player.bodyHeight * 0.5;
        if ((px - p.x) ** 2 + (py - p.y) ** 2 < rr * rr && damage.hurtPlayer(p.damage, p.dirX, p.dirY, p.source)) {
          this._kill(p, false);
        }
      }
    }
    this.pool.sweep();
  }

  /** Gira poco a poco hacia el enemigo más cercano (Diapasón). */
  _steer(p, dt) {
    let best = null, bd = p.homingRange * p.homingRange;
    for (const e of this.world.enemies.list) {
      if (!e.canBeHit()) continue;
      const d = (e.x - p.x) ** 2 + (e.y - 4 - p.y) ** 2;
      if (d < bd) { bd = d; best = e; }
    }
    if (!best) return;
    const want = Math.atan2(best.y - 4 - p.y, best.x - p.x);
    const cur = Math.atan2(p.dirY, p.dirX);
    let diff = want - cur;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    const a = cur + Math.max(-p.homing * dt, Math.min(p.homing * dt, diff));
    p.dirX = Math.cos(a); p.dirY = Math.sin(a);
  }

  /** Pedal de Distorsión: al apagarse, la nota se rompe en varias pequeñas. */
  _fragment(p) {
    const full = this.world.items.hasSynergy('feedback');
    const base = Math.atan2(p.dirY, p.dirX);
    for (let i = 0; i < p.splitOnExpire; i++) {
      const a = base + (i - (p.splitOnExpire - 1) / 2) * 0.7;
      this.spawn({
        team: 'player', x: p.x, y: p.y, z: p.z, angle: a, speed: p.speed * 0.9,
        radius: full ? p.radius : Math.max(1, p.radius - 1), damage: p.damage * (full ? 0.7 : 0.45),
        knockback: p.knockback * 0.5, range: 70, color: p.color, trailColor: p.trailColor, isFragment: true,
      });
    }
  }

  /** Rebote en pared (Espejo Roto). Con Caleidoscopio se divide en dos. */
  _bounce(p, prevX, prevY) {
    const room = this.world.room;
    const hitX = room.isSolidAt(p.x, prevY), hitY = room.isSolidAt(prevX, p.y);
    if (hitX || !hitY) p.dirX = -p.dirX;
    if (hitY || !hitX) p.dirY = -p.dirY;
    p.x = prevX; p.y = prevY;
    p.bounces--;
    p.radius = Math.max(1, Math.round(p.radius * p.bounceShrink));
    p.lateral = 0; p.waveAmp = 0;
    p.hitIds.clear();
    this.world.effects.burst(p.x, p.y, 3, '#8fd3ff', 40, 0.2);
    if (p.splitOnBounce) {
      p.splitOnBounce = false;
      const a = Math.atan2(p.dirY, p.dirX);
      const child = this.spawn({
        team: p.team, x: p.x, y: p.y, z: p.z, angle: a + 0.45, speed: p.speed,
        radius: p.radius, damage: p.damage * 0.7, knockback: p.knockback, range: Math.max(30, p.travelLeft),
        color: p.color, trail: p.trailColor, bounces: p.bounces, bounceShrink: p.bounceShrink,
      });
      if (child) { const b = a - 0.45; p.dirX = Math.cos(b); p.dirY = Math.sin(b); }
    }
  }

  _kill(p, wall) {
    p.active = false;
    this.world.effects.burst(p.x, p.y, wall ? 5 : 3, p.trailColor, wall ? 60 : 30, 0.3);
    if (wall) this.world.game.audio.play('wallHit', { volume: 0.6 });
  }

  clear() { this.pool.clear(); }

  clearTeam(team) {
    for (const p of this.pool.active) if (p.team === team) { p.active = false; this.world.effects.burst(p.x, p.y - p.z, 2, p.trailColor, 20, 0.2); }
    this.pool.sweep();
  }

  /** Borra proyectiles de un equipo dentro de un radio (la Goma Gastada, Tipp-Ex). Devuelve cuántos. */
  eraseInRadius(x, y, r, team = 'player', max = Infinity) {
    let n = 0;
    for (const p of this.pool.active) {
      if (n >= max) break;
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
      g.fillRect(Math.round(p.x) - p.radius + 1, Math.round(p.y) - 1, Math.max(1, p.radius * 2 - 2), 2);
      if (p.shape === 'ink') { this._renderInk(g, p, x, y); continue; }
      if (p.isEcho) g.globalAlpha = 0.65;
      // Nota musical: primero el contorno (color de estela), luego la nota (color principal)
      const bob = Math.round(Math.sin(p.age * 18) * 0.6);
      this._note(g, x, y + bob, p.radius, p.variant, p.trailColor, 1);
      this._note(g, x, y + bob, p.radius, p.variant, p.color, 0);
      g.globalAlpha = 1;
    }
  }

  /**
   * Dibuja una nota (cabeza + plica + corchete) en píxeles. El centro de la cabeza es el punto de impacto.
   * o = grosor extra del contorno (1) o 0 para el relleno.
   */
  _note(g, x, y, r, variant, color, o) {
    g.fillStyle = color;
    const hw = r + 1, hh = Math.max(2, r);
    // cabeza (óvalo inclinado aproximado)
    g.fillRect(x - hw - o, y - hh / 2 - o, hw * 2 + o * 2, hh + o * 2);
    g.fillRect(x - hw + 1 - o, y - hh / 2 - 1 - o, hw * 2 - 2 + o * 2, hh + 2 + o * 2);
    // plica
    const sx = x + hw - 1, stemH = r * 3 + 2;
    g.fillRect(sx - o, y - stemH - o, 1 + o * 2 + (r > 3 ? 1 : 0), stemH + o);
    if (variant === 0) {
      // corchete (♪)
      g.fillRect(sx + 1 - o, y - stemH - o, Math.ceil(r * 0.9) + o * 2, 1 + o * 2);
      g.fillRect(sx + Math.ceil(r * 0.9) - o, y - stemH + 1 - o, 1 + o * 2, Math.ceil(r * 0.8) + o * 2);
    } else if (variant === 2) {
      // doble corchete (♬)
      g.fillRect(sx + 1 - o, y - stemH - o, Math.ceil(r * 0.9) + o * 2, 1 + o * 2);
      g.fillRect(sx + 1 - o, y - stemH + 2 - o, Math.ceil(r * 0.9) + o * 2, 1 + o * 2);
    }
  }

  /** Proyectil enemigo: gota de tinta con borde claro (se distingue bien sobre el papel). */
  _renderInk(g, p, x, y) {
    const r = p.radius;
    g.fillStyle = p.trailColor;
    g.fillRect(x - r - 1, y - r, (r + 1) * 2, r * 2);
    g.fillRect(x - r, y - r - 1, r * 2, (r + 1) * 2);
    g.fillStyle = p.color;
    g.fillRect(x - r, y - r, r * 2, r * 2);
    if (p.glyph === '?') { g.fillStyle = '#fff6d6'; g.fillRect(x - 1, y - 2, 2, 1); g.fillRect(x, y - 1, 1, 1); g.fillRect(x - 1, y + 1, 1, 1); }
    else if (p.glyph) { g.fillStyle = '#fff6d6'; g.fillRect(x - 1, y - 1, 2, 2); }
  }
}
