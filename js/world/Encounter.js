/**
 * Oleadas de enemigos de una sala. Lee la definición desde el sueño:
 * dream.encounters[id] = { waves: [[{id, count}], ...], delayBetweenWaves }
 */
export class Encounter {
  constructor(world, def) {
    this.world = world;
    this.def = def;
    this.waveIndex = -1;
    this.timer = 0.8;            // pequeña pausa antes de la primera oleada
    this.finished = false;
    this.banner = 0;             // tiempo restante del rótulo "Pregunta N"
  }

  get totalWaves() { return this.def.waves.length; }

  update(dt) {
    if (this.finished) return;
    const enemies = this.world.enemies;
    this.banner = Math.max(0, this.banner - dt);
    if (enemies.aliveCount > 0) return;

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

  _spawnWave(groups) {
    const { room, player, enemies, rngSpawn, game } = this.world;
    const used = [];
    for (const g of groups) {
      for (let i = 0; i < g.count; i++) {
        let pt = null;
        // Evita aparecer pegados al jugador o entre sí
        for (let t = 0; t < 10; t++) {
          const cand = room.enemySpawns.length ? rngSpawn.pick(room.enemySpawns) : room.randomFloorPoint(rngSpawn, player.x, player.y, 90);
          if (used.every((u) => Math.hypot(u.x - cand.x, u.y - cand.y) > 20)) { pt = cand; break; }
          pt = cand;
        }
        used.push(pt);
        enemies.spawn(g.id, pt.x, pt.y);
      }
    }
    this.banner = 1.6;
    game.audio.play('waveStart');
    game.audio.play('spawn');
  }
}
