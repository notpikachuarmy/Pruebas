// Objeto: Diapasón
export default {
  id: 'diapason',
  name: 'Diapasón',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['general', 'boss'],
  tags: ['afinacion'],
  description: 'Las ondas se curvan suavemente hacia el enemigo más cercano.',
  modifiers: [],
  effects: [{ effect: 'homing', turn: 2.6, range: 90 }],
  icon: [
    '.g...g..',
    '.g...g..',
    '.g...g..',
    '.g...g..',
    '..ggg...',
    '...g....',
    '...g....',
    '...k....',
  ],
};
