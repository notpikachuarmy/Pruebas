// Sinergia: Jam Session
export default {
  id: 'jam_session',
  name: 'Jam Session',
  requires: ['eco', 'metronomo', 'partitura'],
  description: 'Tres músicos a la vez: más cadencia y más daño.',
  modifiers: [{ stat: 'fireRate', mult: 1.2 }, { stat: 'damage', mult: 1.1 }],
};
