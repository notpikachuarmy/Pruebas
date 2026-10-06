/** Convierte los iconos de texto (8×8) de data/items en canvas reutilizables. */
const PALETTE = {
  k: '#191817', w: '#fff6d6', r: '#eb2f2d', y: '#ffd65c', b: '#4a749c', d: '#25307a', g: '#9aa3b5',
  c: '#8fd3ff', l: '#c9bde6', p: '#e896a0', n: '#8a5a34', o: '#ff9a3c', G: '#7fd6a0',
};

const cache = new Map();

export function itemIcon(item) {
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
