// Objeto: Partitura
export default {
  id: 'partitura',
  name: 'Partitura',
  rarity: 'común',
  pools: ['general', 'minijefe'],
  tags: ['musica'],
  description: 'Las notas atraviesan a un enemigo y llegan un poco más lejos.',
  modifiers: [{ stat: 'range', mult: 1.15 }],
  effects: [{ effect: 'pierce', count: 1 }],
};
