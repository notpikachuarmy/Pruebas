// Objeto: Despertador de Repuesto
export default {
  id: 'despertador_repuesto',
  name: 'Despertador de Repuesto',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['examen', 'general', 'secret'],
  locked: true,          // se desbloquea con un logro (data/progression/unlocks.js)
  tags: ['vida'],
  description: 'Una vez por run, si te expulsan, vuelves con un corazón. «Cinco minutos más».',
  modifiers: [],
  effects: [{ effect: 'revive', hp: 2 }],
  icon: [
    'y......y',
    '.rrrrrr.',
    'rwwwwwwr',
    'rwwkwwwr',
    'rwwkkwwr',
    'rwwwwwwr',
    '.rrrrrr.',
    '.k....k.',
  ],
};
