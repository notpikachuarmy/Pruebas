export default {
  id: 'huellas',
  dream: 'bosque',
  prop: 'tracks',
  title: 'Huellas de botas',
  text: [
    'En el barro hay huellas de botas, recientes. Y al lado, las de un perro grande.',
    'Van en la misma dirección que tú.',
  ],
  choices: [
    { label: 'Seguirlas de lejos (revela el plano)', effect: 'revealMap', result: 'Ahora sabes por dónde se mueven. Y por dónde no.' },
    { label: 'Borrarlas con las pezuñas (+8 Lucidez)', effect: 'lucidity', amount: 8, result: 'Que nadie sepa que has pasado por aquí.' },
  ],
};
