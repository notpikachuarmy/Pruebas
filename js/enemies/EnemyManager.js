import { Enemy, SPAWN_TIME } from './Enemy.js';
import { BEHAVIORS } from './behaviors/index.js';
import { SpatialGrid } from '../combat/SpatialGrid.js';
import { approach } from '../core/math.js';
import { TILE, ROOM_COLS, ROOM_ROWS } from '../core/config.js';

/** Crea, actualiza, separa y dibuja enemigos. */
export class EnemyManager {
  constructor(world) {
    this.world = world;
    this.list = [];
    this.grid = new SpatialGrid(ROOM_COLS * TILE, ROOM_ROWS * TILE, 32);
  }

  spawn(id, x, y, { quiet = false } = {}) {
    const def = this.world.game.content.enemies[id];
    if (!def) { console.error(`[Enemies] No existe el enemigo "${id}"`); return null; }
    const behavior = BEHAVIORS[def.behavior];
    if (!behavior) { console.error(`[Enemies] "${id}" usa el comportamiento desconocido "${def.behavior}"`); return null; }
    const e = new Enemy(def, behavior, x, y);
    this.list.push(e);
    if (!quiet) this.world.effects.burst(x, y - 4, 10, '#25307a', 30, 0.6);
    if (def.boss) this.world.boss = e;
    this.world.game.events.emit('enemy:seen', { def });
    return e;
  }

  get aliveCount() { return this.list.length; }

  update(dt) {
    const { room, player, damage } = this.world;

    const frozen = this.world.freezeTime > 0;
    for (const e of this.list) {
      e.flash = Math.max(0, e.flash - dt);
      e.marked = Math.max(0, e.marked - dt);
      if (frozen && !e.spawning) continue;   // Cinta de Casete: tiempo enemigo detenido
      e.animTime += dt;
      e.haste = Math.max(0, e.haste - dt);
      if (e.spawning) { e.spawnTimer -= dt; continue; }
      e.stateTime += dt;
      e.behavior.update(e, this.world, dt);

      e.kx = approach(e.kx, 0, 600 * dt);
      e.ky = approach(e.ky, 0, 600 * dt);
      const sm = (e.haste > 0 ? 1.5 : 1) * this.world.mods.enemySpeed;
      const hit = room.move(e, (e.vx * sm + e.kx) * dt, (e.vy * sm + e.ky) * dt);
      if (hit) e.behavior.onWall?.(e, hit);
      if (Math.abs(e.vx) > 3) e.facing = Math.sign(e.vx);

      // Daño por contacto
      if (player.alive && e.canHurt()) {
        const rr = e.def.bodyRadius + player.bodyRadius - 2;
        const dx = player.x - e.x, dy = player.y - e.y;
        if (e.def.contactDamage && dx * dx + dy * dy < rr * rr) damage.hurtPlayer(e.def.contactDamage, dx, dy, e.def.id);
      }
    }

    this.list = this.list.filter((e) => !e.dead);
    this._rebuildGrid();
    this._separate(dt);
  }

  _rebuildGrid() {
    this.grid.clear();
    for (const e of this.list) this.grid.insert(e, e.x, e.y);
  }

  /** Empuje suave entre enemigos para que no se amontonen en un punto. */
  _separate(dt) {
    const room = this.world.room;
    for (const a of this.list) {
      const near = this.grid.query(a.x, a.y, 16);
      for (const b of near) {
        if (b === a) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const min = a.r + b.r + 2;
        const d2 = dx * dx + dy * dy;
        if (d2 > 0 && d2 < min * min) {
          const d = Math.sqrt(d2), push = ((min - d) / d) * 30 * dt;
          room.move(a, dx * push, dy * push);
        }
      }
    }
  }

  query(x, y, radius) { return this.grid.query(x, y, radius); }

  clear() { this.list.length = 0; this.grid.clear(); }

  /** Añade los enemigos a la lista de dibujo ordenada por profundidad. */
  collectDrawables(out) { for (const e of this.list) out.push(e); }

  draw(g, e) {
    const sprite = this.world.game.assets.sprite(e.def.sprite);
    const ox = e.behavior.visualOffset?.(e) ?? 0;
    if (e.spawning) {
      // Materialización: un charco que crece y el sprite aparece de abajo arriba
      const k = 1 - e.spawnTimer / SPAWN_TIME;
      g.fillStyle = '#25307a';
      g.globalAlpha = 0.6;
      g.beginPath(); g.ellipse(Math.round(e.x), Math.round(e.y - 1), 7 * k + 1, 4 * k + 1, 0, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 1;
      if (k > 0.5) sprite.draw(g, 'idle', e.animTime, e.x, e.y, { alpha: (k - 0.5) * 2, flip: e.facing < 0 });
      return;
    }
    g.fillStyle = 'rgba(20,14,40,0.3)';
    g.fillRect(Math.round(e.x) - 5, Math.round(e.y) - 1, 10, 2);
    const sq = e.behavior.squash?.(e) ?? 1;
    const sc = e.def.scale ?? 1;
    g.save();
    g.translate(Math.round(e.x + ox), Math.round(e.y - (e.behavior.lift?.(e) ?? 0)));
    g.scale(sc / sq, sc * sq);
    const anim = e.behavior.anim?.(e) ?? 'idle';
    sprite.draw(g, anim, e.animTime, 0, 0, { flip: e.def.noFlip ? false : e.facing < 0, flash: e.flash > 0, alpha: e.behavior.alpha?.(e) ?? 1 });
    g.restore();
    if (e.haste > 0) {
      g.fillStyle = '#ffd65c';
      g.fillRect(Math.round(e.x) + 5, Math.round(e.y) - 16 + Math.round(Math.sin(e.animTime * 20)), 2, 2);
    }
    e.behavior.renderExtra?.(g, e, this.world);
    // Guía de Pesadillas: barra de vida sobre cada enemigo (los jefes ya tienen la suya)
    if (!e.def.boss && this.world.items.hasEffect('healthBars') && e.hp < e.maxHp + 0.01) {
      const w = 12, top = Math.round(e.y) - Math.round(e.def.bodyHeight * 2 * (e.def.scale ?? 1)) - 6;
      g.fillStyle = '#100c20'; g.fillRect(Math.round(e.x) - w / 2 - 1, top - 1, w + 2, 3);
      g.fillStyle = '#7fd6a0'; g.fillRect(Math.round(e.x) - w / 2, top, Math.max(0, Math.round(w * e.hp / e.maxHp)), 1);
    }
    if (e.marked > 0) { g.fillStyle = '#ffd65c'; g.fillRect(Math.round(e.x) - 2, Math.round(e.y) - (e.def.bodyHeight * 2 + 10), 4, 4); }
    if (this.world.freezeTime > 0) { g.fillStyle = '#8fd3ff'; g.fillRect(Math.round(e.x) - 3, Math.round(e.y) - 3, 2, 4); g.fillRect(Math.round(e.x) + 1, Math.round(e.y) - 3, 2, 4); }
    if (e.state === 'windup' && !e.def.boss) {
      // Señal de aviso sobre la cabeza
      g.fillStyle = '#d6403a';
      g.fillRect(Math.round(e.x) - 1, Math.round(e.y) - 19, 2, 4);
      g.fillRect(Math.round(e.x) - 1, Math.round(e.y) - 14, 2, 1);
    }
  }
}
