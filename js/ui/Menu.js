import { clamp } from '../core/math.js';

/**
 * Lista navegable con teclado o mando (UI_UP/DOWN/LEFT/RIGHT/CONFIRM/CANCEL).
 * Tipos de opción:
 *  { type: 'button', label, action }
 *  { type: 'toggle', label, get, set }
 *  { type: 'range',  label, get, set, min, max, step, format }
 *  { type: 'info',   label }   (no seleccionable)
 * Cualquier opción acepta `hint` (texto de ayuda) y `disabled` (bool o función).
 */
export class Menu {
  constructor(game, items, { x = 240, y = 120, spacing = 15, width = 220, align = 'center', onCancel = null, size = 10, columns = null } = {}) {
    this.columns = columns;      // posiciones x si `value()` devuelve varias columnas
    this.game = game;
    this.items = items;
    this.x = x; this.y = y; this.spacing = spacing; this.width = width; this.align = align; this.size = size;
    this.onCancel = onCancel;
    this.index = this._firstSelectable(0, 1);
    this.time = 0;
  }

  get current() { return this.items[this.index]; }

  _selectable(item) {
    if (!item || item.type === 'info') return false;
    return !(typeof item.disabled === 'function' ? item.disabled() : item.disabled);
  }

  _firstSelectable(from, dir) {
    const n = this.items.length;
    for (let i = 0; i < n; i++) {
      const idx = (from + i * dir + n * 2) % n;
      if (this._selectable(this.items[idx])) return idx;
    }
    return 0;
  }

  update(dt) {
    this.time += dt;
    const input = this.game.input, audio = this.game.audio;
    if (input.isPressed('UI_DOWN')) { this.index = this._firstSelectable(this.index + 1, 1); audio.play('menuMove'); }
    if (input.isPressed('UI_UP')) { this.index = this._firstSelectable(this.index - 1, -1); audio.play('menuMove'); }

    const it = this.current;
    if (!this._selectable(it)) return;
    const left = input.isPressed('UI_LEFT'), right = input.isPressed('UI_RIGHT');

    if (it.type === 'range' && (left || right)) {
      const v = clamp(Math.round((it.get() + (right ? it.step : -it.step)) / it.step) * it.step, it.min, it.max);
      it.set(Number(v.toFixed(3)));
      audio.play('menuMove');
    } else if (it.type === 'toggle' && (left || right || input.isPressed('UI_CONFIRM'))) {
      it.set(!it.get());
      audio.play('menuOk');
    } else if (it.type === 'button' && input.isPressed('UI_CONFIRM')) {
      audio.play('menuOk');
      it.action();
      return;
    }
    if (input.isPressed('UI_CANCEL') && this.onCancel) { audio.play('menuBack'); this.onCancel(); }
  }

  _valueText(it) {
    if (it.type === 'toggle') return it.get() ? 'Sí' : 'No';
    if (it.type === 'range') return it.format ? it.format(it.get()) : String(it.get());
    if (it.value) return it.value();
    return null;
  }

  render(r) {
    const ctx = r.ui;
    this.items.forEach((it, i) => {
      const y = this.y + i * this.spacing;
      const selected = i === this.index && this._selectable(it);
      const disabled = it.type !== 'info' && !this._selectable(it);
      const color = it.type === 'info' ? '#9b8fc7' : disabled ? '#5d5480' : selected ? '#ffffff' : '#c9bde6';
      const value = this._valueText(it);

      if (selected) {
        // Barra de selección con el rojo de los auriculares
        const w = this.align === 'center' ? (value ? this.width : r.measure(it.label, this.size) + 24) : this.width;
        const x0 = this.align === 'center' ? this.x - w / 2 : this.x - 8;
        ctx.fillStyle = 'rgba(235,47,45,0.18)';
        ctx.fillRect(x0, y - this.size + 1, w, this.size + 3);
        ctx.fillStyle = '#eb2f2d';
        ctx.fillRect(x0, y - this.size + 1, 2, this.size + 3);
      }

      if (Array.isArray(value)) {
        r.text(it.label, this.x - this.width / 2 + 8, y, { size: this.size, color });
        value.forEach((v, j) => r.text(v, this.columns[j], y, { size: this.size, color: selected ? '#ffd65c' : color, align: 'center' }));
      } else if (value !== null) {
        const lx = this.align === 'center' ? this.x - this.width / 2 + 8 : this.x;
        const rx = this.align === 'center' ? this.x + this.width / 2 - 8 : this.x + this.width - 16;
        r.text(it.label, lx, y, { size: this.size, color });
        const arrows = it.type === 'range' || it.type === 'toggle';
        r.text(arrows && selected ? `‹ ${value} ›` : value, rx, y, { size: this.size, color: selected ? '#ffd65c' : color, align: 'right' });
      } else {
        r.text(it.label, this.x, y, { size: this.size, color, align: this.align });
      }
    });
    const hint = this.current?.hint;
    if (hint) r.text(typeof hint === 'function' ? hint() : hint, 240, 252, { size: 8, color: '#9b8fc7', align: 'center' });
  }
}
