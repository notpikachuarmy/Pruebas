import { toPlayer } from './helpers.js';

/**
 * Tentáculo: bajo el agua es solo una onda que se acerca (no se le puede dar). Luego asoma con aviso,
 * golpea y se queda fuera un rato: ese es el momento de atacarlo.
 */
export default {
  init(e) { e.setState('under'); },

  update(e, world, dt) {
    const p = e.def.params;
    const t = toPlayer(e, world);
    if (e.state === 'under') {
      e.vx = t.nx * p.chase; e.vy = t.ny * p.chase;
      if ((t.dist < 10 || e.stateTime > p.underTime) && world.player.alive) { e.setState('rise'); world.game.audio.play('windup', { pitch: 0.6 }); }
    } else if (e.state === 'rise') {
      e.vx = 0; e.vy = 0;
      if (e.stateTime > p.rise) { e.setState('up'); world.effects.burst(e.x, e.y, 12, e.def.params.burstColor ?? '#8fd3ff', 60, 0.4); world.shake(1.5, 0.1); }
    } else if (e.state === 'up') {
      e.vx = 0; e.vy = 0;
      if (e.stateTime > p.upTime) e.setState('under');
    }
  },

  canBeHit(e) { return e.state === 'up'; },
  canHurt(e) { return e.state === 'up' && e.stateTime < 0.4; },
  alpha(e) { return e.state === 'under' ? 0 : e.state === 'rise' ? 0.4 : 1; },
  /** Onda en el agua mientras está bajo la superficie. */
  renderExtra(g, e) {
    if (e.state === 'up') return;
    const k = e.state === 'rise' ? 1 + e.stateTime * 2 : 1;
    if (e.def.params.shadow) {
      // Sombra de algo que vuela por encima (Águila): crece y se oscurece antes de caer en picado
      g.fillStyle = '#08060e';
      g.globalAlpha = e.state === 'rise' ? 0.55 : 0.3;
      const r = 7 * k;
      g.beginPath(); g.ellipse(Math.round(e.x), Math.round(e.y), r, r * 0.45, 0, 0, Math.PI * 2); g.fill();
      if (e.state === 'rise') { g.strokeStyle = '#eb2f2d'; g.globalAlpha = 0.7; g.stroke(); }
      g.globalAlpha = 1;
      return;
    }
    g.strokeStyle = e.state === 'rise' ? '#eb2f2d' : '#8fd3ff';
    g.globalAlpha = 0.6;
    const r = 5 + Math.sin(e.animTime * 8) * 1.5;
    g.beginPath(); g.ellipse(Math.round(e.x), Math.round(e.y), r * k, r * 0.5 * k, 0, 0, Math.PI * 2); g.stroke();
    g.globalAlpha = 1;
  },
  light(e) { return e.state === 'rise' ? 26 : 0; },
};
