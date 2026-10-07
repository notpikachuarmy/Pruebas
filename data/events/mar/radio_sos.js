export default {
  id: 'radio_sos',
  dream: 'mar',
  prop: 'radio',
  title: 'La radio del barco',
  text: [
    'Una radio vieja crepita sobre un cajón: «…mayday… aquí el Esperanza…»',
    'Es su propia voz. De aquella noche.',
  ],
  choices: [
    { label: 'Contestar la llamada (revela el plano)', effect: 'revealMap', result: '«Te oímos, Esperanza. Vamos a por vosotros.» Ahora sabes dónde está todo.' },
    { label: 'Apagarla', effect: 'healFull', result: 'Silencio. Respiras hondo. Te sientes mejor.' },
  ],
};
