// Objeto: Huida
export default {
  id: 'huida',
  name: 'Huida',
  rarity: 'común',
  pools: ['bosque', 'general'],
  tags: ['bosque', 'velocidad'],
  description: 'Tras recibir daño, corres un 40 % más durante 3 segundos.',
  modifiers: [],
  effects: [{ effect: 'fleeBoost', time: 3, mult: 1.4 }],
};
