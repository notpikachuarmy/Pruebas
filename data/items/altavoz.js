// Objeto: Altavoz
export default {
  id: 'altavoz',
  name: 'Altavoz',
  rarity: 'común',          // común | rara | legendaria
  pools: ['general', 'minijefe'],
  tags: ['sonido', 'volumen'],
  description: 'Ondas más grandes y con más empuje, pero un poco más lentas de lanzar.',
  modifiers: [{ stat: 'shotSize', add: 1 }, { stat: 'knockback', mult: 1.6 }, { stat: 'fireRate', mult: 0.9 }, { stat: 'range', mult: 1.1 }],
  effects: [],
  icon: [
    '.kkkkkk.',
    '.kggggk.',
    '.kgkkgk.',
    '.kkddkk.',
    '.kkddkk.',
    '.kgkkgk.',
    '.kggggk.',
    '.kkkkkk.',
  ],
};
