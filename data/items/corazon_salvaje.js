// Objeto: Corazón Salvaje
export default {
  id: 'corazon_salvaje',
  name: 'Corazón Salvaje',
  rarity: 'legendaria',
  pools: ['boss', 'secret'],
  locked: true,          // se desbloquea con un logro (data/progression/achievements.js)
  tags: ['bosque', 'furia'],
  description: 'Con media vida o menos, haces un 50 % más de daño y disparas un 25 % más rápido.',
  modifiers: [],
  effects: [{ effect: 'lowHpFury', mult: 1.5, fireRate: 1.25 }],
};
