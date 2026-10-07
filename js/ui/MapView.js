import { VIEW_W, VIEW_H } from '../core/config.js';
import { ROOM_TYPES } from '../rooms/roomTypes/index.js';
import { DIRS } from '../rooms/FloorGenerator.js';

/**
 * Minimapa (esquina) y mapa completo (mantener MAPA).
 * Se ve: las salas visitadas y las vecinas por puertas normales. Las secretas, solo al descubrirlas.
 */
export class MapView {
  constructor(game) { this.game = game; }

  _visible(world) {
    const floor = world.run.floor;
    const shown = new Map(); // key → 'visited' | 'seen'
    // Plano revelado (evento): todo lo que no es secreto
    // Brújula: las salas importantes se ven siempre (aunque haya Folio en blanco)
    if (world.run.flags.compass && !world.run.flags.mapRevealed) {
      const important = ['boss', 'miniboss', 'reward', 'shop', 'healing', 'event', 'challenge'];
      for (const n of floor.nodes.values()) if (important.includes(n.type)) shown.set(n.key, n.state.visited ? 'visited' : 'seen');
    }
    if (world.run.flags.mapRevealed) {
      for (const n of floor.nodes.values()) if (n.type !== 'secret' || n.state.discovered) shown.set(n.key, n.state.visited ? 'visited' : 'seen');
      return shown;
    }
    for (const n of floor.nodes.values()) {
      if (!n.state.visited) continue;
      shown.set(n.key, 'visited');
      if (world.mods.hideUnvisited) continue;   // regla "Folio en blanco"
      for (const [dir, kind] of Object.entries(n.doors)) {
        if (kind === 'secret' && !n.state.revealed?.[dir]) continue;
        const m = floor.nodes.get(`${n.x + DIRS[dir].dx},${n.y + DIRS[dir].dy}`);
        if (m && !shown.has(m.key) && (m.type !== 'secret' || m.state.discovered)) shown.set(m.key, 'seen');
      }
    }
    return shown;
  }

  /** Dibuja el mapa en una caja; cw/ch = tamaño de cada sala en píxeles. */
  _draw(g, world, cx, cy, cw, ch, gap, range) {
    const floor = world.run.floor, cur = world.node;
    const shown = this._visible(world);
    for (const [key, how] of shown) {
      const n = floor.nodes.get(key);
      const dx = n.x - cur.x, dy = n.y - cur.y;
      if (range && (Math.abs(dx) > range || Math.abs(dy) > range)) continue;
      const x = Math.round(cx + dx * (cw + gap) - cw / 2), y = Math.round(cy + dy * (ch + gap) - ch / 2);
      // Conexiones
      g.fillStyle = '#4b3f75';
      for (const [dir, kind] of Object.entries(n.doors)) {
        if (how !== 'visited' || (kind === 'secret' && !n.state.revealed?.[dir])) continue;
        if (dir === 'E') g.fillRect(x + cw, y + Math.floor(ch / 2), gap, 1);
        if (dir === 'W') g.fillRect(x - gap, y + Math.floor(ch / 2), gap, 1);
        if (dir === 'S') g.fillRect(x + Math.floor(cw / 2), y + ch, 1, gap);
        if (dir === 'N') g.fillRect(x + Math.floor(cw / 2), y - gap, 1, gap);
      }
      const isCur = n === cur;
      g.fillStyle = isCur ? '#eb2f2d' : how === 'visited' ? '#6e62a0' : '#2e2552';
      g.fillRect(x, y, cw, ch);
      if (how === 'seen') { g.fillStyle = '#4b3f75'; g.fillRect(x, y, cw, 1); g.fillRect(x, y + ch - 1, cw, 1); g.fillRect(x, y, 1, ch); g.fillRect(x + cw - 1, y, 1, ch); }
      // Icono del tipo (punto de color) para salas especiales
      if (n.type !== 'combat' && n.type !== 'start') {
        g.fillStyle = ROOM_TYPES[n.type].mapColor;
        const s = Math.max(2, Math.floor(Math.min(cw, ch) / 3));
        g.fillRect(x + Math.floor((cw - s) / 2), y + Math.floor((ch - s) / 2), s, s);
      }
      // Cosas que te has dejado: corazones (rojo), Lucidez (lila), algo por usar (dorado)
      if (how === 'visited') {
        const left = world.leftovers(n);
        const marks = [];
        if (left.hearts) marks.push('#eb2f2d');
        if (left.lucidity) marks.push('#e8e6dc');
        if (left.loot) marks.push('#ffd65c');
        const ms = cw >= 16 ? 3 : 2;
        if (marks.length) {
          // Franja oscura en la base de la sala para que las marcas se lean sobre cualquier color
          g.fillStyle = '#100c20';
          g.fillRect(x, y + ch - ms - 2, marks.length * (ms + 1) + 1, ms + 2);
        }
        marks.forEach((c, i) => {
          g.fillStyle = c; g.fillRect(x + 1 + i * (ms + 1), y + ch - ms - 1, ms, ms);
        });
      }
    }
  }

  renderMini(g, world) {
    const w = 62, h = 44, x0 = VIEW_W - w - 4, y0 = 26;
    g.globalAlpha = 0.75;
    g.fillStyle = '#100c20';
    g.fillRect(x0, y0, w, h);
    g.globalAlpha = 1;
    g.save();
    g.beginPath(); g.rect(x0 + 1, y0 + 1, w - 2, h - 2); g.clip();
    this._draw(g, world, x0 + w / 2, y0 + h / 2, 8, 6, 2, 4);
    g.restore();
  }

  renderFull(g, world) {
    g.globalAlpha = 0.86;
    g.fillStyle = '#0e0a1c';
    g.fillRect(0, 0, VIEW_W, VIEW_H);
    g.globalAlpha = 1;
    this._draw(g, world, VIEW_W / 2, VIEW_H / 2 + 6, 22, 15, 4, 0);
  }

  renderFullUI(r, world) {
    r.text(world.run.dream.name, VIEW_W / 2, 22, { size: 12, weight: 700, color: '#e8e6dc', align: 'center' });
    const types = ['boss', 'miniboss', 'reward', 'shop', 'healing', 'challenge', 'event', 'secret'];
    let x = 18;
    for (const t of types) {
      const c = r.ui;
      c.fillStyle = ROOM_TYPES[t].mapColor; c.fillRect(x, 254, 6, 6);
      r.text(ROOM_TYPES[t].label, x + 9, 260, { size: 7, color: '#c9bde6' });
      x += r.measure(ROOM_TYPES[t].label, 7) + 18;
    }
    // Leyenda de lo pendiente
    const pend = [['#eb2f2d', 'Corazón'], ['#e8e6dc', 'Lucidez'], ['#ffd65c', 'Algo por usar']];
    let px = 150;
    for (const [c, label] of pend) {
      r.ui.fillStyle = c; r.ui.fillRect(px, 237, 4, 4);
      r.text(label, px + 7, 242, { size: 7, color: '#9b8fc7' });
      px += r.measure(label, 7) + 22;
    }
    if (world.mods.hideUnvisited && !world.run.flags.mapRevealed) r.text('Folio en blanco: solo ves lo que ya has recorrido', 240, 36, { size: 7, color: '#9b8fc7', align: 'center' });
  }
}
