// Objeto: Caracola
export default {
  id: 'caracola',
  name: 'Caracola',
  rarity: 'rara',
  pools: ['mar', 'boss'],
  locked: true,          // se desbloquea con un logro (data/progression/achievements.js)
  tags: ['mar', 'sonido'],
  description: 'Cada octava nota es una gran ola que atraviesa todo lo que encuentra.',
  modifiers: [],
  effects: [{ effect: 'bigWave', every: 8, mult: 2 }],
};
