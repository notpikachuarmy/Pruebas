// Objeto: Eco
export default {
  id: 'eco',
  name: 'Eco',
  rarity: 'común',          // común | rara | legendaria
  pools: ['examen', 'general'],
  tags: ['sonido', 'repeticion'],
  description: 'Cada onda se repite un instante después, más débil.',
  modifiers: [],
  effects: [{ effect: 'echo', delay: 0.25, damage: 0.6 }],
  icon: [
    '........',
    '..llll..',
    '.l....l.',
    'l..ww..l',
    'l..ww..l',
    '.l....l.',
    '..llll..',
    '........',
  ],
};
