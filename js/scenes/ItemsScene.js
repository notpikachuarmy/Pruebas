import { Scene, dim } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { itemIcon, RARITY_COLOR } from '../items/ItemIcons.js';

/** Lista de objetos y sinergias de la run actual (desde la pausa). Navegable con mando. */
export class ItemsScene extends Scene {
  constructor(game, world) {
    super(game);
    this.overlay = true;
    this.world = world;
    const entries = [
      ...world.items.owned.map((it) => ({ kind: 'item', it })),
      ...world.items.synergies.map((s) => ({ kind: 'syn', it: s })),
    ];
    this.entries = entries;
    const rows = entries.map((e) => ({ type: 'button', label: e.kind === 'syn' ? `✦ ${e.it.name}` : e.it.name, action: () => {} }));
    rows.push({ type: 'button', label: 'Volver', action: () => game.popScene() });
    this.menu = new Menu(game, rows, { x: 60, y: 60, align: 'left', width: 150, spacing: 12, size: 9, maxVisible: 15, onCancel: () => game.popScene() });
  }

  update(dt) { super.update(dt); this.menu.update(dt); }

  renderUI(r) {
    dim(r, 0.96);
    r.text('Objetos de esta run', 240, 30, { size: 14, weight: 700, color: '#e8e6dc', align: 'center' });
    if (!this.entries.length) r.text('Todavía no llevas nada. Busca salas de recompensa, la tienda o los rincones secretos.', 240, 110, { size: 8, color: '#9b8fc7', align: 'center' });
    this.renderOverDim(r);
    this.menu.render(r);
    const e = this.entries[this.menu.index];
    if (e) {
      const color = e.kind === 'syn' ? '#ffd65c' : RARITY_COLOR[e.it.rarity];
      r.text(e.it.name, 250, 70, { size: 12, weight: 700, color });
      if (e.kind === 'item') r.text(e.it.rarity, 250, 84, { size: 8, color: '#9b8fc7' });
      else r.text(`Requiere: ${e.it.requires.map((id) => this.game.content.items[id].name).join(' + ')}`, 250, 84, { size: 8, color: '#9b8fc7' });
      this._wrap(r, e.it.description, 250, 104, 200);
    }
  }

  /** Iconos junto a cada fila visible. */
  renderOverDim(r) {
    const ctx = r.ui, m = this.menu;
    ctx.imageSmoothingEnabled = false;
    const start = m.scrollStart, end = start + m.maxVisible;
    this.entries.forEach((e, i) => {
      if (e.kind === 'item' && i >= start && i < end) ctx.drawImage(itemIcon(e.it), 46, 52 + (i - start) * 12, 8, 8);
    });
  }

  _wrap(r, text, x, y, width) {
    const words = text.split(' ');
    let line = '', ly = y;
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (r.measure(test, 9) > width && line) { r.text(line, x, ly, { size: 9, color: '#e8e6dc' }); line = w; ly += 13; }
      else line = test;
    }
    if (line) r.text(line, x, ly, { size: 9, color: '#e8e6dc' });
  }
}
