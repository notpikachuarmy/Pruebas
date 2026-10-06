import { TILE } from '../core/config.js';
import { Room } from '../rooms/Room.js';
import { Player } from '../player/Player.js';
import { PlayerController } from '../player/PlayerController.js';
import { PlayerCombat } from '../player/PlayerCombat.js';
import { EnemyManager } from '../enemies/EnemyManager.js';
import { Projectiles } from '../combat/Projectiles.js';
import { Effects } from '../combat/Effects.js';
import { Hazards } from '../combat/Hazards.js';
import { Pickups } from '../combat/Pickups.js';
import { DamageSystem } from '../combat/DamageSystem.js';
import { Encounter } from './Encounter.js';

const ROOM_OFFSET_X = 16;
const ROOM_OFFSET_Y = 24;

/**
 * Todo lo que existe dentro de la sala actual: jugador, enemigos, proyectiles...
 * GameScene crea un World por sala (en Fase 3 lo hará RoomManager).
 */
export class World {
  constructor(game, run, roomId) {
    this.game = game;
    this.run = run;
    this.input = game.input;
    this.settings = game.save.data.settings;
    this.time = 0;

    const dream = run.dream;
    const roomDef = game.content.rooms[roomId];
    const tileset = game.content.assets.tilesets[dream.tileset];
    this.room = new Room(roomDef, tileset, game.assets.image(tileset.image));

    this.rngSpawn = run.rng.fork(`spawn:${roomId}`);
    this.rngLoot = run.rng.fork(`loot:${roomId}`);

    this.player = new Player(this.room.playerSpawn.x, this.room.playerSpawn.y);
    this.controller = new PlayerController(this);
    this.combat = new PlayerCombat(this);
    this.effects = new Effects(this);
    this.hazards = new Hazards(this);
    this.pickups = new Pickups(this);
    this.projectiles = new Projectiles(this);
    this.enemies = new EnemyManager(this);
    this.damage = new DamageSystem(this);
    this.encounter = roomDef.encounter ? new Encounter(this, dream.encounters[roomDef.encounter]) : null;

    this.exit = null;            // punto de salida cuando la sala queda limpia
    this.cleared = !this.encounter;
    this._shake = 0; this._shakeTime = 0;
    this._hitstop = 0;
    this._drawList = [];
    this.onDeath = null;         // callbacks asignados por GameScene
    this.onCleared = null;
  }

  // ---------- Simulación ----------

  update(dt) {
    if (this._hitstop > 0) { this._hitstop -= dt; return; }
    this.time += dt;
    this._shakeTime = Math.max(0, this._shakeTime - dt);

    const p = this.player;
    if (p.alive) {
      this.controller.update(p, dt);
      this.combat.update(p, dt);
    } else {
      p.deathTime += dt;
    }
    this.encounter?.update(dt);
    this.enemies.update(dt);
    this.projectiles.update(dt);
    this.hazards.update(dt);
    this.pickups.update(dt);
    this.effects.update(dt);
  }

  // ---------- Eventos de juego ----------

  onPlayerDeath() {
    const p = this.player;
    p.alive = false;
    p.deathTime = 0;
    this.effects.burst(p.x, p.y - 10, 30, '#eb2f2d', 120, 0.9, 2);
    this.effects.burst(p.x, p.y - 10, 20, '#c9bde6', 80, 1.2);
    this.game.audio.play('death');
    this.game.haptics.play('death');
    this.hitstop(0.25);
    this.shake(6, 0.4);
    this.onDeath?.();
  }

  onEncounterCleared() {
    this.cleared = true;
    const c = Math.floor(this.room.cols / 2);
    const r = Math.floor(this.room.rows / 2);
    this.exit = { x: c * TILE + TILE / 2, y: r * TILE + TILE / 2, t: 0 };
    this.effects.burst(this.exit.x, this.exit.y - 6, 30, '#ffd65c', 90, 0.8, 2);
    this.game.audio.play('cleared');
    this.game.haptics.play('event');
    this.onCleared?.();
  }

  /** ¿Está el jugador sobre la salida? */
  playerAtExit() {
    if (!this.exit || !this.player.alive) return false;
    return Math.hypot(this.player.x - this.exit.x, this.player.y - this.exit.y) < 14;
  }

  shake(amount, time) {
    if (!this.settings.screenShake) return;
    this._shake = Math.max(this._shakeTime > 0 ? this._shake : 0, amount);
    this._shakeTime = Math.max(this._shakeTime, time);
  }

  hitstop(time) { this._hitstop = Math.max(this._hitstop, time); }

  // ---------- Dibujo ----------

  render(g) {
    let sx = 0, sy = 0;
    if (this._shakeTime > 0) {
      sx = Math.round((Math.random() * 2 - 1) * this._shake);
      sy = Math.round((Math.random() * 2 - 1) * this._shake);
    }
    g.save();
    g.translate(ROOM_OFFSET_X + sx, ROOM_OFFSET_Y + sy);
    this.room.render(g);
    this.hazards.render(g);
    this._renderExit(g);
    this.pickups.render(g);

    // Orden de profundidad: lo que está más abajo se dibuja encima
    const list = this._drawList;
    list.length = 0;
    this.enemies.collectDrawables(list);
    list.push(this.player);
    list.sort((a, b) => a.y - b.y);
    const playerSprite = this.game.assets.sprite('player');
    this.effects.renderGhosts(g, playerSprite);
    for (const obj of list) {
      if (obj === this.player) this._renderPlayer(g, playerSprite);
      else this.enemies.draw(g, obj);
    }

    this.projectiles.render(g);
    this.effects.render(g);
    if (this.game.debug) this._renderDebug(g);
    g.restore();
  }

  _renderPlayer(g, sprite) {
    const p = this.player;
    if (!p.alive) {
      // Se desvanece "despertándose": sube y se vuelve transparente
      const k = Math.min(1, p.deathTime / 1.2);
      sprite.draw(g, 'idle', 0, p.x, p.y - k * 10, { flip: p.facing < 0, flash: true, alpha: 1 - k });
      return;
    }
    g.fillStyle = 'rgba(20,14,40,0.3)';
    g.fillRect(Math.round(p.x) - 5, Math.round(p.y) - 1, 10, 2);
    // Parpadeo durante la invulnerabilidad tras un golpe
    if (p.invulnerable > 0 && !p.isDashing && Math.floor(p.invulnerable * 20) % 2 === 0) return;
    const anim = p.moving ? 'walk' : 'idle';
    sprite.draw(g, anim, p.animTime, p.x, p.y, { flip: p.facing < 0, flash: p.flash > 0, alpha: p.isDashing ? 0.6 : 1 });
    // Indicador de apuntado: un punto a la altura de los auriculares
    g.fillStyle = '#fff6d6';
    g.globalAlpha = 0.7;
    g.fillRect(Math.round(p.x + p.aimX * 13) - 1, Math.round(p.y - 9 + p.aimY * 11) - 1, 2, 2);
    g.globalAlpha = 1;
  }

  _renderExit(g) {
    const e = this.exit;
    if (!e) return;
    e.t += 1 / 60;
    // Despertador que suena: salir del sueño
    const ring = Math.sin(e.t * 30) > 0 ? 1 : 0;
    const x = Math.round(e.x), y = Math.round(e.y);
    g.fillStyle = 'rgba(255,214,92,0.18)';
    const pr = 10 + Math.sin(e.t * 4) * 2;
    g.beginPath(); g.ellipse(x, y, pr, pr * 0.55, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#d6403a'; g.fillRect(x - 5 + ring, y - 14, 10, 9);
    g.fillStyle = '#fff6d6'; g.fillRect(x - 3 + ring, y - 12, 6, 5);
    g.fillStyle = '#17122b'; g.fillRect(x + ring, y - 11, 1, 3); g.fillRect(x + ring, y - 9, 2, 1);
    g.fillStyle = '#ffd65c'; g.fillRect(x - 6 + ring, y - 16, 3, 2); g.fillRect(x + 3 + ring, y - 16, 3, 2);
    g.fillStyle = '#17122b'; g.fillRect(x - 4, y - 5, 2, 2); g.fillRect(x + 2, y - 5, 2, 2);
  }

  _renderDebug(g) {
    g.strokeStyle = '#00ff88'; g.lineWidth = 1;
    const box = (e) => g.strokeRect(e.x - e.r + 0.5, e.y - e.r + 0.5, e.r * 2 - 1, e.r - 1);
    box(this.player);
    for (const e of this.enemies.list) box(e);
  }
}

export { ROOM_OFFSET_X, ROOM_OFFSET_Y };
