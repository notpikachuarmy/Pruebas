export default {
  id: 'revision_examen',
  dream: 'examen',
  prop: 'papers',
  title: 'Revisión de examen',
  text: [
    'Sobre la mesa hay un montón de exámenes corregidos. El tuyo está arriba.',
    'Podrías pedir revisión… pero eso siempre cuesta algo.',
  ],
  choices: [
    { label: 'Pedir revisión (−1 corazón máximo, +12 Lucidez)', requires: { maxHp: 4 }, effect: 'review', result: 'Te suben la nota. Te sientes un poco más pequeño.' },
    { label: 'Aceptar la nota', result: 'Doblas el examen y lo guardas en el bolsillo.' },
  ],
};
