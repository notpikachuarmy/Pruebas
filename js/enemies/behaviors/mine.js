import { toPlayer } from './helpers.js';

/**
 * Mina marina: flota a la deriva. Si te acercas, se arma (parpadea) y explota.
 * Si la revientas de lejos con tus notas, explota donde no te hace daño.
 */
export default {
  init(e) { e.data.dir = Math.random() * 6.28; e.setState('drift'); },

  update(e, world, dt) {
    const p = e.def.params;
    const t = toPlayer(e, world);
    if (e.state === 'drift') {
      e.data.dir += (Math.random() - 0.5) * dt;
      e.vx = Math.cos(e.data.dir) * e.def.speed; e.vy = Math.sin(e.data.dir) * e.def.speed;
      if (world.player.alive && t.dist < p.trigger) { e.setState('armed'); world.game.audio.play('windup', { pitch: 2.2 }); }
    } else {
      e.vx = 0; e.vy = 0;
      if (e.stateTime > p.fuse) {
        if (world.player.alive && t.dist < p.radius) world.damage.hurtPlayer(1, t.dx, t.dy, e.def.id);
        world.damage.killEnemy(e);   // la explosión en anillo la hace deathBurst
        world.shake(3, 0.2);
      }
    }
  },
  onWall(e) { e.data.dir += Math.PI; },
  visualOffset(e) { return e.state === 'armed' ? (Math.sin(e.stateTime * 50) > 0 ? 1 : -1) : 0; },
  anim(e) { return 'idle'; },
  light(e) { return e.state === 'armed' ? 30 : 10; },
};
