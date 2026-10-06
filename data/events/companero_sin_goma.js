export default {
  id: 'companero_sin_goma',
  dream: 'examen',
  prop: 'student',
  title: 'El compañero sin goma',
  text: [
    'Un chico del pupitre de al lado te susurra sin levantar la vista:',
    '«Oye… ¿me dejas algo para borrar?»',
  ],
  choices: [
    { label: 'Darle 3 de Lucidez', cost: { lucidity: 3 }, effect: 'favor', result: 'Te guiña un ojo. «Te debo una.»' },
    { label: 'Hacer como que no le oyes', result: 'Vuelve a mirar su examen, nervioso.' },
  ],
};
