import { Random, randomSeed } from '../core/Random.js';
import { generateFloor } from '../rooms/FloorGenerator.js';

/** Estado de una run completa: semilla, sueño actual, plano generado y contadores. */
export class Run {
  constructor(game, { seed = randomSeed(), dreamId = 'examen' } = {}) {
    this.game = game;
    this.seed = seed;
    this.rng = new Random(seed);
    this.dream = game.content.dreams[dreamId];
    this.floor = generateFloor(this.rng.fork(`map:${dreamId}`), this.dream, game.content.rooms);
    this.time = 0;
    this.lucidity = 0;
    this.kills = 0;
    this.shots = 0;
    this.hits = 0;
    this.result = null;     // 'win' | 'death' | 'quit'
  }

  get accuracy() { return this.shots ? this.hits / this.shots : 0; }

  get roomsVisited() {
    let n = 0;
    for (const node of this.floor.nodes.values()) if (node.state.visited) n++;
    return n;
  }
}
