/**
 * Oleadas de enemigos de una sala: { waves: [[{id, count}], ...], delayBetweenWaves }.
 * Lo crea World.startEncounter() a partir de EncounterBuilder o de un encuentro fijo del sueño.
 */
export class Encounter {
  constructor(world, def) {
    this.world = world;
    this.def = def;
    this.waveIndex = -1;
    this.timer = def.startDelay ?? 0.9;   // margen para orientarse al entrar
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
