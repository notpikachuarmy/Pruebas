export default {
  id: 'album_fotos',
  dream: 'casa',
  prop: 'album',
  title: 'Una caja de dibujos',
  text: [
    'Dibujos con ceras: una casa, un sol y tres personas cogidas de la mano.',
    'Cuanto más al fondo, menos personas hay en ellos.',
  ],
  choices: [
    { label: 'Llevarte el primer dibujo', effect: 'giveItem', item: 'foto_familia', result: 'Tres personas sonríen. Alguien escribió debajo: «MI FAMILIA».' },
    { label: 'Mirar el último dibujo (revela el plano)', effect: 'revealMap', result: 'Solo está ella. Y un plano de la casa, por si se pierde a oscuras.' },
  ],
};
