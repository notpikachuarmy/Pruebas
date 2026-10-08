import { toPlayer, shoot, playerAimsAt, steer } from './helpers.js';

const PHASES = ['Sobresaliente', 'Matrícula de honor', 'Primero de la clase'];

/**
 * El Compañero Perfecto (jefe alternativo del Examen): como tú, pero mejor.
 * Se mueve en círculos a media distancia, dispara notas en ráfagas y esquiva cuando le apuntas.
 */
export default {
  init(e) { Object.assign(e.data, { phase: 0, fire: 1.5, dodge: 0, side: 1, copies: 6 }); },
  phaseOf(e) { const r = e.hp / e.maxHp; return r > 0.66 ? 0 : r > 0.33 ? 1 : 2; },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    const t = toPlayer(e, world);
    const ph = this.phaseOf(e);
    if (ph !== d.phase) { d.phase = ph; world.bossBanner((p.phaseNames ?? PHASES)[ph]); world.game.haptics.play('heavy'); }
    d.dodge -= dt;
    // Tras cada ráfaga se queda quieto un momento: es la ventana para acertarle
    if (e.state === 'pose') {
      e.vx = 0; e.vy = 0;
      if (e.stateTime > p.poseTime) e.setState('move');
      return;
    }
    if (e.state === 'dash') {
      if (e.stateTime > 0.22) e.setState('move');
      if (Math.abs(e.vx) > 3) e.facing = Math.sign(e.vx);
      return;
    }
    // Esquiva lateral cuando le apuntas (con recarga, para que se le pueda acertar)
    if (world.player.alive && d.dodge <= 0 && playerAimsAt(e, world, 0.96)) {
      d.dodge = p.dodgeCooldown[ph];
      d.side *= -1;
      e.vx = -t.ny * d.side * 230; e.vy = t.nx * d.side * 230;
      e.setState('dash');
      world.effects.burst(e.x, e.y - 8, 6, '#ffd65c', 40, 0.3);
      return;
    }
    // Orbita a la distancia preferida
    const want = t.dist < p.range[0] ? -1 : t.dist > p.range[1] ? 1 : 0;
    steer(e, e.x + t.nx * want * 40 - t.ny * d.side * 30, e.y + t.ny * want * 40 + t.nx * d.side * 30, e.def.speed);
    if (Math.abs(t.dx) > 2) e.facing = Math.sign(t.dx);

    if (!world.player.alive) return;
    d.fire -= dt;
    if (d.fire <= 0) {
      d.fire = p.fireEvery[ph];
      const n = p.burst[ph];
      for (let i = 0; i < n; i++) {
        shoot(world, e, t.angle + (i - (n - 1) / 2) * 0.16, { speed: 125, range: 240, radius: 3, z: 9, color: p.shotColor ?? '#ffd65c', trail: p.shotTrail ?? '#191817' });
      }
      world.game.audio.play('shoot', { pitch: 0.75 });
      e.setState('pose');
    }
    if (ph >= 1) {
      d.copies -= dt;
      if (d.copies <= 0) {
        d.copies = p.copyEvery;
        const sid = p.summon ?? 'copia';
        if (world.enemies.list.filter((o) => o.def.id === sid && !o.dead).length < (p.maxSummons ?? 2)) {
          world.enemies.spawn(sid, e.x + world.rngSpawn.range(-20, 20), e.y + 10);
        }
      }
    }
  },

  onWall(e) { e.data.side *= -1; },
  anim(e) { return Math.abs(e.vx) + Math.abs(e.vy) > 10 ? 'walk' : 'idle'; },
};
