export default {
  id: 'album_fotos',
  dream: 'casa',
  prop: 'album',
  title: 'Un álbum abierto en la mesita',
  text: [
    'Fotos de cumpleaños, de playas, de una cocina llena de gente.',
    'Las últimas páginas están vacías.',
  ],
  choices: [
    { label: 'Llevarte una foto', effect: 'giveItem', item: 'foto_familia', result: 'Una familia entera sonríe en una cocina diminuta.' },
    { label: 'Hojear hasta el final (revela el plano)', effect: 'revealMap', result: 'En la última página alguien dibujó la casa entera.' },
  ],
};
