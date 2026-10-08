// Sinergia: Rey del Bosque
export default {
  id: 'rey_bosque',
  name: 'Rey del Bosque',
  requires: ['asta', 'corazon_salvaje'],
  description: 'La embestida de la Asta golpea más fuerte y el Silencio recarga antes.',
  modifiers: [{ stat: 'dashCooldown', mult: 0.8 }],
};
