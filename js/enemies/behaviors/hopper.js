import { toPlayer } from './helpers.js';

/** Gominola: da saltos hacia el jugador. En el aire no hace daño; al caer, aplasta. */
export default {
  init(e) { e.data.wait = 0.4 + Math.random() * 0.6; e.data.z = 0; e.setState('ground'); },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    if (e.state === 'ground') {
      e.vx *= 0.7; e.vy *= 0.7;
      d.wait -= dt;
      if (d.wait <= 0 && world.player.alive) {
        const t = toPlayer(e, world);
        const dist = Math.min(t.dist, p.jumpRange);
        e.vx = t.nx * dist / p.airTime; e.vy = t.ny * dist / p.airTime;
        e.setState('air');
      }
    } else {
      // parábola visual
      const k = e.stateTime / p.airTime;
      d.z = Math.sin(Math.min(1, k) * Math.PI) * p.height;
      if (k >= 1) {
        d.z = 0; e.vx = 0; e.vy = 0; d.wait = p.wait;
        e.setState('ground');
        world.effects.burst(e.x, e.y, 5, e.def.params.color ?? '#7fd67f', 40, 0.3);
      }
    }
    if (Math.abs(e.vx) > 3) e.facing = Math.sign(e.vx);
  },

  canHurt(e) { return e.state === 'ground'; },
  visualOffset() { return 0; },
  squash(e) { return e.state === 'ground' && e.stateTime < 0.15 ? 0.75 : e.state === 'air' ? 1.15 : 1; },
  /** Desplazamiento vertical del dibujo (salto). */
  lift(e) { return e.data.z; },
};
