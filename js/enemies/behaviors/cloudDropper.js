import { steer } from './helpers.js';

/** Algodón de Azúcar: flota cerca del jugador y deja caer bombas de caramelo con aviso. */
export default {
  init(e) { e.data.t = 1.2; e.data.off = Math.random() * 6.28; },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    const pl = world.player;
    const a = e.animTime * 0.8 + d.off;
    steer(e, pl.x + Math.cos(a) * p.orbit, pl.y + Math.sin(a) * p.orbit * 0.6, e.def.speed);
    d.t -= dt;
    if (d.t <= 0 && pl.alive) {
      d.t = p.every;
      world.hazards.spawn('caramelDrop', pl.x + world.rngSpawn.range(-10, 10), pl.y + world.rngSpawn.range(-6, 6), 12, p.delay, e.def.id);
    }
  },
  lift() { return 10; },
};
