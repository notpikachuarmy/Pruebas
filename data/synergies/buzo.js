// Sinergia: Buzo
export default {
  id: 'buzo',
  name: 'Buzo',
  requires: ['bombona_oxigeno', 'salvavidas'],
  description: 'Te mueves más rápido y aguantas más tras un golpe.',
  modifiers: [{ stat: 'speed', mult: 1.15 }, { stat: 'hurtInvulnerability', mult: 1.3 }],
};
