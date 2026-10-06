import { VIEW_W } from '../core/config.js';
import { promptText } from './prompt.js';

/** Interfaz durante la partida: vida, Lucidez, oleada, Silencio y avisos de interacción. */
export class HUD {
  constructor(game) { this.game = game; }

  /** Elementos pixel art (corazones) en la capa del mundo. */
  renderWorld(g, world) {
    const p = world.player;
    const max = p.stats.get('maxHp');
    for (let i = 0; i < max / 2; i++) {
      const x = 8 + i * 12, y = 6;
      const fill = Math.max(0, Math.min(2, p.hp - i * 2)); // 0, 1 (medio) o 2
      this._heart(g, x, y, '#3a2f5c');
      if (fill === 2) this._heart(g, x, y, '#eb2f2d');
      if (fill === 1) { g.save(); g.beginPath(); g.rect(x, y, 5, 10); g.clip(); this._heart(g, x, y, '#eb2f2d'); g.restore(); }
    }
    // Silencio (dash): pequeña barra de recarga
    const cd = p.dashCooldown / (p.stats.get('dashCooldown') + p.stats.get('dashDuration'));
    g.fillStyle = '#3a2f5c';
    g.fillRect(8, 16, 34, 2);
    g.fillStyle = cd <= 0 ? '#c9bde6' : '#6e62a0';
    g.fillRect(8, 16, Math.round(34 * (1 - cd)), 2);
    // Icono de Lucidez
    g.fillStyle = '#c9bde6'; g.fillRect(52, 7, 5, 5);
    g.fillStyle = '#ffffff'; g.fillRect(53, 8, 2, 2);
  }

  _heart(g, x, y, c) {
    g.fillStyle = c;
    g.fillRect(x + 1, y, 3, 2); g.fillRect(x + 6, y, 3, 2);
    g.fillRect(x, y + 1, 10, 3); g.fillRect(x + 1, y + 4, 8, 2);
    g.fillRect(x + 2, y + 6, 6, 1); g.fillRect(x + 3, y + 7, 4, 1); g.fillRect(x + 4, y + 8, 2, 1);
  }

  renderUI(r, world, scene) {
    const run = world.run, dream = run.dream;
    r.text(String(run.lucidity), 60, 13, { size: 9, color: '#e8e6dc' });
    r.text(dream.name, VIEW_W - 8, 14, { size: 8, color: '#9b8fc7', align: 'right' });

    const enc = world.encounter;
    if (enc && enc.waveIndex >= 0 && !enc.finished) {
      const label = dream.text.wave.replace('{n}', enc.waveIndex + 1).replace('{total}', enc.totalWaves);
      r.text(label, VIEW_W / 2, 14, { size: 9, color: '#e8e6dc', align: 'center' });
      if (enc.banner > 0) {
        const a = Math.min(1, enc.banner * 2);
        r.text(label, VIEW_W / 2, 110, { size: 20, weight: 700, color: '#fff6d6', align: 'center', alpha: a });
      }
    }
    if (world.cleared && world.exit) {
      r.text(dream.text.cleared, VIEW_W / 2, 14, { size: 9, color: '#ffd65c', align: 'center' });
      if (world.playerAtExit() && !world.run.result) {
        r.text(promptText(this.game, 'INTERACT', dream.text.exitPrompt), world.exit.x + 16, world.exit.y + 24 - 26, { size: 9, color: '#fff6d6', align: 'center' });
      }
    }
    if (scene.introTime > 0) {
      const a = Math.min(1, scene.introTime);
      r.text(dream.text.intro, VIEW_W / 2, 230, { size: 10, color: '#c9bde6', align: 'center', alpha: a });
    }
  }
}
