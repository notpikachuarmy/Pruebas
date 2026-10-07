// Objeto: Salvavidas
export default {
  id: 'salvavidas',
  name: 'Salvavidas',
  rarity: 'rara',
  pools: ['mar', 'general', 'boss'],
  tags: ['vida', 'mar'],
  description: 'Cuando te quedas con un corazón o menos, una vez por sala: te protege un momento, aparta a los enemigos y borra los proyectiles cercanos.',
  modifiers: [],
  effects: [{ effect: 'lifebuoy', time: 1.5 }],
};
