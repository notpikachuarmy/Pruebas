// Objeto: Ancla
export default {
  id: 'ancla',
  name: 'Ancla',
  rarity: 'común',
  pools: ['mar', 'general', 'minijefe'],
  tags: ['mar', 'peso'],
  description: 'Notas pesadas: empujan muchísimo y golpean algo más, pero viajan más despacio.',
  modifiers: [{ stat: 'knockback', mult: 2.5 }, { stat: 'shotSpeed', mult: 0.8 }, { stat: 'damage', add: 0.4 }],
  effects: [],
};
