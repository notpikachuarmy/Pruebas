// Objeto: Bolígrafo de Papá
export default {
  id: 'boligrafo_papa',
  name: 'Bolígrafo de Papá',
  rarity: 'legendaria',          // común | rara | legendaria
  pools: ['boss'],
  tags: ['tinta'],
  description: 'Más daño, y el doble contra todo lo que esté hecho de tinta.',
  modifiers: [{ stat: 'damage', add: 0.5 }],
  effects: [{ effect: 'damageVsTag', tag: 'tinta', mult: 2 }],
  icon: [
    '......rk',
    '.....rk.',
    '....rk..',
    '...bk...',
    '..bk....',
    '.bk.....',
    'yk......',
    'k.......',
  ],
};
