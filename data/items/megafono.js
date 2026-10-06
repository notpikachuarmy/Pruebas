// Objeto: Megáfono
export default {
  id: 'megafono',
  name: 'Megáfono',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['general'],
  tags: ['sonido', 'volumen'],
  description: 'Cada sexta onda va acompañada de un anillo de ondas pequeñas a tu alrededor.',
  modifiers: [],
  effects: [{ effect: 'ring', every: 6, count: 8 }],
  icon: [
    '......k.',
    '....kkw.',
    '..kkwww.',
    'kkrwwww.',
    'kkrwwww.',
    '..kkwww.',
    '....kkw.',
    '......k.',
  ],
};
