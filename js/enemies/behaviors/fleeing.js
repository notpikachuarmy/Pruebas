import { toPlayer, steer } from './helpers.js';

/**
 * Chuleta: huye del jugador. Atraparla (tocarla) da mucho botín pero hace sonar la alarma
 * (aparecen refuerzos). Dispararle da poco botín y no avisa a nadie. Si tardas, se escapa.
 */
export default {
  init(e) { e.data.turn = 0; e.setState('flee'); },

  update(e, world, dt) {
    const p = e.def.params;
    const t = toPlayer(e, world);
    if (e.stateTime > p.escapeAfter) { this._escape(e, world); return; }
    // Huye en dirección contraria con un poco de serpenteo
    const wob = Math.sin(e.animTime * 5) * 0.6 + e.data.turn;
    const ang = t.angle + Math.PI + wob;
    const sp = t.dist < p.panicRange ? e.def.speed : e.def.speed * 0.45;
    e.vx = Math.cos(ang) * sp; e.vy = Math.sin(ang) * sp;
    e.facing = Math.sign(e.vx) || 1;
    if (world.player.alive && t.dist < p.catchRange) this._caught(e, world);
  },

  onWall(e) { e.data.turn += (Math.random() < 0.5 ? 1 : -1) * 1.2; },

  _caught(e, world) {
    const p = e.def.params, rng = world.rngLoot;
    e.dead = true;
    const n = rng.int(p.catchLoot[0], p.catchLoot[1]);
    for (let i = 0; i < n; i++) world.pickups.spawn('lucidity', e.x, e.y - 2);
    if (rng.chance(p.catchHeart)) world.pickups.spawn('heart', e.x, e.y - 2);
    world.effects.burst(e.x, e.y - 6, 14, '#f0ecd6', 70, 0.5);
    world.game.audio.play('pickup', { pitch: 0.7 });
    // ¡Te han pillado copiando!
    world.game.audio.play('waveStart', { pitch: 1.5 });
    world.toast('¡Te han pillado con la chuleta!');
    for (let i = 0; i < p.alarmSpawns; i++) {
      const pt = world.room.randomFloorPoint(world.rngSpawn, world.player.x, world.player.y, 90);
      world.enemies.spawn(p.alarmEnemy, pt.x, pt.y);
    }
    world.game.events.emit('enemy:caught', { enemy: e });
  },

  _escape(e, world) {
    e.dead = true;
    world.effects.burst(e.x, e.y - 6, 8, '#f0ecd6', 50, 0.4);
    world.toast('La chuleta se ha escapado');
  },
};
