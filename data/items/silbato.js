// Objeto: Silbato
export default {
  id: 'silbato',
  name: 'Silbato',
  rarity: 'común',          // común | rara | legendaria
  pools: ['examen', 'general', 'minijefe'],
  tags: ['sonido', 'agudos'],
  description: 'Agudos: disparas mucho más rápido, ondas veloces pero algo más débiles.',
  modifiers: [{ stat: 'fireRate', mult: 1.4 }, { stat: 'damage', mult: 0.8 }, { stat: 'shotSpeed', mult: 1.25 }],
  effects: [],
  icon: [
    '........',
    '........',
    '.yyyyy..',
    'yyyyyyyk',
    'yykyyyy.',
    '.yyyyy..',
    '...k....',
    '...k....',
  ],
};
