import { VIEW_W } from '../core/config.js';
import { MapView } from './MapView.js';

/** Interfaz durante la partida: vida, Lucidez, Silencio, oleada y mapa. */
export class HUD {
  constructor(game) { this.game = game; this.map = new MapView(game); }

  showFullMap(world) { return this.game.input.isDown('MAP') && !world.run.result; }

  /** Elementos pixel art en la capa del mundo. */
  renderWorld(g, world) {
    const p = world.player;
    const max = p.stats.get('maxHp');
    for (let i = 0; i < max / 2; i++) {
      const x = 8 + (i % 8) * 12, y = 4 + Math.floor(i / 8) * 9;
      const fill = Math.max(0, Math.min(2, p.hp - i * 2));
      this._heart(g, x, y, '#3a2f5c');
      if (fill === 2) this._heart(g, x, y, '#eb2f2d');
      if (fill === 1) { g.save(); g.beginPath(); g.rect(x, y, 5, 10); g.clip(); this._heart(g, x, y, '#eb2f2d'); g.restore(); }
    }
    const lx = 8 + Math.min(8, max / 2) * 12 + 4;
    // Silencio (dash): barra de recarga bajo los corazones
    const cd = p.dashCooldown / (p.stats.get('dashCooldown') + p.stats.get('dashDuration'));
    g.fillStyle = '#3a2f5c';
    g.fillRect(8, max > 16 ? 23 : 15, 34, 2);
    g.fillStyle = cd <= 0 ? '#c9bde6' : '#6e62a0';
    g.fillRect(8, max > 16 ? 23 : 15, Math.round(34 * (1 - cd)), 2);
    // Lucidez
    g.fillStyle = '#c9bde6'; g.fillRect(lx, 5, 5, 5);
    g.fillStyle = '#ffffff'; g.fillRect(lx + 1, 6, 2, 2);
    this._lucidityX = lx + 8;

    if (this.showFullMap(world)) this.map.renderFull(g, world);
    else this.map.renderMini(g, world);
  }

  _heart(g, x, y, c) {
    g.fillStyle = c;
    g.fillRect(x + 1, y, 3, 2); g.fillRect(x + 6, y, 3, 2);
    g.fillRect(x, y + 1, 10, 3); g.fillRect(x + 1, y + 4, 8, 2);
    g.fillRect(x + 2, y + 6, 6, 1); g.fillRect(x + 3, y + 7, 4, 1); g.fillRect(x + 4, y + 8, 2, 1);
  }

  renderUI(r, world, scene) {
    if (this.showFullMap(world)) { this.map.renderFullUI(r, world); return; }
    const run = world.run, dream = run.dream;
    r.text(String(run.lucidity), this._lucidityX ?? 60, 11, { size: 9, color: '#e8e6dc' });

    const enc = world.encounter;
    if (enc && enc.waveIndex >= 0 && !enc.finished) {
      const label = dream.text.wave.replace('{n}', enc.waveIndex + 1).replace('{total}', enc.totalWaves);
      r.text(label, VIEW_W / 2, 14, { size: 9, color: '#e8e6dc', align: 'center' });
      if (enc.banner > 0) {
        const a = Math.min(1, enc.banner * 2);
        r.text(label, VIEW_W / 2, 110, { size: 20, weight: 700, color: '#fff6d6', align: 'center', alpha: a });
      }
    } else if (world.node.type === 'boss' && world.cleared) {
      r.text(dream.text.cleared, VIEW_W / 2, 14, { size: 9, color: '#ffd65c', align: 'center' });
    }
    if (scene.introTime > 0) {
      r.text(dream.text.intro, VIEW_W / 2, 238, { size: 10, color: '#c9bde6', align: 'center', alpha: Math.min(1, scene.introTime) });
    }
  }
}
