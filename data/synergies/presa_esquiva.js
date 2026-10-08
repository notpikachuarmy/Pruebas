// Sinergia: Presa Esquiva
export default {
  id: 'presa_esquiva',
  name: 'Presa Esquiva',
  requires: ['huida', 'pezuna'],
  description: 'Nadie te alcanza: un Silencio más acumulado.',
  modifiers: [{ stat: 'dashCharges', add: 1 }],
};
