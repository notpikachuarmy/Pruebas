export default {
  id: 'llamada_perdida',
  dream: 'casa',
  prop: 'phone',
  title: 'El contestador parpadea',
  text: [
    'Un mensaje antiguo. La lucecita roja parpadea en la oscuridad.',
    'Lucía lo ha escuchado tantas veces que la cinta está gastada.',
  ],
  choices: [
    { label: 'Escuchar el mensaje', effect: 'healFull', result: '«Volvemos pronto, cariño.» Lucía se lo sabe de memoria. Te sientes mejor.' },
    { label: 'Llevarte la cinta (+8 Lucidez)', effect: 'lucidity', amount: 8, result: 'Así no tendrá que escucharlo más.' },
  ],
};
