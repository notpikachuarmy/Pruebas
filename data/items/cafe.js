// Objeto: Café de Máquina
export default {
  id: 'cafe',
  name: 'Café de Máquina',
  rarity: 'común',          // común | rara | legendaria
  pools: ['examen', 'general'],
  tags: ['velocidad'],
  description: 'Te mueves más rápido y el Silencio recarga antes.',
  modifiers: [{ stat: 'speed', mult: 1.2 }, { stat: 'dashCooldown', mult: 0.75 }],
  effects: [],
  icon: [
    '..w.w...',
    '...w.w..',
    '.wwwww..',
    '.wnnnwww',
    '.wnnnw.w',
    '.wnnnwww',
    '.wwwww..',
    '........',
  ],
};
