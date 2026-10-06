import { toPlayer, shoot, steer } from './helpers.js';

/**
 * Sombra de Visita: si te acercas, se desvanece (no se le puede dar) y se aleja.
 * Desde lejos es sólida y lanza lágrimas lentas. Hay que atacarla a distancia.
 */
export default {
  init(e) { e.data.fade = 0; e.data.cool = 1.5 + Math.random(); },

  update(e, world, dt) {
    const p = e.def.params;
    const t = toPlayer(e, world);
    const near = world.player.alive && t.dist < p.fadeRange;
    e.data.fade = Math.max(0, Math.min(1, e.data.fade + (near ? dt * 4 : -dt * 2)));
    if (near) steer(e, e.x - t.nx * 40, e.y - t.ny * 40, e.def.speed * 1.4);
    else steer(e, e.x + t.ny * 20, e.y - t.nx * 20, e.def.speed * 0.5);
    e.data.cool -= dt;
    if (!near && e.data.cool <= 0 && world.player.alive) {
      e.data.cool = p.cooldown;
      shoot(world, e, t.angle, { speed: p.shotSpeed, range: 220, radius: 3, color: '#3a5a9a', trail: '#c9d8ff' });
      world.game.audio.play('windup', { pitch: 1.6, volume: 0.6 });
    }
    if (Math.abs(t.dx) > 2) e.facing = Math.sign(t.dx);
  },

  canBeHit(e) { return e.data.fade < 0.5; },
  canHurt(e) { return e.data.fade < 0.5; },
  alpha(e) { return 1 - e.data.fade * 0.8; },
};
