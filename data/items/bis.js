// Objeto: ¡Bis!
export default {
  id: 'bis',
  name: '¡Bis!',
  rarity: 'rara',
  pools: ['general', 'boss'],
  tags: ['musica', 'ritmo'],
  description: 'Al limpiar una sala, durante 6 segundos disparas el doble de rápido. ¡Otra, otra!',
  modifiers: [],
  effects: [{ effect: 'encore', time: 6, mult: 2 }],
};
