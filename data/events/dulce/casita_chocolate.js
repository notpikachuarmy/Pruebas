export default {
  id: 'casita_chocolate',
  dream: 'dulce',
  prop: 'house',
  title: 'Una casita de chocolate',
  text: [
    'Tejas de galleta, ventanas de caramelo y una puerta de turrón.',
    'Nadie dice que no puedas darle un mordisco.',
  ],
  choices: [
    { label: 'Darle un buen mordisco', effect: 'healFull', result: 'Delicioso. Te sientes como nuevo.' },
    { label: 'Llevarte unas tejas (+10 Lucidez)', effect: 'lucidity', amount: 10, result: 'Crujen en el bolsillo.' },
  ],
};
