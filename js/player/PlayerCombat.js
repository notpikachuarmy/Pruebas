import { ROOM_OFFSET_X, ROOM_OFFSET_Y } from '../core/config.js';

/**
 * Ataque del Oyente: "ondas" de sonido que salen de sus auriculares.
 * - Apuntar (flechas / stick derecho) también dispara si la opción "Disparar al apuntar" está activa.
 * - ATTACK dispara en la última dirección apuntada.
 * Cada disparo se describe como un objeto `shot` que los objetos pueden modificar (ItemManager.modifyShot).
 */
export class PlayerCombat {
  constructor(world) {
    this.world = world;
    this.spawnShot = this.spawnShot.bind(this);
  }

  update(player, dt) {
    const { input, settings, items } = this.world;
    player.fireCooldown -= dt;
    items.update(dt, this.spawnShot);

    const aim = input.getAxis('AIM');
    let mouseFire = false;
    if (aim.active) { player.aimX = aim.x; player.aimY = aim.y; }
    else if (input.mouseAimActive()) {
      // Ratón: apunta desde los auriculares hacia el cursor; clic izquierdo dispara
      const dx = input.mouse.x - (player.x + ROOM_OFFSET_X);
      const dy = input.mouse.y - (player.y - 9 + ROOM_OFFSET_Y);
      const l = Math.hypot(dx, dy);
      if (l > 4) { player.aimX = dx / l; player.aimY = dy / l; }
      mouseFire = input.mouse.down;
    }

    const wantsFire = input.isDown('ATTACK') || mouseFire || (settings.fireOnAim && aim.active);
    if (wantsFire && player.fireCooldown <= 0 && !player.isDashing) {
      this.fire(player);
      player.fireCooldown = 1 / player.stats.get('fireRate');
    }
  }

  fire(player) {
    const { game, effects, items } = this.world;
    const st = player.stats;
    const angle = Math.atan2(player.aimY, player.aimX);
    const shot = {
      x: player.x + player.aimX * 6, y: player.y - 1 + player.aimY * 4,
      angle,
      speed: st.get('shotSpeed'),
      // Hereda un poco de la velocidad del jugador: se siente más natural al moverse.
      inheritX: player.vx * 0.25, inheritY: player.vy * 0.25,
      radius: Math.round(st.get('shotSize')),
      damage: st.get('damage'),
      knockback: st.get('knockback'),
      range: st.get('range'),
      color: '#fff6d6', trailColor: '#eb2f2d',
      extras: null,
    };
    items.modifyShot(shot);
    this.spawnShot(shot);
    if (shot.extras) for (const ex of shot.extras) { ex.x = player.x; ex.y = player.y - 1; this.spawnShot(ex); }

    player.lastShotTime = this.world.time;
    effects.burst(shot.x, shot.y - 9, 2, '#fff6d6', 30, 0.15);
    game.audio.play('shoot', { pitch: 0.95 + Math.random() * 0.1 });
    game.events.emit('player:shot');
  }

  /** Crea el proyectil a partir de un `shot` (también lo usan los ecos programados). */
  spawnShot(shot) {
    const vx = Math.cos(shot.angle) * shot.speed + (shot.inheritX ?? 0);
    const vy = Math.sin(shot.angle) * shot.speed + (shot.inheritY ?? 0);
    this.world.projectiles.spawn({
      team: 'player', x: shot.x, y: shot.y, z: 9, vx, vy,
      radius: shot.radius, damage: shot.damage, knockback: shot.knockback, range: shot.range,
      pierce: shot.pierce, color: shot.color, trailColor: shot.trailColor,
      bounces: shot.bounces, bounceShrink: shot.bounceShrink, splitOnBounce: shot.splitOnBounce,
      waveAmp: shot.waveAmp, waveFreq: shot.waveFreq, wavePhase: shot.wavePhase,
      homing: shot.homing, homingRange: shot.homingRange, boomerang: shot.boomerang,
      hazardTrail: shot.hazardTrail, strong: shot.strong, isEcho: shot.isEcho,
    });
    if (shot.isEcho) this.world.game.audio.play('shoot', { pitch: 1.3, volume: 0.5 });
  }
}
