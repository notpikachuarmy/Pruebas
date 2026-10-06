import { Scene } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { Backdrop } from '../ui/Backdrop.js';

/** Registro de soñadores: quién sueña cada sueño y los recuerdos descubiertos. */
export class DreamersScene extends Scene {
  constructor(game, backdrop = new Backdrop()) {
    super(game);
    this.backdrop = backdrop;
    this.dreams = Object.values(game.content.dreams).sort((a, b) => a.tier - b.tier);
    const unlocked = game.save.data.meta.unlocks.dreams;
    const rows = this.dreams.map((d) => ({ type: 'button', label: unlocked.includes(d.id) || !d.locked ? d.owner.name : '???', action: () => {} }));
    rows.push({ type: 'button', label: 'Volver', action: () => game.popScene() });
    this.menu = new Menu(game, rows, { x: 40, y: 70, align: 'left', width: 110, spacing: 14, size: 10, onCancel: () => game.popScene() });
  }

  update(dt) { super.update(dt); this.menu.update(dt); }
  renderWorld(g) { this.backdrop.render(g, this.game.time); }

  renderUI(r) {
    r.text('Soñadores', 240, 32, { size: 18, weight: 700, color: '#e8e6dc', align: 'center' });
    this.menu.render(r);
    const d = this.dreams[this.menu.index];
    if (!d) return;
    const open = !d.locked || this.game.save.data.meta.unlocks.dreams.includes(d.id);
    if (!open) {
      r.text('Todavía no has oído este sueño.', 170, 80, { size: 10, color: '#9b8fc7' });
      r.text('Calma otros sueños para sintonizarlo.', 170, 96, { size: 8, color: '#5d5480' });
      return;
    }
    const found = this.game.dreamers.found(d.id);
    r.text(`${d.owner.name}, ${d.owner.age} años`, 170, 72, { size: 12, weight: 700, color: '#fff6d6' });
    r.text(d.name, 170, 86, { size: 9, color: '#c9bde6' });
    this._wrap(r, d.owner.summary, 170, 102, 280, 8, '#9b8fc7');
    r.text(`Recuerdos: ${found.length} / ${d.fragments?.length ?? 0}`, 170, 134, { size: 8, color: '#ffd65c' });
    let y = 150;
    for (const f of d.fragments ?? []) {
      const known = found.includes(f.id);
      y = this._wrap(r, known ? `· ${f.text}` : '· · ·', 170, y, 280, 8, known ? '#e8e6dc' : '#5d5480') + 4;
    }
  }

  _wrap(r, text, x, y, width, size, color) {
    let line = '';
    for (const w of text.split(' ')) {
      const t = line ? `${line} ${w}` : w;
      if (r.measure(t, size) > width && line) { r.text(line, x, y, { size, color }); line = w; y += size + 3; }
      else line = t;
    }
    if (line) { r.text(line, x, y, { size, color }); y += size + 3; }
    return y;
  }
}
