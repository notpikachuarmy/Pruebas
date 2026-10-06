import { Random, randomSeed } from '../core/Random.js';

/** Estado de una run completa (sobrevive a los cambios de sala; en Fase 3, a los de sueño). */
export class Run {
  constructor(game, { seed = randomSeed(), dreamId = 'examen' } = {}) {
    this.game = game;
    this.seed = seed;
    this.rng = new Random(seed);
    this.dream = game.content.dreams[dreamId];
    this.time = 0;
    this.lucidity = 0;
    this.kills = 0;
    this.shots = 0;
    this.hits = 0;
    this.result = null;     // 'win' | 'death' | 'quit'
  }

  get accuracy() { return this.shots ? this.hits / this.shots : 0; }
}
