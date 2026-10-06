export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const dist2 = (ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay; return dx * dx + dy * dy; };
export const len = (x, y) => Math.hypot(x, y);

/** Aproxima `v` a `target` sin pasarse. */
export function approach(v, target, step) {
  return v < target ? Math.min(v + step, target) : Math.max(v - step, target);
}

/** Normaliza (x,y) en `out` sin crear objetos. Devuelve la longitud original. */
export function normalizeInto(out, x, y) {
  const l = Math.hypot(x, y);
  if (l > 0) { out.x = x / l; out.y = y / l; } else { out.x = 0; out.y = 0; }
  return l;
}

export function circlesOverlap(ax, ay, ar, bx, by, br) {
  const r = ar + br;
  return dist2(ax, ay, bx, by) < r * r;
}
