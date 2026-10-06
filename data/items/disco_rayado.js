// Objeto: Disco Rayado
export default {
  id: 'disco_rayado',
  name: 'Disco Rayado',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['general'],
  tags: ['reflejo', 'repeticion'],
  description: 'A veces una onda se raya: llega a la mitad, da media vuelta y vuelve atravesándolo todo.',
  modifiers: [],
  effects: [{ effect: 'boomerang', chance: 0.3 }],
  icon: [
    '..kkkk..',
    '.kddddk.',
    'kddwdddk',
    'kddrrddk',
    'kddrrddk',
    'kdddwddk',
    '.kddddk.',
    '..kkkk..',
  ],
};
