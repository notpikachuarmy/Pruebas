// Objeto: Cinta de Casete
export default {
  id: 'cinta_casete',
  name: 'Cinta de Casete',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['general', 'secret'],
  locked: true,          // se desbloquea con un logro (data/progression/unlocks.js)
  tags: ['tiempo'],
  description: 'Cuando te golpean, todo se rebobina: los enemigos se quedan quietos un momento.',
  modifiers: [],
  effects: [{ effect: 'freezeOnHurt', time: 1.2 }],
  icon: [
    'kkkkkkkk',
    'knnnnnnk',
    'kwkwwkwk',
    'kwwwwwwk',
    'knnnnnnk',
    'kgkkkkgk',
    'kkkkkkkk',
    '........',
  ],
};
