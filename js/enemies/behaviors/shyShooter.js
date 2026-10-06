import { toPlayer, shoot, playerAimsAt, steer } from './helpers.js';

/**
 * Interrogante: mantiene la distancia y lanza "?" que dejan tinta al caer.
 * Si el jugador le apunta, se asusta y huye un momento sin disparar (se le puede "cazar" sin apuntarle).
 */
export default {
  init(e) { e.setState('drift'); e.data.cool = 1 + Math.random(); e.data.side = Math.random() < 0.5 ? 1 : -1; },

  update(e, world, dt) {
    const p = e.def.params;
    const t = toPlayer(e, world);
    e.data.cool -= dt;

    if (e.state !== 'hide' && world.player.alive && playerAimsAt(e, world) && t.dist < 170) {
      e.setState('hide');
      e.data.side *= -1;
    }

    switch (e.state) {
      case 'drift': {
        // Órbita lateral a distancia preferida
        const want = t.dist < p.minRange ? -1 : t.dist > p.maxRange ? 1 : 0;
        const tx = e.x + t.nx * want * 30 - t.ny * e.data.side * 20;
        const ty = e.y + t.ny * want * 30 + t.nx * e.data.side * 20;
        steer(e, tx, ty, e.def.speed);
        if (e.data.cool <= 0 && world.player.alive) e.setState('windup');
        break;
      }
      case 'windup':
        e.vx *= 0.8; e.vy *= 0.8;
        if (e.stateTime >= p.windup) {
          shoot(world, e, t.angle, { speed: p.shotSpeed, range: Math.min(t.dist + 10, 220), radius: 4, glyph: '?', expire: 'ink' });
          world.game.audio.play('windup', { pitch: 2 });
          e.data.cool = p.cooldown;
          e.setState('drift');
        }
        break;
      case 'hide': {
        // Huye perpendicular y hacia atrás
        steer(e, e.x - t.nx * 40 - t.ny * e.data.side * 30, e.y - t.ny * 40 + t.nx * e.data.side * 30, e.def.speed * 1.8);
        if (e.stateTime > p.hideTime) { e.setState('drift'); e.data.cool = Math.max(e.data.cool, 0.4); }
        break;
      }
    }
    if (Math.abs(t.dx) > 2) e.facing = Math.sign(t.dx);
  },

  onWall(e) { e.data.side *= -1; },
  visualOffset(e) { return e.state === 'windup' ? (Math.sin(e.stateTime * 60) > 0 ? 1 : -1) : 0; },
  squash(e) { return e.state === 'hide' ? 0.8 : 1; },
};
