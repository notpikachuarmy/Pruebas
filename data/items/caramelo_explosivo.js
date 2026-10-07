// Objeto: Caramelo Explosivo
export default {
  id: 'caramelo_explosivo',
  name: 'Caramelo Explosivo',
  rarity: 'rara',
  pools: ['dulce', 'boss'],
  locked: true,
  tags: ['dulce', 'explosion'],
  description: 'Los enemigos que disipas estallan en azúcar y dañan a los que tienen cerca.',
  modifiers: [],
  effects: [{ effect: 'killExplosion', radius: 30, damage: 1.5 }],
};
