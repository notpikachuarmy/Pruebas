import { toPlayer, shoot, steer } from './helpers.js';

/** Piruleta: gira despacio por la sala lanzando caramelos en espiral. */
export default {
  init(e) { e.data.ang = Math.random() * 6.28; e.data.t = 1; e.data.dir = Math.random() < 0.5 ? 1 : -1; },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    const t = toPlayer(e, world);
    // se mantiene a media distancia
    const want = t.dist < 70 ? -1 : t.dist > 140 ? 1 : 0;
    steer(e, e.x + t.nx * want * 30 + t.ny * 10, e.y + t.ny * want * 30 - t.nx * 10, e.def.speed);
    d.ang += d.dir * p.spin * dt;
    d.t -= dt;
    if (d.t <= 0 && world.player.alive) {
      d.t = p.every;
      for (let i = 0; i < p.arms; i++) {
        shoot(world, e, d.ang + (i / p.arms) * Math.PI * 2, { speed: p.speed, range: 200, radius: 3, color: '#ff8fc0', trail: '#fff6d6' });
      }
    }
  },
};
