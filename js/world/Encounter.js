/**
 * Oleadas de enemigos de una sala: { waves: [[{id, count}], ...], delayBetweenWaves }.
 * Lo crea World.startEncounter() a partir de EncounterBuilder o de un encuentro fijo del sueño.
 */
const STALE_HINT = 6;        // s sin cambios: se marcan los enemigos que quedan
const STALE_DISSOLVE = 40;   // s sin cambios: los que quedan se desvanecen

export class Encounter {
  constructor(world, def) {
    this.world = world;
    this.def = def;
    this.waveIndex = -1;
    this.timer = def.startDelay ?? 0.9;   // margen para orientarse al entrar
    this.finished = false;
    this.banner = 0;             // tiempo restante del rótulo "Pregunta N"
    // Red de seguridad contra salas atascadas (un enemigo escondido en la oscuridad, metido en una pared...)
    this.stale = 0;              // segundos sin que ningún enemigo muera ni reciba daño
    this._lastSig = '';
    this._rescueT = 0;
  }

  /** Cuando la sala lleva un rato parada, se señala dónde están los enemigos que quedan. */
  get showHints() { return !this.finished && this.stale > STALE_HINT; }

  get totalWaves() { return this.def.waves.length; }

  update(dt) {
    if (this.finished) return;
    const enemies = this.world.enemies;
    this.banner = Math.max(0, this.banner - dt);
    if (enemies.aliveCount > 0) { this._watchdog(dt); return; }
    this.stale = 0;

    this.timer -= dt;
    if (this.timer > 0) return;

    if (this.waveIndex + 1 >= this.totalWaves) {
      this.finished = true;
      this.world.onEncounterCleared();
      return;
    }
    this.waveIndex++;
    this.timer = this.def.delayBetweenWaves ?? 1;
    this._spawnWave(this.def.waves[this.waveIndex]);
  }

  _watchdog(dt) {
    const { enemies, room, player, damage, rngSpawn } = this.world;
    // ¿Ha cambiado algo? (bajas o vida de los enemigos)
    let sig = `${enemies.list.length}`;
    for (const e of enemies.list) sig += `|${Math.round(e.hp * 10)}`;
    if (sig !== this._lastSig) { this._lastSig = sig; this.stale = 0; } else this.stale += dt;

    // Rescate: enemigos fuera de la sala o metidos dentro de un obstáculo vuelven al suelo
    this._rescueT -= dt;
    if (this._rescueT <= 0) {
      this._rescueT = 0.5;
      for (const e of enemies.list) {
        if (e.def.boss || e.spawning || e.dead) continue;
        const out = !(e.x > 0 && e.y > 0 && e.x < room.width && e.y < room.height) || !Number.isFinite(e.x + e.y);
        if (out || room.isSolidAt(e.x, e.y - 1)) {
          const pt = room.randomFloorPoint(rngSpawn, player.x, player.y, 60);
          e.x = pt.x; e.y = pt.y; e.kx = 0; e.ky = 0;
        }
      }
    }

    // Último recurso: si en mucho tiempo nada ha pasado, lo que queda se desvanece (nunca los jefes)
    if (this.stale > STALE_DISSOLVE) {
      this.stale = 0;
      for (const e of [...enemies.list]) if (!e.def.boss && !e.dead) damage.killEnemy(e);
    }
  }

  _spawnWave(groups) {
    const { room, player, enemies, rngSpawn, game } = this.world;
    const used = [];
    for (const g of groups) {
      for (let i = 0; i < g.count; i++) {
        let pt = g.at ? { x: g.at[0] * 16 + 8, y: g.at[1] * 16 + 14 } : null;
        for (let t = 0; t < 10 && !g.at; t++) {
          const cand = room.enemySpawns.length ? rngSpawn.pick(room.enemySpawns) : room.randomFloorPoint(rngSpawn, player.x, player.y, 90);
          pt = cand;
          if (used.every((u) => Math.hypot(u.x - cand.x, u.y - cand.y) > 20)) break;
        }
        used.push(pt);
        enemies.spawn(g.id, pt.x, pt.y);
      }
    }
    this.banner = this.def.noBanner ? 0 : 1.4;
    game.audio.play('waveStart');
    game.audio.play('spawn');
  }
}
