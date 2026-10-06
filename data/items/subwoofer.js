// Objeto: Subwoofer
export default {
  id: 'subwoofer',
  name: 'Subwoofer',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['general'],
  tags: ['sonido', 'graves'],
  description: 'Graves: ondas lentas, gordas y que pegan fuerte.',
  modifiers: [{ stat: 'damage', mult: 1.4 }, { stat: 'shotSpeed', mult: 0.75 }, { stat: 'shotSize', add: 1 }, { stat: 'knockback', mult: 1.5 }],
  effects: [],
  icon: [
    'kkkkkkkk',
    'kddddddk',
    'kd.kk.dk',
    'kdkggkdk',
    'kdkggkdk',
    'kd.kk.dk',
    'kddddddk',
    'kkkkkkkk',
  ],
};
