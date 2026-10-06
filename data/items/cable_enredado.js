// Objeto: Cable Enredado
export default {
  id: 'cable_enredado',
  name: 'Cable Enredado',
  rarity: 'común',          // común | rara | legendaria
  pools: ['examen', 'general'],
  tags: ['forma'],
  description: 'Las ondas avanzan en zigzag y atraviesan a un enemigo.',
  modifiers: [],
  effects: [{ effect: 'zigzag', amp: 6, freq: 15 }, { effect: 'pierce', count: 1 }],
  icon: [
    'kk......',
    '.k..kk..',
    '.k.k..k.',
    '..k...k.',
    '.....k..',
    '..kk.k..',
    '.k..k...',
    '.k......',
  ],
};
