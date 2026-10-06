import { toPlayer, playerAimsAt } from './helpers.js';

/** Peluche Roto: solo se mueve cuando no lo miras (cuando no le apuntas). Si le das la espalda, corre. */
export default {
  init(e) { e.data.watched = false; },

  update(e, world, dt) {
    const p = e.def.params;
    const t = toPlayer(e, world);
    const watched = world.player.alive && t.dist < p.sightRange && playerAimsAt(e, world, p.cone);
    if (watched !== e.data.watched && !watched) world.game.audio.play('windup', { pitch: 0.5, volume: 0.6 });
    e.data.watched = watched;
    if (watched || !world.player.alive) { e.vx = 0; e.vy = 0; return; }
    e.vx = t.nx * e.def.speed; e.vy = t.ny * e.def.speed;
    if (Math.abs(t.dx) > 2) e.facing = Math.sign(t.dx);
  },

  // Cuando se le mira se queda tieso: sin animación ni temblor
  squash(e) { return e.data.watched ? 1 : 1 + Math.sin(e.animTime * 30) * 0.05; },
};
