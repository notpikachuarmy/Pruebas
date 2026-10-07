// Objeto: Metrónomo
export default {
  id: 'metronomo',
  name: 'Metrónomo',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['examen', 'general', 'boss'],
  tags: ['ritmo'],
  description: 'Si disparas sin parar, cada cuarta onda golpea el triple.',
  modifiers: [],
  effects: [{ effect: 'metronome', every: 4, mult: 3 }],
  icon: [
    '...kk...',
    '...kk...',
    '..knnk..',
    '..knyk..',
    '.knnynk.',
    '.knnnnk.',
    'kkkkkkkk',
    '........',
  ],
};
