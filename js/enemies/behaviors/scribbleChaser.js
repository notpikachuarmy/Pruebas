/**
 * Perseguidor errático que prepara una embestida y deja tinta en el suelo.
 * Estados: chase → windup (aviso) → lunge (embestida) → recover → chase
 * Parámetros en def.params (ver data/enemies/tachon.js).
 */
export default {
  init(e) {
    e.data.phase = Math.random() * Math.PI * 2;
    e.data.inkTimer = 0;
    e.setState('chase');
  },

  update(e, world, dt) {
    const p = e.def.params;
    const { player, room, hazards, game } = world;
    const dx = player.x - e.x, dy = player.y - e.y;
    const dist = Math.hypot(dx, dy) || 1;

    switch (e.state) {
      case 'chase': {
        // Zigzag nervioso: la dirección oscila alrededor de la del jugador
        const base = Math.atan2(dy, dx);
        const ang = base + Math.sin(e.animTime * p.wobbleSpeed + e.data.phase) * p.wobble;
        const sp = player.alive ? e.def.speed : e.def.speed * 0.4;
        e.vx = Math.cos(ang) * sp;
        e.vy = Math.sin(ang) * sp;
        if (player.alive && dist < p.lungeRange && e.stateTime > 0.4 &&
            room.lineOfSight(e.x, e.y - 3, player.x, player.y - 3)) {
          e.setState('windup');
          e.data.dirX = dx / dist; e.data.dirY = dy / dist;
          game.audio.play('windup');
        }
        break;
      }
      case 'windup': {
        // Se encoge y tiembla: el jugador puede leer el ataque y esquivar
        e.vx = -e.data.dirX * 12; e.vy = -e.data.dirY * 12;
        if (e.stateTime >= p.windup) {
          // Reajusta un poco hacia el jugador (no del todo: esquivar lateralmente funciona)
          const ndx = dx / dist, ndy = dy / dist;
          e.data.dirX = e.data.dirX * 0.6 + ndx * 0.4;
          e.data.dirY = e.data.dirY * 0.6 + ndy * 0.4;
          const l = Math.hypot(e.data.dirX, e.data.dirY) || 1;
          e.data.dirX /= l; e.data.dirY /= l;
          e.setState('lunge');
        }
        break;
      }
      case 'lunge': {
        e.vx = e.data.dirX * p.lungeSpeed;
        e.vy = e.data.dirY * p.lungeSpeed;
        e.data.inkTimer -= dt;
        if (p.inkType !== null && e.data.inkTimer <= 0) {
          e.data.inkTimer = p.inkEvery;
          hazards.spawn(p.inkType ?? 'ink', e.x, e.y - 1, p.inkRadius, p.inkLife, e.def.id);
        }
        if (e.stateTime >= p.lungeTime) e.setState('recover');
        break;
      }
      case 'recover': {
        e.vx *= 0.85; e.vy *= 0.85;
        if (e.stateTime >= p.recover) e.setState('chase');
        break;
      }
    }
  },

  /** Choca con una pared durante la embestida → se aturde un momento. */
  onWall(e) { if (e.state === 'lunge') e.setState('recover'); },

  /** Desplazamiento visual (temblor durante el aviso). */
  visualOffset(e) {
    if (e.state !== 'windup') return 0;
    return Math.sin(e.stateTime * 60) > 0 ? 1 : -1;
  },

  squash(e) {
    if (e.state === 'windup') return 0.85;
    if (e.state === 'lunge') return 1.15;
    return 1;
  },
};
