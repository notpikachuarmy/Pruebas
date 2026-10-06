// Manifiesto de assets: qué archivos existen y cómo se trocean.
// Para sustituir un placeholder basta con cambiar el PNG (o la ruta) aquí; el código no cambia.
export default {
  images: {
    protagonista: 'assets/player/protagonista.png',
    tachon: 'assets/enemies/tachon.png',
    tiles_examen: 'assets/rooms/tiles_examen.png',
    tachon_rojo: 'assets/enemies/tachon_rojo.png',
    interrogante: 'assets/enemies/interrogante.png',
    goma: 'assets/enemies/goma.png',
    chuleta: 'assets/enemies/chuleta.png',
    compas: 'assets/enemies/compas.png',
    reloj: 'assets/enemies/reloj.png',
    copia: 'assets/enemies/copia.png',
    fotocopiadora: 'assets/bosses/fotocopiadora.png',
    profesora: 'assets/bosses/profesora.png',
    tiles_casa: 'assets/rooms/tiles_casa.png',
    polilla: 'assets/enemies/polilla.png',
    sombra: 'assets/enemies/sombra.png',
    telefono: 'assets/enemies/telefono.png',
    mecedora: 'assets/enemies/mecedora.png',
    polvo: 'assets/enemies/polvo.png',
    armario: 'assets/bosses/armario.png',
    mesa_puesta: 'assets/bosses/mesa_puesta.png',
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
    enemy_tachon_rojo: {
      image: 'tachon_rojo', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#d6403a', w: 12, h: 12 },
    },
    enemy_interrogante: {
      image: 'interrogante', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#25307a', w: 12, h: 12 },
    },
    enemy_goma: {
      image: 'goma', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#e896a0', w: 12, h: 12 },
    },
    enemy_chuleta: {
      image: 'chuleta', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#f0ecd6', w: 12, h: 12 },
    },
    enemy_compas: {
      image: 'compas', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#969fae', w: 12, h: 12 },
    },
    enemy_reloj: {
      image: 'reloj', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#d6403a', w: 12, h: 12 },
    },
    enemy_copia: {
      image: 'copia', frameWidth: 32, frameHeight: 32, anchor: { x: 16, y: 26 },
      animations: { idle: { frames: [2, 3, 4, 5], fps: 9 } },
      placeholder: { color: '#25307a', w: 12, h: 20 },
    },
    boss_fotocopiadora: {
      image: 'fotocopiadora', frameWidth: 32, frameHeight: 28, anchor: { x: 16, y: 26 },
      animations: { idle: { frames: [0, 1], fps: 3 }, jam: { frames: [2], fps: 1 } },
      placeholder: { color: '#b4b8be', w: 28, h: 22 },
    },
    boss_profesora: {
      image: 'profesora', frameWidth: 40, frameHeight: 48, anchor: { x: 20, y: 46 },
      animations: { idle: { frames: [0, 1], fps: 2 } },
      placeholder: { color: '#2e2c36', w: 36, h: 44 },
    },
    enemy_polilla: {
      image: 'polilla', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 12 } },
      placeholder: { color: '#c4b696', w: 12, h: 12 },
    },
    enemy_sombra: {
      image: 'sombra', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#28243e', w: 12, h: 12 },
    },
    enemy_telefono: {
      image: 'telefono', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#b04034', w: 12, h: 12 },
    },
    enemy_mecedora: {
      image: 'mecedora', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#7e5432', w: 12, h: 12 },
    },
    enemy_polvo: {
      image: 'polvo', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#96928c', w: 12, h: 12 },
    },
    boss_armario: {
      image: 'armario', frameWidth: 32, frameHeight: 32, anchor: { x: 16, y: 31 },
      animations: { idle: { frames: [0, 1], fps: 2 }, jam: { frames: [2], fps: 1 } },
      placeholder: { color: '#64422c', w: 26, h: 30 },
    },
    boss_mesa_puesta: {
      image: 'mesa_puesta', frameWidth: 48, frameHeight: 40, anchor: { x: 24, y: 39 },
      animations: { idle: { frames: [0, 1], fps: 3 } },
      placeholder: { color: '#ece8da', w: 44, h: 30 },
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
    tiles_casa: {
      image: 'tiles_casa',
      size: 16,
      floor: 0,
      floorMargin: 0,
      wall: 2,
      wallFace: 3,
      solids: { D: 4, T: 7, L: 6, M: 5 }, // sofá, cómoda, planta, mesa (mismos símbolos que el examen)
    },
  },
};
