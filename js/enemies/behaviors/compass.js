import { steer } from './helpers.js';

/**
 * Compás (trampa viviente): clava una punta y gira trazando un círculo perfecto.
 * Cada cierto tiempo levanta la punta y la clava cerca del jugador.
 */
export default {
  init(e) {
    e.data.cx = e.x; e.data.cy = e.y; e.data.ang = Math.random() * Math.PI * 2;
    e.data.dir = Math.random() < 0.5 ? 1 : -1;
    e.setState('spin');
  },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    if (e.state === 'spin') {
      d.ang += d.dir * p.angularSpeed * dt;
      steer(e, d.cx + Math.cos(d.ang) * p.radius, d.cy + Math.sin(d.ang) * p.radius * 0.75, p.radius * p.angularSpeed * 1.6);
      if (e.stateTime > p.spinTime && world.player.alive) {
        e.setState('lift');
        const r = world.rngSpawn;
        const tx = world.player.x + r.range(-30, 30), ty = world.player.y + r.range(-20, 20);
        d.nx = Math.max(40, Math.min(world.room.width - 40, tx));
        d.ny = Math.max(40, Math.min(world.room.height - 30, ty));
        world.game.audio.play('windup', { pitch: 0.7 });
      }
    } else if (e.state === 'lift') {
      e.vx = 0; e.vy = 0;
      if (e.stateTime > p.liftTime) e.setState('move');
    } else if (e.state === 'move') {
      // Se desplaza hasta el nuevo centro
      d.cx += Math.sign(d.nx - d.cx) * Math.min(Math.abs(d.nx - d.cx), 110 * dt);
      d.cy += Math.sign(d.ny - d.cy) * Math.min(Math.abs(d.ny - d.cy), 110 * dt);
      steer(e, d.cx + Math.cos(d.ang) * p.radius, d.cy + Math.sin(d.ang) * p.radius * 0.75, 140);
      if (Math.abs(d.nx - d.cx) < 1 && Math.abs(d.ny - d.cy) < 1) { d.dir *= -1; e.setState('spin'); }
    }
  },

  /** Dibuja la marca del centro y el círculo que va trazando. */
  renderExtra(g, e) {
    const d = e.data, r = e.def.params.radius;
    g.globalAlpha = e.state === 'lift' ? 0.6 : 0.22;
    g.strokeStyle = '#25307a';
    g.beginPath(); g.ellipse(Math.round(d.cx), Math.round(d.cy), r, r * 0.75, 0, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#25307a'; g.fillRect(Math.round(d.cx) - 1, Math.round(d.cy) - 1, 2, 2);
    if (e.state === 'lift') { g.fillStyle = '#d6403a'; g.fillRect(Math.round(d.nx) - 1, Math.round(d.ny) - 1, 3, 3); }
    g.globalAlpha = 1;
  },
  squash(e) { return e.state === 'lift' ? 1.2 : 1; },
};
