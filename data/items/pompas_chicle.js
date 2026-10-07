// Objeto: Pompas de Chicle
export default {
  id: 'pompas_chicle',
  name: 'Pompas de Chicle',
  rarity: 'común',
  pools: ['dulce', 'general', 'minijefe'],
  tags: ['dulce', 'forma'],
  description: 'Notas más grandes y que llegan más lejos, aunque algo más lentas.',
  modifiers: [{ stat: 'shotSize', add: 1 }, { stat: 'shotSpeed', mult: 0.85 }, { stat: 'range', mult: 1.25 }],
  effects: [],
};
