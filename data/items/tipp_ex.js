// Objeto: Tipp-Ex
export default {
  id: 'tipp_ex',
  name: 'Tipp-Ex',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['examen'],
  tags: ['borrar'],
  description: 'Tus ondas dejan una línea blanca que borra los proyectiles enemigos.',
  modifiers: [],
  effects: [{ effect: 'trail', hazard: 'whiteLine' }],
  icon: [
    '....kk..',
    '...kwwk.',
    '..kwwk..',
    '.kwwk...',
    'kwwk....',
    'kddk....',
    '.kk.....',
    '........',
  ],
};
