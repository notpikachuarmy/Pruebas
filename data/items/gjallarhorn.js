// Objeto: Gjallarhorn (el cuerno que anuncia el Ragnarök)
export default {
  id: 'gjallarhorn',
  name: 'Gjallarhorn',
  rarity: 'legendaria',
  pools: ['boss', 'secret'],
  locked: true,
  tags: ['sonido'],
  description: 'Cada vez que llega una oleada, el cuerno suena: los enemigos nuevos quedan aturdidos y marcados.',
  modifiers: [],
  effects: [{ effect: 'horn', stun: 1.6, mark: 3 }],
};
