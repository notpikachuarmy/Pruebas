// Objeto: Panal
export default {
  id: 'panal',
  name: 'Panal',
  rarity: 'común',
  pools: ['bosque', 'general', 'minijefe'],
  tags: ['bosque', 'control'],
  description: 'Los enemigos que golpeas se quedan pegados: van a mitad de velocidad 2 s.',
  modifiers: [],
  effects: [{ effect: 'slowOnHit', time: 2 }],
};
