// Objeto: Bellota
export default {
  id: 'bellota',
  name: 'Bellota',
  rarity: 'común',
  pools: ['bosque', 'general', 'minijefe'],
  tags: ['bosque', 'vida'],
  description: 'Al limpiar una sala, un 30 % de recuperar medio corazón.',
  modifiers: [],
  effects: [{ effect: 'clearHeal', chance: 0.3, amount: 1 }],
};
