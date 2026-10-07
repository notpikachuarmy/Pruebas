// Sinergia: Gran Final
export default {
  id: 'gran_final',
  name: 'Gran Final',
  requires: ['bis', 'megafono'],
  description: 'Más daño y más cadencia: el concierto termina a lo grande.',
  modifiers: [{ stat: 'damage', mult: 1.15 }, { stat: 'fireRate', mult: 1.1 }],
};
