// Objeto: Pedal de Distorsión
export default {
  id: 'pedal_distorsion',
  name: 'Pedal de Distorsión',
  rarity: 'rara',
  pools: ['general', 'boss'],
  tags: ['sonido', 'forma'],
  description: 'Al apagarse, cada nota se rompe en tres fragmentos.',
  modifiers: [],
  effects: [{ effect: 'fragment', count: 3 }],
};
