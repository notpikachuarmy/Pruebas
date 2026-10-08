// Objeto: Petirrojo
export default {
  id: 'petirrojo',
  name: 'Petirrojo',
  rarity: 'rara',
  pools: ['bosque', 'general', 'boss'],
  tags: ['bosque', 'companero'],
  description: 'Un petirrojo vuela a tu lado y picotea con notas al enemigo más cercano.',
  modifiers: [],
  effects: [{ effect: 'familiar', kind: 'petirrojo', every: 0.8, damage: 0.6, color: '#eb5a3a', trail: '#6b4428' }],
};
