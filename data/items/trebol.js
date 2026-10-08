// Objeto: Trébol de Cuatro Hojas
export default {
  id: 'trebol',
  name: 'Trébol de Cuatro Hojas',
  rarity: 'rara',
  pools: ['bosque', 'general', 'secret'],
  locked: true,          // se desbloquea con un logro (data/progression/achievements.js)
  tags: ['suerte'],
  description: 'Más suerte: salen objetos raros más a menudo y los enemigos sueltan más botín.',
  modifiers: [],
  effects: [{ effect: 'luck' }],
};
