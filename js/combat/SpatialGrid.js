/**
 * Rejilla espacial uniforme para consultas "¿qué hay cerca de aquí?".
 * Se reconstruye cada paso: barato con decenas de enemigos y evita comprobar todos contra todos.
 */
export class SpatialGrid {
  constructor(width, height, cell = 32) {
    this.cell = cell;
    this.cols = Math.ceil(width / cell) + 1;
    this.rows = Math.ceil(height / cell) + 1;
    this.buckets = Array.from({ length: this.cols * this.rows }, () => []);
    this.result = [];
  }

  clear() { for (const b of this.buckets) b.length = 0; }

  insert(obj, x, y) {
    const c = Math.min(this.cols - 1, Math.max(0, Math.floor(x / this.cell)));
    const r = Math.min(this.rows - 1, Math.max(0, Math.floor(y / this.cell)));
    this.buckets[r * this.cols + c].push(obj);
  }

  /** Devuelve un array reutilizado (no guardarlo entre llamadas). */
  query(x, y, radius) {
    const out = this.result;
    out.length = 0;
    const c0 = Math.max(0, Math.floor((x - radius) / this.cell)), c1 = Math.min(this.cols - 1, Math.floor((x + radius) / this.cell));
    const r0 = Math.max(0, Math.floor((y - radius) / this.cell)), r1 = Math.min(this.rows - 1, Math.floor((y + radius) / this.cell));
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
      const b = this.buckets[r * this.cols + c];
      for (let i = 0; i < b.length; i++) out.push(b[i]);
    }
    return out;
  }
}
