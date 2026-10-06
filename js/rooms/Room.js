import { TILE, ROOM_COLS, ROOM_ROWS } from '../core/config.js';

const SOLID = 1;

/** Celdas que ocupa cada puerta (fila, columna). Iguales en todas las salas. */
export const DOOR_CELLS = {
  N: [[0, 13], [0, 14]],
  S: [[ROOM_ROWS - 1, 13], [ROOM_ROWS - 1, 14]],
  W: [[6, 0], [7, 0], [8, 0]],
  E: [[6, ROOM_COLS - 1], [7, ROOM_COLS - 1], [8, ROOM_COLS - 1]],
};

/** Dónde aparece el jugador al entrar por cada puerta. */
export const DOOR_ENTRY = {
  N: { x: 14 * TILE, y: 1 * TILE + 12 },
  S: { x: 14 * TILE, y: (ROOM_ROWS - 2) * TILE + 8 },
  W: { x: 1 * TILE + 10, y: 7 * TILE + 12 },
  E: { x: (ROOM_COLS - 1) * TILE - 10, y: 7 * TILE + 12 },
};

/**
 * Una sala: rejilla de tiles creada a partir de un layout de datos.
 * Coordenadas en píxeles locales de la sala (0,0 = esquina superior izquierda).
 */
export class Room {
  constructor(def, tileset, tilesetImage) {
    this.def = def;
    this.rows = def.layout.length;
    this.cols = def.layout[0].length;
    this.width = this.cols * TILE;
    this.height = this.rows * TILE;
    this.tileset = tileset;
    this.tilesetImage = tilesetImage;

    this.solid = new Uint8Array(this.cols * this.rows);
    this.symbols = [];
    this.playerSpawn = { x: this.width / 2, y: this.height / 2 };
    this.enemySpawns = [];
    this.floorCells = [];

    if (this.cols !== ROOM_COLS || this.rows !== ROOM_ROWS) {
      console.warn(`[Room ${def.id}] mide ${this.cols}×${this.rows}; todas las salas deben medir ${ROOM_COLS}×${ROOM_ROWS}`);
    }
    def.layout.forEach((line, r) => {
      if (line.length !== this.cols) console.warn(`[Room ${def.id}] la fila ${r} mide ${line.length}, se esperaba ${this.cols}`);
      for (let c = 0; c < this.cols; c++) {
        const ch = line[c] ?? '#';
        this.symbols.push(ch);
        const isSolid = ch === '#' || tileset.solids?.[ch] !== undefined;
        if (isSolid) this.solid[r * this.cols + c] = SOLID;
        else this.floorCells.push(r * this.cols + c);
        const cx = c * TILE + TILE / 2, cy = r * TILE + TILE / 2 + 4;
        if (ch === 'P') this.playerSpawn = { x: cx, y: cy };
        if (ch === 'S') this.enemySpawns.push({ x: cx, y: cy });
      }
    });

    // Puertas: { dir: { kind: 'normal'|'boss'|'challenge'|'secret', open: bool, revealed: bool } }
    this.doors = {};
    this.cache = this._prerender();
    this.time = 0;
  }

  /** Configura las puertas que tiene esta sala (las demás quedan como pared). */
  setDoors(spec) {
    this.doors = spec;
    for (const dir of Object.keys(spec)) this.setDoorOpen(dir, spec[dir].open);
  }

  setDoorOpen(dir, open) {
    const door = this.doors[dir];
    if (!door) return;
    door.open = open;
    for (const [r, c] of DOOR_CELLS[dir]) this.solid[r * this.cols + c] = open ? 0 : SOLID;
  }

  /** Cierra o abre todas las puertas visibles (combate en curso). Las secretas sin revelar no cambian. */
  setAllDoors(open) {
    for (const dir of Object.keys(this.doors)) {
      const d = this.doors[dir];
      if (d.kind === 'secret' && !d.revealed) continue;
      this.setDoorOpen(dir, open);
    }
  }

  /** ¿Qué puerta (si alguna) ocupa esta celda? */
  doorAtCell(c, r) {
    for (const dir of Object.keys(this.doors)) {
      if (DOOR_CELLS[dir].some(([rr, cc]) => rr === r && cc === c)) return dir;
    }
    return null;
  }

  /** Puerta abierta por la que está saliendo el jugador (sus pies ya están en la celda de la puerta). */
  exitDirection(x, y) {
    const d = this.doors;
    if (d.N?.open && y < TILE - 2) return 'N';
    if (d.S?.open && y > (this.rows - 1) * TILE + 4) return 'S';
    if (d.W?.open && x < TILE - 2) return 'W';
    if (d.E?.open && x > (this.cols - 1) * TILE + 2) return 'E';
    return null;
  }

  isSolidCell(c, r) {
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return true;
    return this.solid[r * this.cols + c] === SOLID;
  }

  isSolidAt(x, y) { return this.isSolidCell(Math.floor(x / TILE), Math.floor(y / TILE)); }

  /** ¿La caja de pies de la entidad toca algo sólido? Caja: ancho 2r, alto r, base en (x, y). */
  boxHitsSolid(x, y, r) {
    const c0 = Math.floor((x - r) / TILE), c1 = Math.floor((x + r - 0.01) / TILE);
    const r0 = Math.floor((y - r) / TILE), r1 = Math.floor((y - 0.01) / TILE);
    for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) if (this.isSolidCell(cc, rr)) return true;
    return false;
  }

  /**
   * Mueve una entidad (con x, y, r) resolviendo colisiones eje a eje.
   * Devuelve 0 si no choca, 1 si choca en X, 2 en Y, 3 en ambos.
   */
  move(e, dx, dy) {
    let hit = 0;
    if (dx !== 0) {
      e.x += dx;
      if (this.boxHitsSolid(e.x, e.y, e.r)) {
        if (dx > 0) e.x = Math.floor((e.x + e.r) / TILE) * TILE - e.r - 0.01;
        else e.x = (Math.floor((e.x - e.r) / TILE) + 1) * TILE + e.r + 0.01;
        hit |= 1;
      }
    }
    if (dy !== 0) {
      e.y += dy;
      if (this.boxHitsSolid(e.x, e.y, e.r)) {
        if (dy > 0) e.y = Math.floor(e.y / TILE) * TILE - 0.01;
        else e.y = (Math.floor((e.y - e.r) / TILE) + 1) * TILE + e.r + 0.01;
        hit |= 2;
      }
    }
    return hit;
  }

  /** Línea de visión muestreando cada 4 px. Suficiente para salas pequeñas. */
  lineOfSight(x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0;
    const steps = Math.ceil(Math.hypot(dx, dy) / 4);
    for (let i = 1; i < steps; i++) {
      if (this.isSolidAt(x0 + (dx * i) / steps, y0 + (dy * i) / steps)) return false;
    }
    return true;
  }

  /** Punto de suelo aleatorio lejos de (ax, ay) y con margen respecto a obstáculos. */
  randomFloorPoint(rng, ax, ay, minDist = 80) {
    for (let tries = 0; tries < 60; tries++) {
      const idx = rng.pick(this.floorCells);
      const c = idx % this.cols, r = Math.floor(idx / this.cols);
      if (this.isSolidCell(c - 1, r) || this.isSolidCell(c + 1, r) || this.isSolidCell(c, r - 1)) continue;
      const x = c * TILE + TILE / 2, y = r * TILE + TILE - 2;
      if (Math.hypot(x - ax, y - ay) >= minDist) return { x, y };
    }
    const idx = rng.pick(this.floorCells);
    return { x: (idx % this.cols) * TILE + TILE / 2, y: Math.floor(idx / this.cols) * TILE + TILE - 2 };
  }

  /** La sala estática se dibuja una sola vez en un canvas aparte (1 drawImage por frame). */
  _prerender() {
    const c = document.createElement('canvas');
    c.width = this.width; c.height = this.height;
    const g = c.getContext('2d');
    const ts = this.tileset, img = this.tilesetImage, S = TILE;
    const draw = (index, col, row) => {
      if (img) g.drawImage(img, index * ts.size, 0, ts.size, ts.size, col * S, row * S, S, S);
      else { g.fillStyle = index === ts.wall || index === ts.wallFace ? '#2e2852' : '#d9d6cb'; g.fillRect(col * S, row * S, S, S); }
    };
    for (let r = 0; r < this.rows; r++) {
      for (let col = 0; col < this.cols; col++) {
        const ch = this.symbols[r * this.cols + col];
        if (ch === '#') {
          draw(this.isSolidCell(col, r + 1) ? ts.wall : ts.wallFace, col, r);
        } else {
          draw(col === 2 ? ts.floorMargin : ts.floor, col, r);
          const solidIndex = ts.solids?.[ch];
          if (solidIndex !== undefined) {
            g.fillStyle = 'rgba(20,14,40,0.25)';           // sombra
            g.fillRect(col * S + 2, r * S + 12, S - 2, 4);
            draw(solidIndex, col, r);
          }
        }
      }
    }
    return c;
  }

  render(g, dt = 1 / 60) {
    this.time += dt;
    g.drawImage(this.cache, 0, 0);
    for (const dir of Object.keys(this.doors)) this._renderDoor(g, dir, this.doors[dir]);
  }

  _renderDoor(g, dir, door) {
    const cells = DOOR_CELLS[dir];
    const [r0, c0] = cells[0], [r1, c1] = cells[cells.length - 1];
    const x = c0 * TILE, y = r0 * TILE, w = (c1 - c0 + 1) * TILE, h = (r1 - r0 + 1) * TILE;
    const frame = door.color ?? '#584e82';

    if (door.kind === 'secret' && !door.revealed) {
      // Pared con un garabato: pista de que ahí hay algo
      const cracks = door.hits ?? 0;
      g.fillStyle = '#8b7fc0';
      const cx = x + w / 2, cy = y + h / 2;
      g.fillRect(cx - 2, cy - 1, 4, 1); g.fillRect(cx - 1, cy, 1, 2);
      for (let i = 0; i < cracks; i++) g.fillRect(cx - 4 + i * 2, cy - 3 + (i % 2) * 5, 2, 1);
      return;
    }
    // Hueco de la puerta
    g.fillStyle = '#100c20';
    g.fillRect(x, y, w, h);
    g.fillStyle = frame;
    if (dir === 'N' || dir === 'S') { g.fillRect(x - 2, y, 2, h); g.fillRect(x + w, y, 2, h); }
    else { g.fillRect(x, y - 2, w, 2); g.fillRect(x, y + h, w, 2); }
    if (!door.open) {
      // Puerta cerrada: barrotes de tinta
      g.fillStyle = '#25307a';
      if (dir === 'N' || dir === 'S') for (let i = 3; i < w; i += 5) g.fillRect(x + i, y, 2, h);
      else for (let i = 3; i < h; i += 5) g.fillRect(x, y + i, w, 2);
    } else if (door.kind === 'boss') {
      const a = 0.4 + 0.3 * Math.sin(this.time * 4);
      g.globalAlpha = a; g.fillStyle = '#d6403a'; g.fillRect(x + 2, y + 2, w - 4, h - 4); g.globalAlpha = 1;
    }
    if (door.icon) {
      // Icono del tipo de sala, con fondo oscuro para que se lea sobre los barrotes
      const ix = Math.round(x + w / 2 - 3), iy = Math.round(y + h / 2 - 3);
      g.fillStyle = '#100c20'; g.fillRect(ix - 1, iy - 1, 7, 7);
      g.fillStyle = door.color;
      door.icon.forEach((row, ry) => { for (let rx = 0; rx < 5; rx++) if (row[rx] === '#') g.fillRect(ix + rx, iy + ry, 1, 1); });
    }
  }
}
