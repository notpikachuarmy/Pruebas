/**
 * Reloj de Pared (modificador): no ataca. Cada pocos segundos grita "¡quedan cinco minutos!"
 * y acelera a todos los enemigos. Es prioridad de objetivo.
 */
export default {
  init(e) { e.data.t = e.def.params.every * 0.6; e.data.ring = 0; },

  update(e, world, dt) {
    const p = e.def.params;
    e.vx = 0; e.vy = 0;
    e.data.t -= dt;
    e.data.ring = Math.max(0, e.data.ring - dt);
    if (e.data.t <= 0) {
      e.data.t = p.every;
      e.data.ring = 0.8;
      for (const o of world.enemies.list) if (o !== e && !o.dead) o.haste = p.hasteTime;
      world.effects.burst(e.x, e.y - 8, 14, '#ffd65c', 80, 0.5);
      world.game.audio.play('waveStart', { pitch: 1.8, volume: 0.7 });
      world.floatText(e.x, e.y - 22, '¡5 minutos!');
    }
  },

  visualOffset(e) { return e.data.ring > 0 ? (Math.sin(e.animTime * 70) > 0 ? 1 : -1) : 0; },
};
