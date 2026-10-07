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
    regla: 'assets/enemies/regla.png',
    interrogante_doble: 'assets/enemies/interrogante_doble.png',
    peluche: 'assets/enemies/peluche.png',
    cama: 'assets/bosses/cama.png',
    perfecto: 'assets/bosses/perfecto.png',
    tiles_dulce: 'assets/rooms/tiles_dulce.png',
    gominola: 'assets/enemies/gominola.png',
    piruleta: 'assets/enemies/piruleta.png',
    algodon: 'assets/enemies/algodon.png',
    osito: 'assets/enemies/osito.png',
    bombon: 'assets/enemies/bombon.png',
    tarta: 'assets/bosses/tarta.png',
    rey_caramelo: 'assets/bosses/rey_caramelo.png',
    fuente_chocolate: 'assets/bosses/fuente_chocolate.png',
    pinata: 'assets/bosses/pinata.png',
    tiles_mar: 'assets/rooms/tiles_mar.png',
    medusa: 'assets/enemies/medusa.png',
    pez_linterna: 'assets/enemies/pez_linterna.png',
    anguila: 'assets/enemies/anguila.png',
    pecesillo: 'assets/enemies/pecesillo.png',
    tentaculo: 'assets/enemies/tentaculo.png',
    mina: 'assets/enemies/mina.png',
    pulpo: 'assets/bosses/pulpo.png',
    tormenta: 'assets/bosses/tormenta.png',
    leviatan: 'assets/bosses/leviatan.png',
    barco: 'assets/bosses/barco.png',
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
    enemy_regla: {
      image: 'regla', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#ecc850', w: 12, h: 12 },
    },
    enemy_interrogante_doble: {
      image: 'interrogante_doble', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#d6403a', w: 12, h: 12 },
    },
    enemy_peluche: {
      image: 'peluche', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#966846', w: 12, h: 12 },
    },
    boss_cama: {
      image: 'cama', frameWidth: 48, frameHeight: 32, anchor: { x: 24, y: 31 },
      animations: { idle: { frames: [0, 0, 0, 1], fps: 3 }, peek: { frames: [2], fps: 1 } },
      placeholder: { color: '#6e8cc8', w: 44, h: 24 },
    },
    boss_perfecto: {
      image: 'perfecto', frameWidth: 32, frameHeight: 32, anchor: { x: 16, y: 26 },
      animations: { idle: { frames: [0, 1], fps: 2 }, walk: { frames: [2, 3, 4, 5], fps: 9 } },
      placeholder: { color: '#e0c060', w: 12, h: 20 },
    },
    enemy_gominola: {
      image: 'gominola', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#78dc78', w: 12, h: 12 },
    },
    enemy_piruleta: {
      image: 'piruleta', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#f0508c', w: 12, h: 12 },
    },
    enemy_algodon: {
      image: 'algodon', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#ffbedc', w: 12, h: 12 },
    },
    enemy_osito: {
      image: 'osito', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#ff5a5a', w: 12, h: 12 },
    },
    enemy_bombon: {
      image: 'bombon', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#5c3422', w: 12, h: 12 },
    },
    boss_tarta: {
      image: 'tarta', frameWidth: 32, frameHeight: 32, anchor: { x: 16, y: 31 },
      animations: { idle: { frames: [0, 1], fps: 4 }, jam: { frames: [2], fps: 1 } },
      placeholder: { color: '#ffd6e2', w: 26, h: 18 },
    },
    boss_rey: {
      image: 'rey_caramelo', frameWidth: 32, frameHeight: 40, anchor: { x: 16, y: 39 },
      animations: { idle: { frames: [0, 1], fps: 3 } },
      placeholder: { color: '#eb5a8c', w: 18, h: 36 },
    },
    boss_fuente: {
      image: 'fuente_chocolate', frameWidth: 40, frameHeight: 40, anchor: { x: 20, y: 38 },
      animations: { idle: { frames: [0, 1], fps: 4 } },
      placeholder: { color: '#6e3e28', w: 34, h: 36 },
    },
    boss_pinata: {
      image: 'pinata', frameWidth: 32, frameHeight: 32, anchor: { x: 16, y: 31 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#ff5a8c', w: 24, h: 22 },
    },
    enemy_medusa: {
      image: 'medusa', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 3 } },
      placeholder: { color: '#b48cff', w: 12, h: 12 },
    },
    enemy_pez_linterna: {
      image: 'pez_linterna', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 5 } },
      placeholder: { color: '#322e3c', w: 12, h: 12 },
    },
    enemy_anguila: {
      image: 'anguila', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 8 } },
      placeholder: { color: '#466e3c', w: 12, h: 12 },
    },
    enemy_pecesillo: {
      image: 'pecesillo', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 8 } },
      placeholder: { color: '#8cc8e6', w: 12, h: 12 },
    },
    enemy_tentaculo: {
      image: 'tentaculo', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 4 } },
      placeholder: { color: '#8c3c5a', w: 12, h: 12 },
    },
    enemy_mina: {
      image: 'mina', frameWidth: 16, frameHeight: 16, anchor: { x: 8, y: 15 },
      animations: { idle: { frames: [0, 1], fps: 2 } },
      placeholder: { color: '#3c4048', w: 12, h: 12 },
    },
    boss_pulpo: {
      image: 'pulpo', frameWidth: 32, frameHeight: 32, anchor: { x: 16, y: 31 },
      animations: { idle: { frames: [0, 1], fps: 4 } },
      placeholder: { color: '#aa4664', w: 24, h: 28 },
    },
    boss_tormenta: {
      image: 'tormenta', frameWidth: 48, frameHeight: 40, anchor: { x: 24, y: 39 },
      animations: { idle: { frames: [0, 0, 0, 1], fps: 4 } },
      placeholder: { color: '#3c4054', w: 44, h: 30 },
    },
    boss_leviatan: {
      image: 'leviatan', frameWidth: 48, frameHeight: 32, anchor: { x: 24, y: 31 },
      animations: { idle: { frames: [0, 0, 0, 1], fps: 3 }, peek: { frames: [2], fps: 1 } },
      placeholder: { color: '#0a1828', w: 44, h: 20 },
    },
    boss_barco: {
      image: 'barco', frameWidth: 48, frameHeight: 40, anchor: { x: 24, y: 39 },
      animations: { idle: { frames: [0, 1], fps: 2 } },
      placeholder: { color: '#503a28', w: 44, h: 30 },
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
    tiles_dulce: {
      image: 'tiles_dulce',
      size: 16,
      floor: 0,
      floorMargin: 1,
      wall: 2,
      wallFace: 3,         // pared de chocolate con nata
      solids: { D: 4, M: 5, L: 6, T: 7 }, // magdalena, tableta, árbol-piruleta, gominola gigante
    },
    tiles_mar: {
      image: 'tiles_mar',
      size: 16,
      floor: 0,
      floorMargin: 1,
      wall: 2,
      wallFace: 3,         // roca con línea de agua
      solids: { D: 4, M: 5, L: 6, T: 7 }, // roca, restos de barco, coral, ancla
    },
  },
};
