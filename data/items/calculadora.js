// Objeto: Calculadora Sin Pilas
export default {
  id: 'calculadora',
  name: 'Calculadora Sin Pilas',
  rarity: 'común',          // común | rara | legendaria
  pools: ['examen', 'general', 'minijefe'],
  tags: ['azar'],
  description: 'Cada onda hace entre la mitad y el triple de daño. Nunca sabes cuánto.',
  modifiers: [],
  effects: [{ effect: 'randomDamage', min: 0.5, max: 3 }],
  icon: [
    'gggggggg',
    'gccccccg',
    'gggggggg',
    'gkgkgkgg',
    'gggggggg',
    'gkgkgkgg',
    'gggggggg',
    'gkgkgrrg',
  ],
};
