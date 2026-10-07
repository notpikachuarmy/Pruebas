// Objeto: Saxofón
export default {
  id: 'saxofon',
  name: 'Saxofón',
  rarity: 'rara',
  pools: ['general', 'boss'],
  tags: ['musica'],
  description: 'Las notas dejan un rastro dorado que daña a los enemigos que lo pisan.',
  modifiers: [],
  effects: [{ effect: 'trail', hazard: 'soundTrail' }],
};
