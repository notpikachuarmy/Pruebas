import { Scene, dim, closeHint, wantsClose } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { Backdrop } from '../ui/Backdrop.js';
import { itemIcon, RARITY_COLOR } from '../items/ItemIcons.js';

const BOOKS = ['Bestiario', 'Guía de objetos'];
const ROLE_NAMES = {
  perseguidor: 'Perseguidor', tirador: 'Tirador', soporte: 'Soporte', huidizo: 'Huidizo',
  trampa: 'Trampa viviente', modificador: 'Modificador', especial: 'Especial', minijefe: 'Mini-jefe', jefe: 'Jefe',
};

/**
 * La estantería: dos libros.
 *  - Bestiario: enemigos vistos (vida, qué hacen, cuántos has disipado, cuántas veces te expulsaron).
 *  - Guía de objetos: objetos conseguidos (descripción, veces conseguido) y sinergias descubiertas.
 * Lo no descubierto aparece como "????". Izquierda/derecha cambian de libro.
 * Se abre desde el menú principal o desde la estantería de la primera sala de cada sueño.
 */
export class LibraryScene extends Scene {
  constructor(game, { backdrop = null, overlay = false } = {}) {
    super(game);
    this.overlay = overlay;
    this.backdrop = backdrop ?? (overlay ? null : new Backdrop());
    this.book = 0;
    this._build();
  }

  get meta() { return this.game.save.data.meta; }

  _build() {
    const c = this.game.content;
    if (this.book === 0) {
      const dreams = Object.values(c.dreams).sort((a, b) => a.tier - b.tier).map((d) => d.id);
      const order = (e) => [dreams.indexOf(e.dream), e.boss ? (e.role === 'jefe' ? 2 : 1) : 0];
      this.entries = Object.values(c.enemies).sort((a, b) => {
        const [da, ba] = order(a), [db, bb] = order(b);
        return da - db || ba - bb;
      }).map((def) => ({ kind: 'enemy', def, known: (() => { const s = this.game.bestiary.get(def.id); return !!s && (s.seen + s.kills + s.killedYou) > 0; })() }));
    } else {
      const found = this.meta.discovered;
      this.entries = [
        ...Object.values(c.items).map((def) => ({ kind: 'item', def, known: found.items.includes(def.id) })),
        { kind: 'header', label: 'Sinergias' },
        ...Object.values(c.synergies).map((def) => ({ kind: 'synergy', def, known: found.synergies.includes(def.id) })),
      ];
    }
    const rows = this.entries.map((e) => (e.kind === 'header'
      ? { type: 'info', label: `— ${e.label} —` }
      : { type: 'button', label: e.known ? e.def.name : '????', action: () => {} }));
    rows.push({ type: 'button', label: 'Cerrar el libro', action: () => this.game.popScene() });
    this.menu = new Menu(this.game, rows, { x: 52, y: 66, align: 'left', width: 150, spacing: 12, size: 9, maxVisible: 15, onCancel: () => this.game.popScene() });
  }

  update(dt) {
    super.update(dt);
    if (this.time > 0.1 && wantsClose(this.game)) { this.game.popScene(); return; }
    const input = this.game.input;
    if (input.isPressed('UI_LEFT') || input.isPressed('UI_RIGHT')) {
      this.book = 1 - this.book;
      this.game.audio.play('menuMove');
      this._build();
      return;
    }
    this.menu.update(dt);
  }

  renderWorld(g) { this.backdrop?.render(g, this.game.time); }

  renderUI(r) {
    if (this.overlay) dim(r, 0.94);
    closeHint(r, this.game);
    // Tapas de los dos libros como pestañas
    BOOKS.forEach((name, i) => {
      const x = 150 + i * 180, active = i === this.book;
      r.ui.fillStyle = active ? '#4b2f1c' : '#2a1d14';
      r.ui.fillRect(x - 70, 14, 140, 20);
      r.ui.fillStyle = active ? '#ffd65c' : '#5d5480';
      r.ui.fillRect(x - 70, 32, 140, 2);
      r.text(name, x, 28, { size: 11, weight: 700, color: active ? '#fff6d6' : '#9b8fc7', align: 'center' });
    });
    r.text('‹ ›', 240, 28, { size: 9, color: '#5d5480', align: 'center' });
    const total = this.entries.filter((e) => e.kind !== 'header');
    r.text(`Descubierto: ${total.filter((e) => e.known).length} / ${total.length}`, 52, 52, { size: 8, color: '#9b8fc7' });

    this.menu.render(r);
    this._icons(r);
    const e = this.entries[this.menu.index];
    if (e && e.kind !== 'header') this._detail(r, e);
    r.text('Izquierda / derecha: cambiar de libro', 240, 264, { size: 7, color: '#5d5480', align: 'center' });
  }

  /** Iconos de objetos junto a la lista. */
  _icons(r) {
    if (this.book !== 1) return;
    const ctx = r.ui, m = this.menu, start = m.scrollStart;
    ctx.imageSmoothingEnabled = false;
    this.entries.forEach((e, i) => {
      if (i < start || i >= start + m.maxVisible || e.kind !== 'item') return;
      const y = 58 + (i - start) * 12;
      if (e.known) ctx.drawImage(itemIcon(e.def), 40, y, 8, 8);
      else { ctx.fillStyle = '#2e2552'; ctx.fillRect(40, y, 8, 8); }
    });
  }

  _detail(r, e) {
    const x = 250;
    if (!e.known) {
      r.text('????', x, 80, { size: 14, weight: 700, color: '#5d5480' });
      const hint = e.kind === 'enemy' ? 'Todavía no te has cruzado con esto.'
        : e.kind === 'synergy' ? 'Junta los objetos adecuados para descubrirla.'
          : e.def.locked && !this.meta.unlocks.items.includes(e.def.id) ? 'Este objeto aún está bloqueado. Algún logro lo desbloquea.'
            : 'Todavía no lo has conseguido.';
      this._wrap(r, hint, x, 100, 200, 9, '#9b8fc7');
      return;
    }
    const c = this.game.content;
    if (e.kind === 'enemy') {
      const d = e.def, st = this.game.bestiary.get(d.id);
      // Retrato a doble tamaño
      const sprite = this.game.assets.sprite(d.sprite);
      r.ui.imageSmoothingEnabled = false;
      sprite.draw(r.ui, 'idle', this.game.time, x + 185, 112, { scale: d.boss ? 1.4 : 2.2, flip: false });
      r.text(d.name, x, 74, { size: 12, weight: 700, color: d.boss ? '#eb2f2d' : '#fff6d6' });
      r.text(`${ROLE_NAMES[d.role] ?? d.role} · ${c.dreams[d.dream]?.name ?? ''}`, x, 87, { size: 8, color: '#9b8fc7' });
      r.text(`Vida: ${d.hp}`, x, 101, { size: 9, color: '#e8e6dc' });
      let y = this._wrap(r, d.description, x, 120, 205, 8, '#e8e6dc');
      if (d.theme) y = this._wrap(r, `«${d.theme}»`, x, y + 4, 205, 8, '#9b8fc7');
      r.text(`Disipados: ${st.kills}`, x, Math.max(y + 10, 196), { size: 9, color: '#7fd6a0' });
      r.text(`Te ha expulsado: ${st.killedYou} ${st.killedYou === 1 ? 'vez' : 'veces'}`, x, Math.max(y + 23, 209), { size: 9, color: '#eb2f2d' });
    } else if (e.kind === 'item') {
      const d = e.def;
      r.ui.imageSmoothingEnabled = false;
      r.ui.drawImage(itemIcon(d), x + 170, 64, 32, 32);
      r.text(d.name, x, 76, { size: 12, weight: 700, color: RARITY_COLOR[d.rarity] });
      r.text(d.rarity, x, 89, { size: 8, color: '#9b8fc7' });
      const y = this._wrap(r, d.description, x, 110, 205, 9, '#e8e6dc');
      r.text(`Conseguido ${this.meta.itemCounts[d.id] ?? 0} ${(this.meta.itemCounts[d.id] ?? 0) === 1 ? 'vez' : 'veces'}`, x, y + 10, { size: 9, color: '#7fd6a0' });
      const syn = Object.values(c.synergies).filter((s) => s.requires.includes(d.id));
      if (syn.length) {
        const known = syn.filter((s) => this.meta.discovered.synergies.includes(s.id)).length;
        r.text(`Sinergias: ${known} / ${syn.length} descubiertas`, x, y + 24, { size: 8, color: '#ffd65c' });
      }
    } else {
      const d = e.def;
      r.text(d.name, x, 76, { size: 12, weight: 700, color: '#ffd65c' });
      const req = d.requires.map((id) => (this.meta.discovered.items.includes(id) ? c.items[id].name : '????')).join(' + ');
      this._wrap(r, `Requiere: ${req}`, x, 92, 205, 8, '#9b8fc7');
      this._wrap(r, d.description, x, 118, 205, 9, '#e8e6dc');
    }
  }

  _wrap(r, text, x, y, width, size, color) {
    let line = '';
    for (const w of text.split(' ')) {
      const t = line ? `${line} ${w}` : w;
      if (r.measure(t, size) > width && line) { r.text(line, x, y, { size, color }); line = w; y += size + 4; }
      else line = t;
    }
    if (line) { r.text(line, x, y, { size, color }); y += size + 4; }
    return y;
  }
}
