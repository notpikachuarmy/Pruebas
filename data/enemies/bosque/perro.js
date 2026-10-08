// Enemigo: Perro de Caza (rápido y frágil, va en grupo)
import tachon from '../tachon.js';

export default {
  ...tachon,
  id: 'perro', name: 'Perro de Caza', dream: 'bosque', role: 'perseguidor', tags: ['bosque', 'cazador'],
  cost: 0.7, minDepth: 0,
  description: 'Corre más que tú y no se cansa. Es frágil: un par de notas y huye aullando.',
  theme: 'Los ladridos que se oyen antes que los disparos.',
  sprite: 'enemy_perro',
  radius: 4, bodyRadius: 6, bodyHeight: 5,
  hp: 2.2, speed: 64, mass: 0.6,
  params: { ...tachon.params, wobble: 0.9, wobbleSpeed: 9, lungeRange: 46, windup: 0.35, lungeSpeed: 200, lungeTime: 0.26, recover: 0.5, inkType: null },
  drops: [{ type: 'lucidity', chance: 0.5, amount: [1, 1] }, { type: 'heart', chance: 0.05 }],
};
