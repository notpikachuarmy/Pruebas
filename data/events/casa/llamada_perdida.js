export default {
  id: 'llamada_perdida',
  dream: 'casa',
  prop: 'phone',
  title: 'El contestador parpadea',
  text: [
    'Hay un mensaje sin escuchar. La lucecita roja parpadea despacio.',
    'Alguien lleva mucho tiempo sin pulsar ese botón.',
  ],
  choices: [
    { label: 'Escuchar el mensaje', effect: 'healFull', result: '«Mamá, el domingo vamos. Te lo prometo.» Te sientes mejor.' },
    { label: 'Llevarte la cinta (+8 Lucidez)', effect: 'lucidity', amount: 8, result: 'La cinta está gastada de tanto rebobinarla.' },
  ],
};
