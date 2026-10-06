// Utilidades compartidas por los comportamientos de enemigos.

export function toPlayer(e, world) {
  const dx = world.player.x - e.x, dy = world.player.y - e.y;
  const dist = Math.hypot(dx, dy) || 1;
  return { dx, dy, dist, nx: dx / dist, ny: dy / dist, angle: Math.atan2(dy, dx) };
}

/** Dispara un proyectil enemigo con ángulo y opciones (ver Projectiles.spawn). */
export function shoot(world, e, angle, { speed = 90, range = 200, radius = 3, damage = 1, z = 8, color = '#25307a', trail = '#c9bde6', ...rest } = {}) {
  return world.projectiles.spawn({
    team: 'enemy', x: e.x, y: e.y - 2, z, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
    range, radius, damage, color, trail, source: e.def.id, ...rest,
  });
}

/** ¿Está el jugador apuntando hacia este enemigo? (coseno del ángulo > umbral) */
export function playerAimsAt(e, world, threshold = 0.94) {
  const p = world.player;
  const dx = e.x - p.x, dy = e.y - p.y;
  const d = Math.hypot(dx, dy) || 1;
  return (dx / d) * p.aimX + (dy / d) * p.aimY > threshold;
}

/** Se mueve hacia (tx, ty) a la velocidad dada (fija vx, vy). */
export function steer(e, tx, ty, speed) {
  const dx = tx - e.x, dy = ty - e.y;
  const d = Math.hypot(dx, dy);
  if (d < 1) { e.vx = 0; e.vy = 0; return d; }
  e.vx = (dx / d) * Math.min(speed, d * 8);
  e.vy = (dy / d) * Math.min(speed, d * 8);
  return d;
}

export function nearestAlly(e, world, filter = () => true) {
  let best = null, bd = Infinity;
  for (const o of world.enemies.list) {
    if (o === e || o.dead || !filter(o)) continue;
    const d = (o.x - e.x) ** 2 + (o.y - e.y) ** 2;
    if (d < bd) { bd = d; best = o; }
  }
  return best;
}
