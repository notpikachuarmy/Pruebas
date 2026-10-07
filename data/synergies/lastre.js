// Sinergia: Lastre
export default {
  id: 'lastre',
  name: 'Lastre',
  requires: ['ancla', 'subwoofer'],
  description: 'Todo pesa más: las notas golpean y empujan aún más.',
  modifiers: [{ stat: 'damage', add: 0.4 }, { stat: 'knockback', mult: 1.3 }],
};
