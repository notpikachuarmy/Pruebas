let nextUid = 1;

const SPAWN_TIME = 0.7; // tiempo de "materialización": inofensivo e invulnerable (aviso justo)

/** Instancia de enemigo. Sus datos vienen de data/enemies/*.js y su IA de un comportamiento. */
export class Enemy {
  constructor(def, behavior, x, y) {
    this.uid = nextUid++;
    this.def = def;
    this.behavior = behavior;
    this.x = x; this.y = y;
    this.r = def.radius;
    this.vx = 0; this.vy = 0;
    this.kx = 0; this.ky = 0;
    this.hp = def.hp;
    this.dead = false;
    this.flash = 0;
    this.spawnTimer = SPAWN_TIME;
    this.facing = 1;
    this.animTime = Math.random() * 10;
    this.state = 'idle';
    this.stateTime = 0;
    this.data = {};       // memoria privada del comportamiento
    this.haste = 0;       // tiempo restante de prisa (Reloj de Pared)
    this.marked = 0;      // tiempo restante de marca (Post-it)
    this.stun = 0;        // aturdido (Triángulo): no actúa
    this.maxHp = def.hp;
    behavior.init?.(this);
  }

  get spawning() { return this.spawnTimer > 0; }
  canBeHit() { return !this.dead && !this.spawning && (this.behavior.canBeHit?.(this) ?? true); }
  canHurt() { return !this.dead && !this.spawning && (this.behavior.canHurt?.(this) ?? true); }

  setState(state) { this.state = state; this.stateTime = 0; }
}

export { SPAWN_TIME };
