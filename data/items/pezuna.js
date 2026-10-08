// Objeto: Pezuña Veloz
export default {
  id: 'pezuna',
  name: 'Pezuña Veloz',
  rarity: 'común',
  pools: ['bosque', 'general', 'minijefe'],
  tags: ['bosque', 'velocidad'],
  description: 'Corres más y el Silencio te lleva más lejos.',
  modifiers: [{ stat: 'speed', mult: 1.12 }, { stat: 'dashSpeed', mult: 1.25 }],
  effects: [],
};
