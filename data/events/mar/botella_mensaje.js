export default {
  id: 'botella_mensaje',
  dream: 'mar',
  prop: 'bottle',
  title: 'Una botella con un mensaje',
  text: [
    'Una botella encallada entre las rocas. Dentro hay un papel enrollado.',
    'La letra es temblorosa: «Si alguien encuentra esto…»',
  ],
  choices: [
    { label: 'Abrir la botella', effect: 'randomItem', pools: ['mar', 'general'], result: 'Junto al mensaje hay algo que alguien quiso salvar.' },
    { label: 'Devolverla al mar (+8 Lucidez)', effect: 'lucidity', amount: 8, result: 'Que la encuentre quien la necesite.' },
  ],
};
