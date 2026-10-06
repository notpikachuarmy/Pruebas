import { shoot } from './helpers.js';

const PHASES = ['Primera hora', '¡Cinco minutos!', 'Campanada final'];

/**
 * El Gran Reloj (jefe alternativo del Examen): sus agujas son chorros de tinta que giran.
 *  Fase 1: aguja de minutos (rápida) y de horas (lenta) disparando en línea.
 *  Fase 2: cada pocos segundos grita "¡cinco minutos!": acelera a todos y llama Tachones.
 *  Fase 3: campanadas (anillos con hueco) y la aguja de minutos cambia de sentido.
 */
export default {
  init(e) { Object.assign(e.data, { phase: 0, min: 0, hour: Math.PI / 2, tm: 0, th: 0, dir: 1, shout: 3, chime: 2, flip: 5 }); },
  phaseOf(e) { const r = e.hp / e.maxHp; return r > 0.66 ? 0 : r > 0.33 ? 1 : 2; },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    e.vx = 0; e.vy = 0;
    const ph = this.phaseOf(e);
    if (ph !== d.phase) { d.phase = ph; world.bossBanner(PHASES[ph]); world.shake(4, 0.4); world.game.haptics.play('heavy'); }
    if (!world.player.alive) return;

    d.min += d.dir * p.minuteSpeed[ph] * dt;
    d.hour += p.hourSpeed * dt;
    d.tm -= dt; d.th -= dt;
    if (d.tm <= 0) { d.tm = p.minuteEvery; shoot(world, e, d.min, { speed: 72, range: 300, radius: 3, z: 20, glyph: 'a' }); }
    if (d.th <= 0) { d.th = p.hourEvery; shoot(world, e, d.hour, { speed: 50, range: 300, radius: 4, z: 20, color: '#d6403a', trail: '#fff6d6' }); }

    if (ph >= 1) {
      d.shout -= dt;
      if (d.shout <= 0) {
        d.shout = p.shoutEvery;
        world.floatText(e.x, e.y - 50, '¡Cinco minutos!');
        world.game.audio.play('waveStart', { pitch: 1.8 });
        for (const o of world.enemies.list) if (o !== e) o.haste = 2.5;
        if (world.enemies.list.filter((o) => !o.dead && o !== e).length < p.maxMinions) {
          const pt = world.room.randomFloorPoint(world.rngSpawn, world.player.x, world.player.y, 80);
          world.enemies.spawn('tachon', pt.x, pt.y);
        }
      }
    }
    if (ph === 2) {
      d.chime -= dt;
      if (d.chime <= 0) {
        d.chime = p.chimeEvery;
        const n = 16, gap = world.rngSpawn.int(0, n - 1);
        for (let i = 0; i < n; i++) if (i !== gap && i !== (gap + 1) % n && i !== (gap + 2) % n) {
          shoot(world, e, (i / n) * Math.PI * 2, { speed: 62, range: 320, radius: 3, z: 20, color: '#ffd65c', trail: '#25307a' });
        }
        world.game.audio.play('cleared', { pitch: 0.5, volume: 0.6 });
      }
      d.flip -= dt;
      if (d.flip <= 0) { d.flip = 4 + Math.random() * 2; d.dir *= -1; }
    }
  },

  /** Las agujas dibujadas sobre la esfera para que se lea hacia dónde dispara. */
  renderExtra(g, e) {
    const cx = Math.round(e.x), cy = Math.round(e.y - 22);
    const hand = (a, len, col) => {
      g.fillStyle = col;
      for (let i = 0; i < len; i += 2) g.fillRect(Math.round(cx + Math.cos(a) * i), Math.round(cy + Math.sin(a) * i), 2, 2);
    };
    hand(e.data.hour, 10, '#d6403a');
    hand(e.data.min, 15, '#191817');
  },
};
