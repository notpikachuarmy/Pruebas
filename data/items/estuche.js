// Objeto: Estuche Lleno
export default {
  id: 'estuche',
  name: 'Estuche Lleno',
  rarity: 'común',          // común | rara | legendaria
  pools: ['examen', 'general', 'minijefe'],
  tags: ['vida'],
  description: 'Un corazón más. Ir preparado tranquiliza.',
  modifiers: [{ stat: 'maxHp', add: 2 }],
  effects: [{ effect: 'heal', amount: 2 }],
  icon: [
    '........',
    '.pppppp.',
    'pppppppp',
    'pkpppkpp',
    'pppppppp',
    'pyrbgyrp',
    'pppppppp',
    '.pppppp.',
  ],
};
