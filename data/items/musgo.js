// Objeto: Musgo
export default {
  id: 'musgo',
  name: 'Musgo',
  rarity: 'común',
  pools: ['bosque', 'general'],
  tags: ['bosque', 'vida'],
  description: 'Al entrar por primera vez en una sala, un 35 % de recuperar medio corazón.',
  modifiers: [],
  effects: [{ effect: 'newRoomHeal', chance: 0.35 }],
};
