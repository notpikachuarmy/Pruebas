/**
 * Iconos de objetos.
 * 1) Si existe assets/items/<id>.png, se usa esa imagen (la carga Game al arrancar).
 * 2) Si no, se genera a partir del icono de texto 8×8 del archivo de datos del objeto.
 */
const PALETTE = {
  k: '#191817', w: '#fff6d6', r: '#eb2f2d', y: '#ffd65c', b: '#4a749c', d: '#25307a', g: '#9aa3b5',
  c: '#8fd3ff', l: '#c9bde6', p: '#e896a0', n: '#8a5a34', o: '#ff9a3c', G: '#7fd6a0',
};

const cache = new Map();
const images = new Map();

/** Registra una imagen PNG para un objeto (sustituye al icono de texto). */
export function setItemImage(id, img) { images.set(id, img); }

/** Intenta cargar assets/items/<id>.png para cada objeto. Las que no existan se ignoran sin error. */
export async function loadItemImages(items) {
  await Promise.all(items.map((it) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { setItemImage(it.id, img); resolve(); };
    img.onerror = () => resolve();
    img.src = `assets/items/${it.id}.png`;
  })));
}

export function itemIcon(item) {
  const png = images.get(item.id);
  if (png) return png;
  let c = cache.get(item.id);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = 8; c.height = 8;
  const g = c.getContext('2d');
  item.icon.forEach((row, y) => {
    for (let x = 0; x < 8; x++) {
      const col = PALETTE[row[x]];
      if (col) { g.fillStyle = col; g.fillRect(x, y, 1, 1); }
    }
  });
  cache.set(item.id, c);
  return c;
}

export const RARITY_COLOR = { común: '#c9bde6', rara: '#8fd3ff', legendaria: '#ffd65c' };
