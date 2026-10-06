// RNG con semilla: la misma semilla produce la misma run (útil para depurar y compartir runs).

function hashString(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}

export class Random {
  constructor(seed = Date.now().toString(36)) {
    this.seed = String(seed);
    this.state = hashString(this.seed);
  }

  /** Float en [0,1). mulberry32. */
  next() {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(min, max) { return min + this.next() * (max - min); }
  int(min, max) { return Math.floor(this.range(min, max + 1)); }
  chance(p) { return this.next() < p; }
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  sign() { return this.next() < 0.5 ? -1 : 1; }

  /** Elige de una lista [{weight, ...}] respetando los pesos. */
  weighted(list, key = 'weight') {
    let total = 0;
    for (const e of list) total += e[key] ?? 1;
    let r = this.next() * total;
    for (const e of list) { r -= e[key] ?? 1; if (r <= 0) return e; }
    return list[list.length - 1];
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /** RNG hijo independiente: así generar enemigos no altera la generación del mapa. */
  fork(label) { return new Random(`${this.seed}:${label}`); }
}

export function randomSeed() {
  return Math.floor(Math.random() * 36 ** 6).toString(36).toUpperCase().padStart(6, '0');
}
