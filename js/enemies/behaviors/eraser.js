import { toPlayer, steer, nearestAlly } from './helpers.js';

/**
 * Goma Gastada (soporte): se coloca entre el jugador y un aliado, borra las ondas que la rozan
 * y cada cierto tiempo "borra" el daño de los aliados cercanos.
 */
export default {
  init(e) { e.data.heal = 1.5; e.data.pulse = 0; e.setState('guard'); },

  update(e, world, dt) {
    const p = e.def.params;
    const t = toPlayer(e, world);
    const ally = nearestAlly(e, world, (o) => o.def.id !== e.def.id);
    if (ally) {
      // Escuda: se pone entre el aliado y el jugador
      const ax = world.player.x - ally.x, ay = world.player.y - ally.y;
      const al = Math.hypot(ax, ay) || 1;
      steer(e, ally.x + (ax / al) * p.guardDistance, ally.y + (ay / al) * p.guardDistance, e.def.speed);
    } else {
      steer(e, world.player.x, world.player.y, e.def.speed * 0.7);
    }
    e.data.pulse = Math.max(0, e.data.pulse - dt);
    if (world.projectiles.eraseInRadius(e.x, e.y - 5, p.eraseRadius, 'player') > 0) {
      e.data.pulse = 0.2;
      world.game.audio.play('wallHit', { pitch: 0.6 });
    }
    e.data.heal -= dt;
    if (e.data.heal <= 0) {
      e.data.heal = p.healEvery;
      for (const o of world.enemies.list) {
        if (o === e || o.dead || o.hp >= o.maxHp) continue;
        if ((o.x - e.x) ** 2 + (o.y - e.y) ** 2 > p.healRadius ** 2) continue;
        o.hp = Math.min(o.maxHp, o.hp + p.healAmount);
        world.effects.burst(o.x, o.y - 8, 6, '#e896a0', 40, 0.4);
      }
    }
    if (Math.abs(t.dx) > 2) e.facing = Math.sign(t.dx);
  },

  renderExtra(g, e) {
    if (e.data.pulse <= 0 && Math.floor(e.animTime * 2) % 2) return;
    g.globalAlpha = e.data.pulse > 0 ? 0.6 : 0.18;
    g.strokeStyle = '#ffffff';
    g.beginPath(); g.ellipse(Math.round(e.x), Math.round(e.y - 5), e.def.params.eraseRadius, e.def.params.eraseRadius * 0.7, 0, 0, Math.PI * 2); g.stroke();
    g.globalAlpha = 1;
  },
};
