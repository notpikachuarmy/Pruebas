// Manifiesto de assets: qué archivos existen y cómo se trocean.
// Para sustituir un placeholder basta con cambiar el PNG (o la ruta) aquí; el código no cambia.
export default {
  images: {
    protagonista: 'assets/player/protagonista.png',
    tachon: 'assets/enemies/tachon.png',
    tiles_examen: 'assets/rooms/tiles_examen.png',
  },

  sprites: {
    player: {
      image: 'protagonista',
      frameWidth: 32, frameHeight: 32,
      anchor: { x: 16, y: 26 },        // punto de los pies
      animations: {
        idle: { frames: [0, 1], fps: 1.6 },
        walk: { frames: [2, 3, 4, 5], fps: 9 },
      },
      placeholder: { color: '#eb2f2d', w: 12, h: 20 },
    },
    enemy_tachon: {
      image: 'tachon',
      frameWidth: 16, frameHeight: 16,
      anchor: { x: 8, y: 14 },
      animations: { idle: { frames: [0, 1], fps: 6 } },
      placeholder: { color: '#25307a', w: 12, h: 12 },
    },
  },

  tilesets: {
    tiles_examen: {
      image: 'tiles_examen',
      size: 16,
      floor: 0,
      floorMargin: 1,      // suelo con margen rojo de cuaderno
      wall: 2,
      wallFace: 3,         // pared con suelo debajo (cara visible)
      solids: { D: 4, T: 5, L: 6 }, // obstáculos: pupitre, taquilla, pila de libros
    },
  },
};
