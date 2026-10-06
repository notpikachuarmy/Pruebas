import { VIEW_W } from '../core/config.js';
import { MapView } from './MapView.js';
import { itemIcon } from '../items/ItemIcons.js';

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
    // Un segmento por carga de Silencio; el que se está recargando se va llenando
    const charges = Math.round(p.stats.get('dashCharges'));
    const segW = Math.floor((34 - (charges - 1) * 2) / charges);
    const by = max > 16 ? 23 : 15;
    for (let i = 0; i < charges; i++) {
      const sx = 8 + i * (segW + 2);
      g.fillStyle = '#3a2f5c'; g.fillRect(sx, by, segW, 2);
      if (i < p.dashCharges) { g.fillStyle = '#c9bde6'; g.fillRect(sx, by, segW, 2); }
      else if (i === p.dashCharges) { g.fillStyle = '#6e62a0'; g.fillRect(sx, by, Math.round(segW * p.dashRecharge / p.stats.get('dashCooldown')), 2); }
    }
    // Lucidez
    g.fillStyle = '#c9bde6'; g.fillRect(lx, 5, 5, 5);
    g.fillStyle = '#ffffff'; g.fillRect(lx + 1, 6, 2, 2);
    this._lucidityX = lx + 8;

    // Objetos conseguidos: columna en el margen izquierdo, fuera de la sala
    const owned = world.items.owned;
    owned.forEach((it, i) => {
      const x = 4, y = 30 + i * 10;
      if (y > 262) return;
      g.drawImage(itemIcon(it), x, y);
      if (it.id === 'despertador_repuesto' && world.items.state(it.id).used) {
        g.globalAlpha = 0.7; g.fillStyle = '#100c20'; g.fillRect(x, y, 8, 8); g.globalAlpha = 1;
      }
    });

    // Barra de vida del jefe
    const boss = world.boss;
    if (boss && !boss.dead && !boss.spawning) {
      const w = 220, x = (VIEW_W - w) / 2, y = 258;
      g.fillStyle = '#100c20'; g.fillRect(x - 1, y - 1, w + 2, 6);
      g.fillStyle = '#3a2f5c'; g.fillRect(x, y, w, 4);
      g.fillStyle = '#d6403a'; g.fillRect(x, y, Math.round(w * Math.max(0, boss.hp) / boss.maxHp), 4);
      if (boss.flash > 0) { g.fillStyle = '#ffffff'; g.fillRect(x, y, Math.round(w * Math.max(0, boss.hp) / boss.maxHp), 1); }
    }

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
    if (enc && enc.waveIndex >= 0 && !enc.finished && !enc.def.noBanner) {
      const label = dream.text.wave.replace('{n}', enc.waveIndex + 1).replace('{total}', enc.totalWaves);
      r.text(label, VIEW_W / 2, 14, { size: 9, color: '#e8e6dc', align: 'center' });
      if (enc.banner > 0) {
        const a = Math.min(1, enc.banner * 2);
        r.text(label, VIEW_W / 2, 110, { size: 20, weight: 700, color: '#fff6d6', align: 'center', alpha: a });
      }
    } else if (world.node.type === 'boss' && world.cleared) {
      r.text(dream.text.cleared, VIEW_W / 2, 14, { size: 9, color: '#ffd65c', align: 'center' });
    }
    const boss = world.boss;
    if (boss && !boss.dead && !boss.spawning) r.text(boss.def.name, VIEW_W / 2, 255, { size: 8, color: '#e8e6dc', align: 'center' });
    const intro = world.bossIntro;
    if (intro) {
      const a = Math.min(1, intro.t * 3, (2.6 - intro.t) * 2);
      r.text(intro.name, VIEW_W / 2, 118, { size: 22, weight: 700, color: '#fff6d6', align: 'center', alpha: a, shadow: '#d6403a' });
      if (intro.title) r.text(intro.title, VIEW_W / 2, 134, { size: 10, color: '#c9bde6', align: 'center', alpha: a });
    }
    if (world.banner) {
      const a = Math.min(1, world.banner.t * 3, (2 - world.banner.t) * 2);
      r.text(world.banner.text, VIEW_W / 2, 118, { size: 20, weight: 700, color: '#d6403a', align: 'center', alpha: a });
    }
    const ib = world.itemBanner;
    if (ib) {
      const a = Math.min(1, ib.t * 4, (3 - ib.t) * 2);
      r.ui.globalAlpha = a * 0.8; r.ui.fillStyle = '#100c20'; r.ui.fillRect(60, 196, 360, 34); r.ui.globalAlpha = 1;
      r.text(ib.title, VIEW_W / 2, 210, { size: 11, weight: 700, color: ib.color, align: 'center', alpha: a });
      r.text(ib.text, VIEW_W / 2, 224, { size: 8, color: '#c9bde6', align: 'center', alpha: a });
    }
    if (scene.introTime > 0 && !ib) {
      r.text(dream.text.intro, VIEW_W / 2, 238, { size: 10, color: '#c9bde6', align: 'center', alpha: Math.min(1, scene.introTime) });
    }
  }
}
