// Objeto: Asta de Ciervo
export default {
  id: 'asta',
  name: 'Asta de Ciervo',
  rarity: 'rara',
  pools: ['bosque', 'general', 'boss'],
  tags: ['bosque', 'silencio'],
  description: 'El Silencio embiste: dañas y empujas a los enemigos que atraviesas.',
  modifiers: [],
  effects: [{ effect: 'dashStrike', damage: 3 }],
};
