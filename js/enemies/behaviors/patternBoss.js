import { toPlayer, shoot } from './helpers.js';

/**
 * Jefe definido solo con datos: cada fase es una lista de ataques con su temporizador.
 * Pensado para crear jefes nuevos sin programar. params:
 *   move: 'static' | 'slide' | 'wander', speed
 *   phases: [{ name, from (0–1 de vida), attacks: [ataque, ...] }]
 * Ataques (todos con `every` en segundos):
 *   { type: 'ring',   count, speed, gap }           anillo con hueco
 *   { type: 'aimed',  count, spread, speed }         ráfaga hacia el jugador
 *   { type: 'spiral', arms, speed, turn }            espiral que gira
 *   { type: 'marks',  count, hazard, delay, r, spread, aim }
 *                                                    peligros en el suelo cerca del jugador (aim: la primera, justo encima)
 *   { type: 'summon', ids, max }                     invoca enemigos (hasta `max` vivos)
 *   { type: 'flash', time }                          fogonazo de luz (relámpago) en sueños oscuros
 *   { type: 'line', orient: 'h'|'v'|'both', gap, hazard, delay, r }
 *                                                    fila/columna de peligros que cruza al jugador, con un hueco
 *   { type: 'arena', margin }                        la plataforma se encoge (los bordes queman)
 *   { type: 'sprite', anim, time }                   cambia la animación un momento (p. ej. espada en alto)
 * Opcional por ataque: color, trail.
 */
export default {
  init(e) {
    e.data.phase = 0; e.data.timers = []; e.data.spin = 0;
    e.data.wx = e.x; e.data.wy = e.y; e.data.wt = 0;
  },

  _phase(e) {
    const r = e.hp / e.maxHp, ph = e.def.params.phases;
    let idx = 0;
    ph.forEach((p, i) => { if (r <= (p.from ?? 1)) idx = i; });
    return idx;
  },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    const idx = this._phase(e);
    if (idx !== d.phase) {
      d.phase = idx; d.timers = [];
      world.bossBanner(p.phases[idx].name); world.shake(4, 0.4); world.game.haptics.play('heavy');
    }
    this._move(e, world, dt, p);
    if (d.flash > 0) { d.flash -= dt; world.mods.lightMult = d.flash > 0 ? 4 : 1; }
    if (!world.player.alive) return;
    p.phases[idx].attacks.forEach((a, i) => {
      // La plataforma que se encoge actúa en cuanto empieza la fase; el resto, a mitad de su ritmo
      d.timers[i] = (d.timers[i] ?? (a.type === 'arena' ? 0 : a.every * 0.5)) - dt;
      if (d.timers[i] <= 0) { d.timers[i] = a.every; this._attack(e, world, a); }
    });
    d.spin += dt;
    if (d.animT > 0) d.animT -= dt;
  },

  _move(e, world, dt, p) {
    const t = toPlayer(e, world);
    if (p.move === 'slide') { e.vx = Math.sign(t.dx) * Math.min(Math.abs(t.dx), p.speed); e.vy = 0; }
    else if (p.move === 'wander') {
      const d = e.data;
      d.wt -= dt;
      if (d.wt <= 0) {
        d.wt = 2.2;
        const pt = world.room.randomFloorPoint(world.rngSpawn, world.player.x, world.player.y, 60);
        d.wx = pt.x; d.wy = Math.min(pt.y, world.room.height * 0.6);
      }
      const dx = d.wx - e.x, dy = d.wy - e.y, l = Math.hypot(dx, dy) || 1;
      e.vx = l > 4 ? (dx / l) * p.speed : 0; e.vy = l > 4 ? (dy / l) * p.speed : 0;
    } else { e.vx = 0; e.vy = 0; }
    if (Math.abs(e.vx) > 3) e.facing = Math.sign(e.vx);
  },

  _attack(e, world, a) {
    const t = toPlayer(e, world);
    const color = a.color ?? '#ff8fc0', trail = a.trail ?? '#fff6d6';
    const base = { range: 320, radius: a.radius ?? 3, color, trail, z: 14 };
    if (a.type === 'ring') {
      const gapAt = world.rngSpawn.int(0, a.count - 1);
      for (let i = 0; i < a.count; i++) {
        if (a.gap && ((i - gapAt + a.count) % a.count) < a.gap) continue;
        shoot(world, e, (i / a.count) * Math.PI * 2 + e.data.spin * 0.3, { ...base, speed: a.speed });
      }
    } else if (a.type === 'aimed') {
      for (let i = 0; i < a.count; i++) shoot(world, e, t.angle + (i - (a.count - 1) / 2) * (a.spread ?? 0.15), { ...base, speed: a.speed });
    } else if (a.type === 'spiral') {
      const ang = e.data.spin * (a.turn ?? 2);
      for (let i = 0; i < a.arms; i++) shoot(world, e, ang + (i / a.arms) * Math.PI * 2, { ...base, speed: a.speed });
    } else if (a.type === 'marks') {
      for (let i = 0; i < a.count; i++) {
        // `spread`: lo lejos del jugador que puede caer cada marca (0 = justo encima, como un punto de mira)
        const sx = (a.spread ?? 30) * (i === 0 && a.aim ? 0 : 1), sy = sx * 0.6;
        let x = world.player.x + world.rngSpawn.range(-sx, sx), y = world.player.y + world.rngSpawn.range(-sy, sy);
        if (world.room.isBlockedCell(Math.floor(x / 16), Math.floor(y / 16))) { x = world.player.x; y = world.player.y; }
        world.hazards.spawn(a.hazard, x, y, a.r ?? 12, a.delay ?? 1, e.def.id);
      }
    } else if (a.type === 'line') {
      this._line(e, world, a);
      return;
    } else if (a.type === 'arena') {
      world.setArena(a.margin);
      return;
    } else if (a.type === 'sprite') {
      e.data.anim = a.anim; e.data.animT = a.time ?? 1;
      return;
    } else if (a.type === 'flash') {
      e.data.flash = a.time ?? 0.15;
      world.game.audio.play('killEnemy', { pitch: 0.5, volume: 0.6 });
      world.shake(2, 0.2);
      return;
    } else if (a.type === 'summon') {
      const alive = world.enemies.list.filter((o) => !o.dead && o !== e).length;
      if (alive >= (a.max ?? 3)) return;
      const id = world.rngSpawn.pick(a.ids);
      const pt = world.room.randomFloorPoint(world.rngSpawn, world.player.x, world.player.y, 70);
      world.enemies.spawn(id, pt.x, pt.y);
    }
    if (a.type !== 'summon' && a.type !== 'marks') world.game.audio.play('shoot', { pitch: 0.6, volume: 0.7 });
  },

  /** Tajo de espada: una fila (o columna) de avisos que cruza la sala por donde está el jugador. */
  _line(e, world, a) {
    const room = world.room, pl = world.player, step = (a.r ?? 12) * 1.4;
    const orients = a.orient === 'both' ? ['h', 'v'] : [a.orient === 'random' ? world.rngSpawn.pick(['h', 'v']) : a.orient ?? 'h'];
    for (const o of orients) {
      const len = o === 'h' ? room.width : room.height;
      const n = Math.floor(len / step);
      const playerIdx = Math.floor((o === 'h' ? pl.x : pl.y) / step);
      // El hueco nunca cae justo donde estás: hay que moverse
      let gapAt = world.rngSpawn.int(1, n - (a.gap ?? 2) - 1);
      if (Math.abs(gapAt - playerIdx) < 2) gapAt = (gapAt + Math.floor(n / 2)) % Math.max(1, n - (a.gap ?? 2));
      for (let i = 0; i < n; i++) {
        if (i >= gapAt && i < gapAt + (a.gap ?? 2)) continue;
        const x = o === 'h' ? i * step + step / 2 : pl.x;
        const y = o === 'h' ? pl.y : i * step + step / 2;
        if (room.isBlockedCell(Math.floor(x / 16), Math.floor(y / 16))) continue;
        world.hazards.spawn(a.hazard ?? 'fireMark', x, y, a.r ?? 12, a.delay ?? 1, e.def.id);
      }
    }
    world.game.audio.play('windup', { pitch: 0.5 });
  },

  anim(e) {
    if (e.data.animT > 0) return e.data.anim;
    return 'idle';
  },

  onDeath(e, world) { world.mods.lightMult = 1; world.setArena(0); },
};
