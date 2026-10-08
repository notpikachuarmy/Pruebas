import { TILE, ROOM_OFFSET_X, ROOM_OFFSET_Y } from '../core/config.js';
import { Room, DOOR_ENTRY } from '../rooms/Room.js';
import { DIRS, neighborOf } from '../rooms/FloorGenerator.js';
import { ROOM_TYPES, DOOR_ICONS } from '../rooms/roomTypes/index.js';
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
import { PlayerHistory } from './PlayerHistory.js';
import { ItemManager } from '../items/ItemManager.js';
import { RULES } from '../dreams/rules.js';
import { Lighting } from '../dreams/lighting.js';

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
    this.items = new ItemManager(this);
    this.freezeTime = 0;                    // Cinta de Casete
    this.itemBanner = null;                 // { title, text, color, t }
    this.constructs = [];                   // Anillo Rosa: constructos cayendo

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

    this.lighting = new Lighting();
    this._applyDreamRules();

    this.playerHistory = new PlayerHistory(120);
    this._queuedBanners = [];
    this.arena = { margin: 0, target: 0 };  // el aula que se arruga (jefe, fase 3)
    this.boss = null;
    this.banner = null;                     // rótulo grande (fases del jefe)
    this.bossIntro = null;
    this.texts = [];                        // textos flotantes ("¡5 minutos!")
    this.examClock = null;
  }

  /** Modificadores y reglas del sueño actual. */
  _applyDreamRules() {
    // Modificadores que las reglas del sueño y los enemigos pueden tocar
    this.mods = { inkLife: 1, enemySpeed: 1, hideUnvisited: false, light: 0, lightMult: 1 };
    // Quita los modificadores de estadísticas que pusiera la regla de un sueño anterior
    const st = this.player.stats;
    st.modifiers = st.modifiers.filter((m) => !String(m.source).startsWith('rule:'));
    st.recalculate();
    this.rules = (this.run.dream.rules ?? []).map((id) => RULES[id]).filter(Boolean);
    for (const r of this.rules) r.apply?.(this);
  }

  /** Pasa al siguiente sueño de la noche: el jugador y sus objetos se conservan. */
  changeDream() {
    this.node = null;
    this.rooms.clear();
    this.examClock = null;
    this.game.audio.setTempo(1);
    this._applyDreamRules();
    this.items.onDreamStart();
    this.enterNode(this.run.floor.start);
    const p = this.player;
    p.invulnerable = 1;
  }

  // ---------- Avisos ----------

  toast(text) { this.game.toasts.show(text); }

  floatText(x, y, text) {
    if (this.texts.length > 8) this.texts.shift();
    this.texts.push({ x, y, text, t: 0 });
  }

  bossBanner(text) { this.banner = { text, t: 0 }; }

  setArena(margin) { this.arena.target = margin; }

  freezeEnemies(time) {
    if (time > this.freezeTime) this.game.audio.play('dash', { pitch: 0.5 });
    this.freezeTime = Math.max(this.freezeTime, time);
  }

  /** Anillo Rosa: un constructo cae sobre `enemy` tras un breve aviso. */
  spawnConstruct(kind, enemy) {
    if (this.constructs.length > 6) return;
    this.constructs.push({ kind, target: enemy, x: enemy.x, y: enemy.y, t: 0, delay: 0.35, done: false });
  }

  _updateConstructs(dt) {
    for (const c of this.constructs) {
      c.t += dt;
      if (!c.target.dead) { c.x = c.target.x; c.y = c.target.y; }
      if (c.t < c.delay || c.done) continue;
      c.done = true;
      const hit = { isConstruct: true };
      if (c.kind === 'corazon') {
        if (!c.target.dead) this.damage.hitEnemy(c.target, 2, 0, 1, 20, hit);
        if (this.rngLoot.chance(0.3) && this.damage.healPlayer(1)) this.game.audio.play('heal');
      } else if (c.kind === 'martillo') {
        if (!c.target.dead) this.damage.hitEnemy(c.target, 4, c.x - this.player.x, c.y - this.player.y, 180, hit);
        this.shake(2, 0.12);
      } else {
        for (const e of this.enemies.query(c.x, c.y, 42)) {
          if (e.canBeHit() && (e.x - c.x) ** 2 + (e.y - c.y) ** 2 < 34 * 34) this.damage.hitEnemy(e, 3, e.x - c.x, e.y - c.y, 90, hit);
        }
        this.shake(3, 0.15);
      }
      this.effects.burst(c.x, c.y - 6, 16, '#ff6ad5', 90, 0.45, 2);
      this.game.audio.play('cleared', { pitch: 2, volume: 0.5 });
    }
    this.constructs = this.constructs.filter((c) => !c.done || c.t < c.delay + 0.2);
  }

  _renderConstructs(g) {
    for (const c of this.constructs) {
      const k = Math.min(1, c.t / c.delay);
      const x = Math.round(c.x), y = Math.round(c.y - 8 - (1 - k) * 46);
      g.globalAlpha = c.done ? Math.max(0, 1 - (c.t - c.delay) / 0.2) : 0.9;
      g.fillStyle = '#ff6ad5';
      if (c.kind === 'corazon') {
        g.fillRect(x - 4, y - 3, 3, 2); g.fillRect(x + 1, y - 3, 3, 2); g.fillRect(x - 5, y - 2, 10, 3); g.fillRect(x - 3, y + 1, 6, 2); g.fillRect(x - 1, y + 3, 2, 1);
      } else if (c.kind === 'martillo') {
        g.fillRect(x - 6, y - 4, 12, 6); g.fillRect(x - 1, y + 2, 2, 8);
      } else {
        g.fillRect(x - 1, y - 7, 2, 14); g.fillRect(x - 7, y - 1, 14, 2); g.fillRect(x - 4, y - 4, 8, 8);
      }
      g.fillStyle = '#ffe0f4'; g.fillRect(x - 1, y - 1, 2, 2);
      // sombra/objetivo en el suelo
      g.globalAlpha = 0.5 * k; g.strokeStyle = '#ff6ad5';
      g.beginPath(); g.ellipse(Math.round(c.x), Math.round(c.y), 7, 4, 0, 0, Math.PI * 2); g.stroke();
      g.globalAlpha = 1;
    }
  }

  _renderAura(g) {
    const r = this.items.auraRadius();
    if (!r || !this.player.alive) return;
    const p = this.player;
    g.globalAlpha = 0.12 + 0.05 * Math.sin(this.time * 5);
    g.fillStyle = '#ffd65c';
    g.beginPath(); g.ellipse(Math.round(p.x), Math.round(p.y - 2), r, r * 0.7, 0, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 0.6; g.fillStyle = '#fff6d6';
    for (let i = 0; i < 8; i++) {
      const a = this.time * 1.5 + (i / 8) * Math.PI * 2;
      g.fillRect(Math.round(p.x + Math.cos(a) * r), Math.round(p.y - 2 + Math.sin(a) * r * 0.7), 1, 1);
    }
    g.globalAlpha = 1;
  }

  /** El jugador coge un objeto: lo aplica y anuncia el objeto y las sinergias nuevas. */
  takeItem(id) {
    const res = this.items.add(id);
    if (!res) return;
    const { item, synergies } = res;
    this.itemBanner = { title: item.name, text: item.description, color: '#fff6d6', t: 0 };
    for (const s of synergies) this._queuedBanners.push({ title: `Sinergia: ${s.name}`, text: s.description, color: '#ffd65c', t: 0 });
    const meta = this.game.save.data.meta;
    if (!meta.discovered.items.includes(id)) meta.discovered.items.push(id);
    meta.itemCounts[id] = (meta.itemCounts[id] ?? 0) + 1;
    for (const s of synergies) if (!meta.discovered.synergies.includes(s.id)) meta.discovered.synergies.push(s.id);
    this.effects.burst(this.player.x, this.player.y - 12, 24, '#ffd65c', 90, 0.6);
    this.game.audio.play('cleared', { pitch: 1.2 });
    this.game.haptics.play('event');
  }

  get cleared() { return this.node?.state.cleared ?? false; }

  // ---------- Cambio de sala ----------

  /** Entra en una sala. `fromDir` = dirección en la que se movía el jugador al cruzar la puerta. */
  enterNode(node, fromDir = null) {
    if (this.node) {
      this.node.state.pickups = this.pickups.serialize();
      for (const r of this.rules) r.onRoomExit?.(this, this.node);
    }
    this.projectiles.clear(); this.effects.clear(); this.hazards.clear();
    this.items.clearScheduled();
    this.constructs.length = 0;
    this.freezeTime = 0;
    this.enemies.clear(); this.pickups.clear();
    this.encounter = null;
    this.boss = null;
    this.arena.margin = 0; this.arena.target = 0;
    this.texts.length = 0;
    this.banner = null;
    this.bossIntro = null;

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
    this.current = null;            // corriente de agua (regla Corrientes)
    this._configureDoors(node);
    ROOM_TYPES[node.type].onEnter(this, node, first);
    for (const r of this.rules) r.onRoomEnter?.(this, node, first);
    this.items.onRoomEnter(node, first);
    this.room.setAllDoors(!this.encounter);
    if (!this.encounter) this._music('explore');
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
      const isSecret = kind === 'secret';
      const revealed = !isSecret || !!node.state.revealed?.[dir];
      // La puerta anuncia a qué tipo de sala lleva: color del marco + icono
      const icon = DOOR_ICONS[other.type] ?? null;
      spec[dir] = {
        kind: isSecret ? 'secret' : other.type === 'boss' ? 'boss' : 'normal',
        color: icon ? ROOM_TYPES[other.type].mapColor : null,
        icon,
        open: revealed,
        revealed,
        hits: node.state.secretHits[dir] ?? 0,
      };
    }
    this.room.setDoors(spec);
  }

  startEncounter(def, { music = 'combat' } = {}) {
    this.encounter = new Encounter(this, def);
    for (const r of this.rules) r.onEncounterStart?.(this, this.encounter);
    this._music(music);
  }

  _music(kind) {
    const m = this.run.dream.music;
    this.game.audio.playMusic(m[kind] ?? m.explore);
  }

  onEncounterCleared() {
    const node = this.node;
    const overtime = !!this.examClock?.overtime;
    node.state.cleared = true;
    this.room.setAllDoors(true);
    this.items.onRoomClear();
    for (const r of this.rules) r.onEncounterEnd?.(this);
    this._music('explore');
    // Sala limpia = sala segura: fuera proyectiles enemigos y suelo que hace daño
    this.projectiles.clearTeam('enemy');
    this.hazards.clearDangerous();
    ROOM_TYPES[node.type].onClear?.(this, node);
    this.game.audio.play('cleared');
    this.game.haptics.play('event');
    if (node.type === 'combat' || node.type === 'challenge') this.floatText(this.player.x, this.player.y - 26, 'Sala despejada');
    this.game.events.emit('room:cleared', { node, overtime });
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
    this.freezeTime = Math.max(0, this.freezeTime - dt);
    this.hurtFlash = Math.max(0, (this.hurtFlash ?? 0) - dt);
    if (this.itemBanner && (this.itemBanner.t += dt) > 3) this.itemBanner = null;
    if (!this.itemBanner && this._queuedBanners.length) this.itemBanner = this._queuedBanners.shift();

    const p = this.player;
    if (p.alive) {
      this.controller.update(p, dt);
      this.combat.update(p, dt);
    } else {
      p.deathTime += dt;
    }
    this.playerHistory.record(p, this.time);
    this._updateArena(dt);
    for (const r of this.rules) r.update?.(this, dt);
    this.encounter?.update(dt);
    this.enemies.update(dt);
    this.projectiles.update(dt);
    this.hazards.update(dt);
    this._updateConstructs(dt);
    this.pickups.update(dt);
    this.interactables.update(dt);
    this.effects.update(dt);
    for (const t of this.texts) t.t += dt;
    if (this.texts.length && this.texts[0].t > 1.2) this.texts.shift();
    if (this.banner && (this.banner.t += dt) > 2) this.banner = null;
    if (this.bossIntro && (this.bossIntro.t += dt) > 2.6) this.bossIntro = null;

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

  /** Fase 3 del jefe: los bordes del aula se cierran. Pisar el borde hace daño y empuja hacia dentro. */
  _updateArena(dt) {
    const a = this.arena;
    if (a.margin === a.target && a.margin === 0) return;
    a.margin += Math.sign(a.target - a.margin) * Math.min(Math.abs(a.target - a.margin), 16 * dt);
    const p = this.player;
    if (!p.alive || a.margin < 4) return;
    const r = this.arenaRect();
    if (p.x < r.x0 || p.x > r.x1 || p.y < r.y0 || p.y > r.y1) {
      const cx = (r.x0 + r.x1) / 2, cy = (r.y0 + r.y1) / 2;
      this.damage.hurtPlayer(1, cx - p.x, cy - p.y, this.boss?.def.id ?? null);
      p.kx += Math.sign(cx - p.x) * 40; p.ky += Math.sign(cy - p.y) * 40;
    }
  }

  arenaRect() {
    const m = this.arena.margin, w = this.room.width, h = this.room.height;
    return { x0: TILE + m, x1: w - TILE - m, y0: TILE + m * 0.6, y1: h - TILE - m * 0.6 };
  }

  /** Lo que queda pendiente en una sala (para marcarlo en el mapa). */
  leftovers(node) {
    const out = { hearts: 0, lucidity: 0, loot: 0 };
    const pickups = node === this.node ? this.pickups.serialize() : node.state.pickups;
    for (const p of pickups) { if (p.type === 'heart') out.hearts++; else out.lucidity++; }
    for (const o of node.state.interactables ?? []) {
      if (o.kind === 'chest' && !o.opened) out.loot++;
      if (o.kind === 'fountain' && !o.used) out.loot++;
      if (o.kind === 'shopItem' && !o.sold && o.price <= this.run.lucidity) out.loot++;
      if (o.kind === 'event' && !o.done) out.loot++;
      if (o.kind === 'item' && !o.taken) out.loot++;
    }
    return out;
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
    this.game.events.emit('player:expelled', { by: this.lastHurtBy });
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
    this._renderArena(g);
    this.hazards.render(g);
    this._renderAura(g);
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
      if (obj === this.player) { this._renderPlayer(g, playerSprite); this.items.render(g); }
      else if (obj.kind) this.interactables.draw(g, obj);
      else this.enemies.draw(g, obj);
    }

    this.projectiles.render(g);
    this._renderConstructs(g);
    this.effects.render(g);
    this.lighting.render(g, this);
    if (this.encounter?.showHints) this._renderEnemyHints(g);
    if (this.game.debug) this._renderDebug(g);
    g.restore();
  }

  /** Sala parada: anillos que señalan a los enemigos que quedan (se ven incluso en la oscuridad). */
  _renderEnemyHints(g) {
    const k = 0.5 + 0.5 * Math.sin(this.time * 6);
    for (const e of this.enemies.list) {
      if (e.spawning || e.def.boss) continue;
      const x = Math.round(e.x), y = Math.round(e.y - (e.def.bodyHeight ?? 6));
      g.globalAlpha = 0.5 + 0.4 * k;
      g.strokeStyle = '#ffd65c';
      g.beginPath(); g.arc(x, y, 9 + k * 3, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#ffd65c';
      g.fillRect(x - 1, y - 22 - Math.round(k * 2), 2, 6); g.fillRect(x - 1, y - 14 - Math.round(k * 2), 2, 2);
      g.globalAlpha = 1;
    }
  }

  _renderArena(g) {
    if (this.arena.margin < 1) return;
    const r = this.arenaRect(), w = this.room.width, h = this.room.height;
    g.globalAlpha = 0.78;
    g.fillStyle = '#2e2552';
    g.fillRect(0, 0, w, r.y0); g.fillRect(0, r.y1, w, h - r.y1);
    g.fillRect(0, r.y0, r.x0, r.y1 - r.y0); g.fillRect(r.x1, r.y0, w - r.x1, r.y1 - r.y0);
    // Pliegues del papel arrugado
    g.fillStyle = '#4b3f75';
    for (let i = 0; i < 10; i++) {
      const k = (i * 47) % 100 / 100;
      g.fillRect(Math.round(r.x0 * k), Math.round(r.y0 + (r.y1 - r.y0) * ((i * 31) % 100 / 100)), 6, 1);
      g.fillRect(Math.round(r.x1 + (w - r.x1) * k), Math.round(r.y0 + (r.y1 - r.y0) * ((i * 73) % 100 / 100)), 6, 1);
    }
    g.globalAlpha = 1;
    g.fillStyle = '#d6403a';
    g.fillRect(Math.round(r.x0), Math.round(r.y0), Math.round(r.x1 - r.x0), 1);
    g.fillRect(Math.round(r.x0), Math.round(r.y1), Math.round(r.x1 - r.x0), 1);
    g.fillRect(Math.round(r.x0), Math.round(r.y0), 1, Math.round(r.y1 - r.y0));
    g.fillRect(Math.round(r.x1), Math.round(r.y0), 1, Math.round(r.y1 - r.y0));
  }

  /** Textos que van sobre la sala (precios, avisos, pistas). */
  renderUI(r) {
    const ox = ROOM_OFFSET_X, oy = ROOM_OFFSET_Y;
    ROOM_TYPES[this.node.type].renderUI?.(r, this, ox, oy);
    if (!this.run.result) this.interactables.renderUI(r, ox, oy);
    for (const t of this.texts) {
      r.text(t.text, t.x + ox, t.y + oy - t.t * 14, { size: 8, weight: 700, color: '#ffd65c', align: 'center', alpha: Math.min(1, (1.2 - t.t) * 3) });
    }
    for (const rule of this.rules) rule.renderUI?.(r, this);
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
    const flash = p.flash > 0 && !this.settings.reduceFlashes;
    sprite.draw(g, anim, p.animTime, p.x, p.y, { flip: p.facing < 0, flash, alpha: p.isDashing ? 0.6 : 1 });
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
