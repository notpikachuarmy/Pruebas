import { TILE, ROOM_OFFSET_X, ROOM_OFFSET_Y } from '../core/config.js';
import { Room, DOOR_ENTRY } from '../rooms/Room.js';
import { DIRS, neighborOf } from '../rooms/FloorGenerator.js';
import { ROOM_TYPES } from '../rooms/roomTypes/index.js';
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
import { Interactables } from './Interactables.js';

const SECRET_HITS = 5;               // impactos para abrir una pared secreta
const FADE_OUT = 0.14, FADE_IN = 0.2; // transición entre salas

/**
 * El mundo jugable de una run: el jugador persiste, la sala cambia (enterNode).
 * Los sistemas usan pools que se vacían al cambiar de sala.
 */
export class World {
  constructor(game, run) {
    this.game = game;
    this.run = run;
    this.input = game.input;
    this.settings = game.save.data.settings;
    this.time = 0;

    this.player = new Player(0, 0);
    this.controller = new PlayerController(this);
    this.combat = new PlayerCombat(this);
    this.effects = new Effects(this);
    this.hazards = new Hazards(this);
    this.pickups = new Pickups(this);
    this.projectiles = new Projectiles(this);
    this.enemies = new EnemyManager(this);
    this.damage = new DamageSystem(this);
    this.interactables = new Interactables(this);

    this.node = null;
    this.room = null;
    this.encounter = null;
    this.rooms = new Map();          // caché de salas ya construidas (pre-renderizado incluido)
    this.transition = null;
    this._shake = 0; this._shakeTime = 0;
    this._hitstop = 0;
    this._drawList = [];
    this.onDeath = null;             // callbacks de GameScene
    this.onExit = null;
  }

  get cleared() { return this.node?.state.cleared ?? false; }

  // ---------- Cambio de sala ----------

  /** Entra en una sala. `fromDir` = dirección en la que se movía el jugador al cruzar la puerta. */
  enterNode(node, fromDir = null) {
    if (this.node) this.node.state.pickups = this.pickups.serialize();
    this.projectiles.clear(); this.effects.clear(); this.hazards.clear();
    this.enemies.clear(); this.pickups.clear();
    this.encounter = null;

    const first = !node.state.visited;
    node.state.visited = true;
    this.node = node;
    this.room = this._roomFor(node);
    this.rngSpawn = this.run.rng.fork(`spawn:${node.key}`);
    this.rngLoot = this.run.rng.fork(`loot:${node.key}:${node.state.lootRolls = (node.state.lootRolls ?? 0) + 1}`);

    // Jugador junto a la puerta por la que entra
    const p = this.player;
    if (fromDir) {
      const entry = DOOR_ENTRY[DIRS[fromDir].opposite];
      p.x = entry.x; p.y = entry.y;
    } else {
      p.x = this.room.playerSpawn.x; p.y = this.room.playerSpawn.y;
    }
    p.vx *= 0.3; p.vy *= 0.3; p.kx = 0; p.ky = 0; p.dashTime = 0;

    node.state.interactables ??= [];
    this.interactables.bind(node.state.interactables);
    this.pickups.restore(node.state.pickups);
    node.state.pickups = [];

    // Si se entra desde una sala secreta por una pared falsa, esa pared queda descubierta
    if (fromDir) {
      const back = DIRS[fromDir].opposite;
      if (node.doors[back] === 'secret') (node.state.revealed ??= {})[back] = true;
    }
    this._configureDoors(node);
    ROOM_TYPES[node.type].onEnter(this, node, first);
    this.room.setAllDoors(!this.encounter);
    this.game.events.emit('room:enter', { node, first });
  }

  _roomFor(node) {
    let room = this.rooms.get(node.key);
    if (!room) {
      const def = this.game.content.rooms[node.templateId];
      const tileset = this.game.content.assets.tilesets[this.run.dream.tileset];
      room = new Room(def, tileset, this.game.assets.image(tileset.image));
      this.rooms.set(node.key, room);
    }
    return room;
  }

  _configureDoors(node) {
    const spec = {};
    for (const [dir, kind] of Object.entries(node.doors)) {
      const other = neighborOf(this.run.floor, node, dir);
      const typeKind = ROOM_TYPES[other.type].doorKind ?? ROOM_TYPES[node.type].doorKind;
      const isSecret = kind === 'secret';
      const revealed = !isSecret || !!node.state.revealed?.[dir];
      spec[dir] = {
        kind: isSecret ? 'secret' : (typeKind ?? 'normal'),
        open: revealed,
        revealed,
        hits: node.state.secretHits[dir] ?? 0,
      };
    }
    this.room.setDoors(spec);
  }

  startEncounter(def) {
    this.encounter = new Encounter(this, def);
  }

  onEncounterCleared() {
    const node = this.node;
    node.state.cleared = true;
    this.room.setAllDoors(true);
    ROOM_TYPES[node.type].onClear?.(this, node);
    this.game.audio.play('cleared');
    this.game.haptics.play('event');
    this.game.events.emit('room:cleared', { node });
  }

  /** Un disparo del jugador golpea una pared: ¿era una pared secreta? */
  onWallShot(x, y) {
    const c = Math.floor(x / TILE), r = Math.floor(y / TILE);
    const dir = this.room.doorAtCell(c, r) ?? this.room.doorAtCell(c, r + 1) ?? this.room.doorAtCell(c, r - 1);
    const door = dir && this.room.doors[dir];
    if (!door || door.kind !== 'secret' || door.revealed) return;
    const st = this.node.state;
    st.secretHits[dir] = (st.secretHits[dir] ?? 0) + 1;
    door.hits = st.secretHits[dir];
    this.effects.burst(x, y, 6, '#c9bde6', 50, 0.4);
    this.shake(1, 0.06);
    if (door.hits >= SECRET_HITS) this._revealSecret(dir);
  }

  _revealSecret(dir) {
    const st = this.node.state;
    (st.revealed ??= {})[dir] = true;
    const door = this.room.doors[dir];
    door.revealed = true;
    this.room.setDoorOpen(dir, true);
    const other = neighborOf(this.run.floor, this.node, dir);
    other.state.discovered = true;
    this.effects.burst(this.player.x, this.player.y - 10, 24, '#b36bd6', 90, 0.7, 2);
    this.game.audio.play('cleared', { pitch: 1.5 });
    this.game.haptics.play('event');
    this.game.toasts.show('Has encontrado un rincón escondido del sueño');
  }

  // ---------- Simulación ----------

  update(dt) {
    if (this.transition) { this._updateTransition(dt); this.effects.update(dt); return; }
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
    this.interactables.update(dt);
    this.effects.update(dt);

    if (p.alive) {
      const dir = this.room.exitDirection(p.x, p.y);
      if (dir) this.transition = { dir, t: 0, swapped: false };
    }
  }

  _updateTransition(dt) {
    const tr = this.transition;
    tr.t += dt;
    if (!tr.swapped && tr.t >= FADE_OUT) {
      tr.swapped = true;
      this.enterNode(neighborOf(this.run.floor, this.node, tr.dir), tr.dir);
    }
    if (tr.t >= FADE_OUT + FADE_IN) this.transition = null;
  }

  /** Opacidad del fundido entre salas (0 = nada). */
  get fade() {
    const tr = this.transition;
    if (!tr) return 0;
    return tr.t < FADE_OUT ? tr.t / FADE_OUT : 1 - (tr.t - FADE_OUT) / FADE_IN;
  }

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
    this.pickups.render(g);

    // Orden de profundidad: lo que está más abajo se dibuja encima
    const list = this._drawList;
    list.length = 0;
    this.enemies.collectDrawables(list);
    this.interactables.collectDrawables(list);
    list.push(this.player);
    list.sort((a, b) => a.y - b.y);
    const playerSprite = this.game.assets.sprite('player');
    this.effects.renderGhosts(g, playerSprite);
    for (const obj of list) {
      if (obj === this.player) this._renderPlayer(g, playerSprite);
      else if (obj.kind) this.interactables.draw(g, obj);
      else this.enemies.draw(g, obj);
    }

    this.projectiles.render(g);
    this.effects.render(g);
    if (this.game.debug) this._renderDebug(g);
    g.restore();
  }

  /** Textos que van sobre la sala (precios, avisos, pistas). */
  renderUI(r) {
    ROOM_TYPES[this.node.type].renderUI?.(r, this, ROOM_OFFSET_X, ROOM_OFFSET_Y);
    if (!this.run.result) this.interactables.renderUI(r, ROOM_OFFSET_X, ROOM_OFFSET_Y);
  }

  _renderPlayer(g, sprite) {
    const p = this.player;
    if (!p.alive) {
      const k = Math.min(1, p.deathTime / 1.2);
      sprite.draw(g, 'idle', 0, p.x, p.y - k * 10, { flip: p.facing < 0, flash: true, alpha: 1 - k });
      return;
    }
    g.fillStyle = 'rgba(20,14,40,0.3)';
    g.fillRect(Math.round(p.x) - 5, Math.round(p.y) - 1, 10, 2);
    if (p.invulnerable > 0 && !p.isDashing && Math.floor(p.invulnerable * 20) % 2 === 0) return;
    const anim = p.moving ? 'walk' : 'idle';
    sprite.draw(g, anim, p.animTime, p.x, p.y, { flip: p.facing < 0, flash: p.flash > 0, alpha: p.isDashing ? 0.6 : 1 });
    g.fillStyle = '#fff6d6';
    g.globalAlpha = 0.7;
    g.fillRect(Math.round(p.x + p.aimX * 13) - 1, Math.round(p.y - 9 + p.aimY * 11) - 1, 2, 2);
    g.globalAlpha = 1;
  }

  _renderDebug(g) {
    g.strokeStyle = '#00ff88'; g.lineWidth = 1;
    const box = (e) => g.strokeRect(e.x - e.r + 0.5, e.y - e.r + 0.5, e.r * 2 - 1, e.r - 1);
    box(this.player);
    for (const e of this.enemies.list) box(e);
  }
}
