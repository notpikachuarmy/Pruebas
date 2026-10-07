// Sinergia: Director de Orquesta
export default {
  id: 'director',
  name: 'Director de Orquesta',
  requires: ['batuta', 'diapason'],
  description: 'Las notas vuelan más rápido.',
  modifiers: [{ stat: 'shotSpeed', mult: 1.25 }],
};
