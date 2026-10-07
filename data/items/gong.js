// Objeto: Gong
export default {
  id: 'gong',
  name: 'Gong',
  rarity: 'legendaria',
  pools: ['boss', 'secret'],
  locked: true,          // se desbloquea con un logro (data/progression/achievements.js)
  tags: ['musica'],
  description: 'Cuando te golpean, suena el gong: una onda golpea a todos los enemigos de la sala.',
  modifiers: [],
  effects: [{ effect: 'gongOnHurt', damage: 3 }],
};
