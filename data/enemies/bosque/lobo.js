// Enemigo: Lobo (depredador rápido que embiste)
import tachon from '../tachon.js';

export default {
  ...tachon,
  id: 'lobo', name: 'Lobo', dream: 'bosque', role: 'perseguidor', tags: ['bosque', 'depredador'],
  cost: 1.3, minDepth: 0,
  description: 'Te rodea sin prisa y, cuando está cerca, se agacha un instante y salta a por ti. Esquiva justo en ese momento.',
  theme: 'Los ojos amarillos entre los árboles. Siempre hay más de uno.',
  sprite: 'enemy_lobo',
  radius: 5, bodyRadius: 7, bodyHeight: 6,
  hp: 4.5, speed: 46, mass: 0.9,
  params: { ...tachon.params, wobble: 0.35, wobbleSpeed: 4, lungeRange: 72, windup: 0.5, lungeSpeed: 235, lungeTime: 0.32, recover: 0.8, inkType: null },
  drops: [{ type: 'lucidity', chance: 0.65, amount: [1, 2] }, { type: 'heart', chance: 0.06 }],
};
