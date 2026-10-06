/**
 * Ataque del Oyente: "ondas" de sonido que salen de sus auriculares.
 * - Apuntar (flechas / stick derecho) también dispara si la opción "Disparar al apuntar" está activa.
 * - ATTACK dispara en la última dirección apuntada.
 */
export class PlayerCombat {
  constructor(world) { this.world = world; }

  update(player, dt) {
    const { input, settings } = this.world;
    player.fireCooldown -= dt;

    const aim = input.getAxis('AIM');
    if (aim.active) { player.aimX = aim.x; player.aimY = aim.y; }

    const wantsFire = input.isDown('ATTACK') || (settings.fireOnAim && aim.active);
    if (wantsFire && player.fireCooldown <= 0 && !player.isDashing) {
      this.fire(player);
      player.fireCooldown = 1 / player.stats.get('fireRate');
    }
  }

  fire(player) {
    const { projectiles, game, effects } = this.world;
    const st = player.stats;
    const speed = st.get('shotSpeed');
    const dx = player.aimX, dy = player.aimY;
    // Hereda un poco de la velocidad del jugador: se siente más natural al moverse.
    const vx = dx * speed + player.vx * 0.25;
    const vy = dy * speed + player.vy * 0.25;
    const x = player.x + dx * 6, y = player.y - 1 + dy * 4;
    projectiles.spawn({
      team: 'player', x, y, z: 9, vx, vy,
      radius: Math.round(st.get('shotSize')),
      damage: st.get('damage'),
      knockback: st.get('knockback'),
      range: st.get('range'),
      color: '#fff6d6', trail: '#eb2f2d',
    });
    player.lastShotTime = this.world.time;
    effects.burst(x, y - 9, 2, '#fff6d6', 30, 0.15);
    game.audio.play('shoot', { pitch: 0.95 + Math.random() * 0.1 });
    game.events.emit('player:shot');
  }
}
