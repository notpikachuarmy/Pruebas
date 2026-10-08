// Objeto: Piña
export default {
  id: 'pina',
  name: 'Piña',
  rarity: 'común',
  pools: ['bosque', 'general'],
  tags: ['bosque', 'explosion'],
  description: 'Cada quinta nota es una piña que estalla al impactar y daña a los de alrededor.',
  modifiers: [],
  effects: [{ effect: 'explosiveShot', every: 5, radius: 26 }],
};
