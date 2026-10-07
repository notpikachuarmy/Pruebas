// Enemigo: Anguila (rápida y serpenteante)
import tachon from '../tachon.js';

export default {
  ...tachon,
  id: 'anguila', name: 'Anguila', dream: 'mar', role: 'perseguidor', tags: ['mar'],
  cost: 1.3, minDepth: 1,
  description: 'Rápida y escurridiza: serpentea hacia ti sin detenerse nunca.',
  theme: 'Algo largo que se mueve entre las rocas.',
  sprite: 'enemy_anguila',
  hp: 3, speed: 66,
  params: { ...tachon.params, wobble: 1.5, wobbleSpeed: 9, lungeRange: 0, inkType: null },
};
