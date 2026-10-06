// Objeto: Doble Bombo
export default {
  id: 'doble_bombo',
  name: 'Doble Bombo',
  rarity: 'rara',
  pools: ['examen', 'casa', 'general'],
  tags: ['silencio', 'ritmo'],
  description: 'Acumulas dos Silencios: puedes esquivar dos veces seguidas. Se recargan de uno en uno.',
  modifiers: [{ stat: 'dashCharges', add: 1 }],
  effects: [],
  icon: ['.kkk.kkk', 'krrrkrrr', 'kwwwkwww', 'kwkwkwkw', 'kwwwkwww', 'krrrkrrr', '.kkk.kkk', '.k.k.k.k'],
};
