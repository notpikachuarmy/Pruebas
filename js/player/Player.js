import { PlayerStats } from './PlayerStats.js';

/** Estado del protagonista. La lógica vive en PlayerController y PlayerCombat. */
export class Player {
  constructor(x, y) {
    this.stats = new PlayerStats();
    this.x = x; this.y = y;          // posición de los pies
    this.r = 4;                      // media anchura de la caja de pies
    this.bodyRadius = 5;
    this.bodyHeight = 10;
    this.vx = 0; this.vy = 0;
    this.kx = 0; this.ky = 0;        // retroceso por golpes

    this.hp = this.stats.get('maxHp');
    this.alive = true;
    this.deathTime = 0;

    this.aimX = 1; this.aimY = 0;    // última dirección de apuntado
    this.facing = 1;                 // 1 derecha, -1 izquierda
    this.lastShotTime = -10;

    this.invulnerable = 0;
    this.flash = 0;
    this.fireCooldown = 0;

    this.dashTime = 0;
    this.dashCooldown = 0;
    this.dashX = 0; this.dashY = 0;
    this.ghostTimer = 0;

    this.slowFactor = 1;             // lo reducen los charcos de tinta
    this.moving = false;
    this.animTime = 0;
  }

  get isDashing() { return this.dashTime > 0; }
}
