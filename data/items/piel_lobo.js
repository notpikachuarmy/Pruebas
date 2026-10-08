// Objeto: Piel de Lobo
export default {
  id: 'piel_lobo',
  name: 'Piel de Lobo',
  rarity: 'rara',
  pools: ['bosque', 'general'],
  tags: ['bosque', 'defensa'],
  description: 'Cuando te golpean, los enemigos que tienes cerca reciben un zarpazo.',
  modifiers: [],
  effects: [{ effect: 'thorns', radius: 40, damage: 3 }],
};
