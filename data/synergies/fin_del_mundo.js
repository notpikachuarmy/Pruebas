// Sinergia: Fin del Mundo
export default {
  id: 'fin_del_mundo',
  name: 'Fin del Mundo',
  requires: ['llama_muspel', 'gjallarhorn'],
  description: 'El cuerno suena y el mundo arde: más daño y las notas vuelan más rápido.',
  modifiers: [{ stat: 'damage', mult: 1.2 }, { stat: 'shotSpeed', mult: 1.15 }],
};
