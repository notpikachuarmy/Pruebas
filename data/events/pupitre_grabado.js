export default {
  id: 'pupitre_grabado',
  dream: 'examen',
  prop: 'desk',
  title: 'Un pupitre con algo grabado',
  text: [
    'Alguien ha rayado la madera con la punta de un compás:',
    '«Í + ¿?»  Debajo hay un dibujo diminuto, como un plano.',
  ],
  choices: [
    { label: 'Mirar el dibujo de cerca', effect: 'revealMap', result: 'Es el plano de este sueño. Ahora sabes dónde está todo.' },
    { label: 'Dejarlo estar', result: 'Hay cosas que es mejor no saber todavía.' },
  ],
};
