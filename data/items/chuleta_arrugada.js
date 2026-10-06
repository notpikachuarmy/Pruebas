// Objeto: Chuleta Arrugada
export default {
  id: 'chuleta_arrugada',
  name: 'Chuleta Arrugada',
  rarity: 'común',          // común | rara | legendaria
  pools: ['examen'],
  tags: ['mapa'],
  description: 'Revela el plano del sueño, incluida la sala secreta.',
  modifiers: [],
  effects: [{ effect: 'revealMap', secret: true }],
  icon: [
    '.wwwww..',
    'wwbwbww.',
    'wbbbbwk.',
    '.wwbbww.',
    'wwbwbwk.',
    '.wbbbww.',
    'wwwwwk..',
    '..kk....',
  ],
};
