export default {
  id: 'arroyo',
  dream: 'bosque',
  prop: 'stream',
  title: 'Un arroyo tranquilo',
  text: [
    'Agua fría entre las piedras. Por un momento no huele a humo.',
    'Bebes con las orejas tiesas, atento a cualquier ruido.',
  ],
  choices: [
    { label: 'Beber despacio (curarte del todo)', effect: 'healFull', result: 'El agua sabe a tierra y a hojas. Te sientes entero otra vez.' },
    { label: 'Buscar entre las piedras (+1 objeto)', effect: 'randomItem', pools: ['bosque'], result: 'Algo brilla en el fondo, entre los guijarros.' },
  ],
};
