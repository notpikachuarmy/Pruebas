export default {
  id: 'puesto_chuches',
  dream: 'dulce',
  prop: 'stall',
  title: 'El puesto de chuches',
  text: [
    'Un puesto con tarros de todos los colores. El dependiente es un regaliz muy serio.',
    '«Un tarro sorpresa, seis de Lucidez. No se aceptan devoluciones.»',
  ],
  choices: [
    { label: 'Comprar un tarro sorpresa (6 Lucidez)', cost: { lucidity: 6 }, effect: 'randomItem', pools: ['dulce', 'general'], result: 'Dentro hay algo que no es exactamente una chuche.' },
    { label: 'Pedir una muestra gratis', effect: 'healHalf', result: 'Te da medio regaliz. Sabe a gloria.' },
  ],
};
