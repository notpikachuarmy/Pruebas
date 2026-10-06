/**
 * Único punto donde se aplica daño. Centralizarlo permite que objetos y sinergias
 * (Fase 5) modifiquen el daño sin tocar enemigos ni proyectiles.
 */
export class DamageSystem {
  constructor(world) { this.world = world; }

  hitEnemy(enemy, amount, dirX, dirY, knockback) {
    const { game, effects } = this.world;
    amount *= enemy.behavior.damageMult?.(enemy) ?? 1;
    enemy.hp -= amount;
    enemy.flash = 0.08;
    const l = Math.hypot(dirX, dirY) || 1;
    const kb = enemy.def.mass >= 50 ? 0 : knockback / (enemy.def.mass ?? 1);
    enemy.kx += (dirX / l) * kb;
    enemy.ky += (dirY / l) * kb;
    game.events.emit('player:hitEnemy', { enemy, amount });
    game.audio.play('hitEnemy', { pitch: 0.9 + Math.random() * 0.2 });
    if (enemy.hp <= 0) this.killEnemy(enemy);
    else effects.burst(enemy.x, enemy.y - enemy.def.bodyHeight, 3, '#3d4ca8', 40, 0.3);
  }

  killEnemy(enemy) {
    const { game, effects, pickups } = this.world;
    if (enemy.dead) return;
    enemy.dead = true;
    enemy.behavior.onDeath?.(enemy, this.world);
    if (enemy.def.boss) {
      this.world.boss = null;
      effects.burst(enemy.x, enemy.y - 20, 50, '#d6403a', 140, 1, 2);
      this.world.hitstop(0.35);
      this.world.shake(7, 0.6);
      game.haptics.play('bossDown');
      game.events.emit('boss:defeated', { def: enemy.def });
    }
    effects.burst(enemy.x, enemy.y - enemy.def.bodyHeight, 14, '#25307a', 90, 0.5, 2);
    effects.burst(enemy.x, enemy.y - enemy.def.bodyHeight, 6, '#e8e6dc', 60, 0.35);
    pickups.dropFrom(enemy);
    game.audio.play('killEnemy');
    game.haptics.play('kill');
    this.world.shake(1.5, 0.08);
    game.events.emit('enemy:killed', { enemy, def: enemy.def });
  }

  /** Devuelve true si el golpe se aplicó (no estaba invulnerable). */
  hurtPlayer(amount, dirX = 0, dirY = 0) {
    const { player, game, effects } = this.world;
    if (!player.alive || player.invulnerable > 0 || player.isDashing) return false;
    player.hp = Math.max(0, player.hp - amount);
    player.invulnerable = player.stats.get('hurtInvulnerability');
    player.flash = 0.12;
    const l = Math.hypot(dirX, dirY);
    if (l > 0) { player.kx += (dirX / l) * 140; player.ky += (dirY / l) * 140; }
    effects.burst(player.x, player.y - 10, 10, '#eb2f2d', 80, 0.4, 2);
    game.audio.play('hurt');
    game.haptics.play('hurt');
    this.world.shake(4, 0.2);
    this.world.hitstop(0.07);
    game.events.emit('player:damaged', { amount });
    if (player.hp <= 0) this.world.onPlayerDeath();
    return true;
  }

  healPlayer(amount) {
    const p = this.world.player;
    const before = p.hp;
    p.hp = Math.min(p.stats.get('maxHp'), p.hp + amount);
    return p.hp > before;
  }
}
