import { Random, randomSeed } from '../core/Random.js';
import { generateFloor } from '../rooms/FloorGenerator.js';

/**
 * Estado de una run completa = una noche. Una noche recorre todos los sueños desbloqueados
 * en orden aleatorio. El jugador, sus objetos y su Lucidez pasan de un sueño a otro.
 */
export class Run {
  constructor(game, { seed = randomSeed(), dreams = null } = {}) {
    this.game = game;
    this.seed = seed;
    this.rng = new Random(seed);
    this.night = dreams ?? Run.planNight(game, this.rng.fork('night'));
    this.time = 0;
    this.lucidity = 0;
    this.kills = 0;
    this.shots = 0;
    this.hits = 0;
    this.result = null;     // 'win' | 'death' | 'quit'
    this.flags = {};        // efectos de eventos (favor, mapa revelado...)
    this.counters = { lampsLit: 0 };
    this.usedEvents = new Set();
    this.offeredItems = new Set();   // objetos que ya han salido (no se repiten en la run)
    this.unlockedThisRun = [];       // textos de desbloqueos/logros para la pantalla final
    this.dreamsCleared = 0;
    this._roomsBefore = 0;
    this._loadDream(0);
  }

  /** Todos los sueños desbloqueados, en orden aleatorio; el sueño final (Ragnarök) siempre el último. La dificultad sube con cada sueño de la noche. */
  static planNight(game, rng) {
    const unlocked = game.save.data.meta.unlocks.dreams;
    const open = Object.values(game.content.dreams).filter((d) => !d.locked || unlocked.includes(d.id));
    // Los sueños normales van en orden aleatorio; los finales (final: true) siempre cierran la noche
    const normal = rng.shuffle(open.filter((d) => !d.final).map((d) => d.id));
    const finals = open.filter((d) => d.final).map((d) => d.id);
    return [...normal, ...finals];
  }

  _loadDream(index) {
    this.dreamIndex = index;
    this.dream = this.game.content.dreams[this.night[index]];
    this.floor = generateFloor(this.rng.fork(`map:${this.dream.id}`), this.dream, this.game.content.rooms);
    // Jefe de este sueño: uno de su lista `bosses` (o el único `boss`)
    const pool = this.dream.bosses ?? [this.dream.boss];
    this.bossId = this.rng.fork(`boss:${this.dream.id}`).pick(pool);
    this.flags.mapRevealed = false;
  }

  unlockedDreams() {
    const unlocked = this.game.save.data.meta.unlocks.dreams;
    return Object.values(this.game.content.dreams).filter((d) => !d.final && (!d.locked || unlocked.includes(d.id)));
  }

  get isLastDream() { return this.dreamIndex >= this.night.length - 1; }

  nextDream() {
    this._roomsBefore += this._visitedHere();
    this.dreamsCleared++;
    this._loadDream(this.dreamIndex + 1);
  }

  get accuracy() { return this.shots ? this.hits / this.shots : 0; }

  _visitedHere() {
    let n = 0;
    for (const node of this.floor.nodes.values()) if (node.state.visited) n++;
    return n;
  }

  get roomsVisited() { return this._roomsBefore + this._visitedHere(); }
}
