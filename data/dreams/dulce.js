// Sueño 3: El País de las Chuches (un sueño dulce)
export default {
  id: 'dulce',
  tier: 3,
  locked: true,                  // se desbloquea con el logro "Ya no estás sola"
  name: 'El País de las Chuches',
  owner: {
    name: 'Martina',
    age: 6,
    summary: 'Se ha quedado dormida con la corona de papel puesta, después de la mejor fiesta de cumpleaños de su vida.',
  },
  concept: 'Un sueño feliz y empalagoso. Nada da miedo de verdad: todo va demasiado rápido y todo es demasiado dulce.',
  palette: { background: '#2a1630', accent: '#ff6aa0', paper: '#fad6e2' },
  tileset: 'tiles_dulce',
  music: { explore: 'dulce_explore', combat: 'dulce_combat', boss: 'dulce_boss' },

  rules: ['subidonAzucar', 'todoEsGolosina'],
  ruleConfig: {
    subidonAzucar: { enemySpeed: 1.15, playerSpeed: 1.15, fireRate: 1.1 },
    todoEsGolosina: { chance: 0.35 },
  },

  enemyPool: [
    { id: 'osito', weight: 4 },
    { id: 'gominola', weight: 3.5 },
    { id: 'piruleta', weight: 3 },
    { id: 'algodon', weight: 1.5 },
    { id: 'bombon', weight: 1.5 },
  ],
  miniboss: 'tarta',
  bosses: ['rey_caramelo', 'fuente_chocolate', 'pinata'],
  eventPool: ['puesto_chuches', 'casita_chocolate'],

  roomPool: [
    'dulce_entrada', 'dulce_pasteleria', 'dulce_tabletas', 'dulce_bosque_piruletas',
    'dulce_gominolas', 'dulce_fabrica', 'dulce_tienda_chuches', 'dulce_salon_trono',
  ],

  floor: {
    rooms: [9, 12],
    minBossDepth: 4,
    specials: [
      { type: 'reward', required: true },
      { type: 'shop', required: true, minDepth: 2 },
      { type: 'event', chance: 0.9, minDepth: 1 },
      { type: 'healing', chance: 0.5, minDepth: 2 },
    ],
    miniboss: 0.5,
    challengeChance: 0.5,
    secret: true,
    budget: { base: 3, perDepth: 1, wavesEvery: 2, maxWaves: 3, maxPerWave: 9, delayBetweenWaves: 1.1 },
    roleCaps: { modificador: 1, tanque: 1 },
    clearDrop: { chance: 0.5, table: [{ type: 'lucidity', weight: 4, amount: [2, 5] }, { type: 'heart', weight: 1, amount: [1, 1] }] },
  },

  shop: [
    { product: 'halfHeart', price: 3 },
    { product: 'heart', price: 5 },
    { product: 'container', price: 14 },
  ],

  fragments: [
    { id: 'visita', unlock: 'visit', text: 'Todo huele a algodón de azúcar. Hasta las paredes se pueden chupar.' },
    { id: 'puesto', unlock: 'event:puesto_chuches', text: 'En este país, las chuches no se pagan con dinero: se pagan con risas.' },
    { id: 'tarta', unlock: 'miniboss', text: 'Seis velas. Pidió el mismo deseo que el año pasado y todavía no se lo cuenta a nadie.' },
    { id: 'secreto', unlock: 'secret', text: 'Debajo de la mesa de los regalos, una carta: «Para Martina, de los abuelos». Aún no la ha abierto.' },
    { id: 'jefe', unlock: 'boss', text: 'Mañana le dolerá la tripa. Esta noche, da igual.' },
  ],

  text: {
    intro: 'Martina está soñando con chuches',
    wave: 'Ronda {n} de {total}',
    cleared: '¡Todo para mí!',
    exitPrompt: 'Despertar con una sonrisa',
    minibossTitle: 'Pide un deseo',
    bossBoard: '¡Viva el rey!',
    bossBoardCleared: 'Cada cosa a su hora',
    transition: 'Martina sonríe en sueños.',
  },
};
