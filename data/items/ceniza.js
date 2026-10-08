// Objeto: Ceniza
export default {
  id: 'ceniza',
  name: 'Ceniza',
  rarity: 'rara',
  pools: ['bosque', 'general', 'boss'],
  tags: ['bosque', 'fuego'],
  description: 'Los enemigos que disipas dejan un rescoldo que quema a los demás.',
  modifiers: [],
  effects: [{ effect: 'killFire', radius: 14, life: 3 }],
};
