import { TILE } from '../core/config.js';

const SOLID = 1;

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

    this.cache = this._prerender();
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

  render(g) { g.drawImage(this.cache, 0, 0); }
}
