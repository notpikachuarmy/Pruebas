// Objeto: Instinto
export default {
  id: 'instinto',
  name: 'Instinto',
  rarity: 'rara',
  pools: ['bosque', 'general', 'boss'],
  tags: ['bosque', 'silencio'],
  description: 'Cada Silencio lanza un anillo de seis notas a tu alrededor.',
  modifiers: [],
  effects: [{ effect: 'dashRing', count: 6, damage: 0.6 }],
};
