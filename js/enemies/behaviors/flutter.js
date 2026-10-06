import { steer } from './helpers.js';

/**
 * Polilla: revolotea hacia el jugador de forma errática. Si hay una lámpara encendida cerca,
 * se olvida del jugador y da vueltas alrededor de la luz.
 */
export default {
  init(e) { e.data.phase = Math.random() * 10; },

  update(e, world, dt) {
    const p = e.def.params;
    let tx = world.player.x, ty = world.player.y;
    let orbit = false;
    for (const o of world.interactables.list) {
      if (o.kind !== 'lamp' || !o.lit) continue;
      if ((o.x - e.x) ** 2 + (o.y - e.y) ** 2 < p.lampRange ** 2) { tx = o.x; ty = o.y - 14; orbit = true; break; }
    }
    const t = e.animTime * p.flutter + e.data.phase;
    const r = orbit ? 14 : 18;
    steer(e, tx + Math.cos(t) * r, ty + Math.sin(t * 1.3) * r * 0.7, e.def.speed * (orbit ? 0.8 : 1));
    if (Math.abs(e.vx) > 3) e.facing = Math.sign(e.vx);
  },

  canHurt(e) { return true; },
};
