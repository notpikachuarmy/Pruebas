import { approach } from '../core/math.js';

const ACCEL = 900;       // px/s²: respuesta rápida pero no instantánea
const FRICTION = 1100;

/** Movimiento y Silencio (dash). Solo lee acciones abstractas del Input. */
export class PlayerController {
  constructor(world) { this.world = world; }

  update(player, dt) {
    const { input, game, room, effects } = this.world;
    const st = player.stats;
    player.animTime += dt;
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    player.flash = Math.max(0, player.flash - dt);
    // Recarga de Silencios: una carga cada `dashCooldown` segundos
    const maxCharges = Math.round(st.get('dashCharges'));
    if (player.dashCharges > maxCharges) player.dashCharges = maxCharges;
    if (player.dashCharges < maxCharges && !player.isDashing) {
      player.dashRecharge += dt;
      if (player.dashRecharge >= st.get('dashCooldown')) { player.dashRecharge = 0; player.dashCharges++; }
    } else if (player.dashCharges >= maxCharges) player.dashRecharge = 0;

    const move = input.getAxis('MOVE');

    // --- Silencio: esquiva corta con invulnerabilidad ---
    if (input.isPressed('DASH') && player.dashCharges >= 1 && !player.isDashing) {
      player.dashCharges--;
      let dx = move.x, dy = move.y;
      if (move.mag === 0) { dx = player.aimX; dy = player.aimY; }
      const l = Math.hypot(dx, dy) || 1;
      player.dashX = dx / l; player.dashY = dy / l;
      player.dashTime = st.get('dashDuration');
      player.invulnerable = Math.max(player.invulnerable, player.dashTime + 0.04);
      game.audio.play('dash');
      game.haptics.play('shoot');
      effects.burst(player.x, player.y - 2, 6, '#c9bde6', 40, 0.3);
      this.world.items.onDash();
    }

    if (player.isDashing) {
      player.dashTime -= dt;
      const sp = st.get('dashSpeed');
      player.vx = player.dashX * sp;
      player.vy = player.dashY * sp;
      player.ghostTimer -= dt;
      if (player.ghostTimer <= 0) {
        player.ghostTimer = 0.035;
        effects.afterimage(player.x, player.y, player.facing < 0, 'walk', player.animTime);
      }
      if (player.dashTime <= 0) { player.vx *= 0.35; player.vy *= 0.35; }
    } else {
      const speed = st.get('speed') * player.slowFactor;
      const tx = move.x * speed, ty = move.y * speed;
      const rate = (move.mag > 0 ? ACCEL : FRICTION) * dt;
      player.vx = approach(player.vx, tx, rate);
      player.vy = approach(player.vy, ty, rate);
    }

    // Retroceso (decae rápido)
    player.kx = approach(player.kx, 0, 900 * dt);
    player.ky = approach(player.ky, 0, 900 * dt);

    room.move(player, (player.vx + player.kx) * dt, (player.vy + player.ky) * dt);

    player.moving = Math.abs(player.vx) + Math.abs(player.vy) > 8;
    // Mira hacia donde dispara si ha disparado hace poco; si no, hacia donde camina.
    const recentlyShot = this.world.time - player.lastShotTime < 0.4;
    if (recentlyShot) { if (Math.abs(player.aimX) > 0.2) player.facing = Math.sign(player.aimX); }
    else if (Math.abs(player.vx) > 5) player.facing = Math.sign(player.vx);

    player.slowFactor = 1; // los charcos lo volverán a reducir este paso si sigue dentro
  }
}
