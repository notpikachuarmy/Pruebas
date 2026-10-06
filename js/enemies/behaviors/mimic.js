import { shoot } from './helpers.js';

/** Copia: repite el movimiento y los disparos del jugador con un retraso. */
export default {
  init(e) { e.data.cool = 0; },

  update(e, world, dt) {
    const p = e.def.params;
    const h = world.playerHistory.get(Math.round(p.delay * 60));
    e.data.cool -= dt;
    if (!h) { e.vx = 0; e.vy = 0; return; }
    e.vx = h.vx * p.speedFactor; e.vy = h.vy * p.speedFactor;
    if (h.shot && e.data.cool <= 0) {
      e.data.cool = p.minFireGap;
      shoot(world, e, Math.atan2(h.ay, h.ax), { speed: 150, range: 150, radius: 3, color: '#25307a', trail: '#eb2f2d' });
    }
    if (Math.abs(e.vx) > 4) e.facing = Math.sign(e.vx);
  },
};
