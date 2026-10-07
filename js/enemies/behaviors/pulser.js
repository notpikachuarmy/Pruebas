import { toPlayer, shoot, steer } from './helpers.js';

/** Medusa: flota hacia ti y cada pocos segundos se ilumina y suelta una descarga a su alrededor. */
export default {
  init(e) { e.data.t = 1.5 + Math.random() * 1.5; e.setState('drift'); },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    const t = toPlayer(e, world);
    if (e.state === 'drift') {
      steer(e, world.player.x, world.player.y - 4, e.def.speed);
      d.t -= dt;
      if (d.t <= 0 && world.player.alive) { e.setState('charge'); world.game.audio.play('windup', { pitch: 1.6, volume: 0.5 }); }
    } else if (e.state === 'charge') {
      e.vx *= 0.85; e.vy *= 0.85;
      if (e.stateTime >= p.charge) {
        // Descarga: daño cerca y anillo de chispas
        if (world.player.alive && t.dist < p.radius) world.damage.hurtPlayer(1, t.dx, t.dy, e.def.id);
        for (let i = 0; i < p.sparks; i++) shoot(world, e, (i / p.sparks) * Math.PI * 2, { speed: 70, range: 90, radius: 2, color: '#e0d0ff', trail: '#8a5aff', z: 6 });
        world.effects.burst(e.x, e.y - 6, 14, '#c8a8ff', 80, 0.35);
        d.t = p.every;
        e.setState('drift');
      }
    }
    if (Math.abs(t.dx) > 2) e.facing = Math.sign(t.dx);
  },

  renderExtra(g, e) {
    if (e.state !== 'charge') return;
    const k = e.stateTime / e.def.params.charge;
    g.globalAlpha = 0.25 + 0.3 * k;
    g.strokeStyle = '#c8a8ff';
    g.beginPath(); g.ellipse(Math.round(e.x), Math.round(e.y - 4), e.def.params.radius * k, e.def.params.radius * 0.7 * k, 0, 0, Math.PI * 2); g.stroke();
    g.globalAlpha = 1;
  },
  light(e) { return e.state === 'charge' ? 40 : 18; },
};
