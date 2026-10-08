// Sueño 6: El Bosque en Llamas (la pesadilla de un ciervo)
export default {
  id: 'bosque',
  tier: 6,
  locked: true,                  // se desbloquea con el logro "Ragnarök evitado"
  name: 'El Bosque en Llamas',
  owner: {
    name: 'Un ciervo',
    age: null,
    summary: 'Un ciervo joven del bosque del norte. No sueña con exámenes ni con casas vacías: sueña con lo que de verdad puede matarlo.',
  },
  concept: 'La pesadilla de un animal salvaje: cepos escondidos en la hojarasca, cazadores, depredadores y, al fondo, el humo de un incendio que avanza.',
  palette: { background: '#0e140c', accent: '#e08a3c', paper: '#e6dcc0' },
  tileset: 'tiles_bosque',
  music: { explore: 'bosque_explore', combat: 'bosque_combat', boss: 'bosque_boss' },

  // Trampas: cepos ocultos en el suelo (crúzalos con el Silencio). Incendio: ramas ardiendo en los combates.
  // Instinto de presa: corres un poco más y el Silencio recarga antes.
  rules: ['trampas', 'incendio', 'instintoPresa'],
  ruleConfig: {
    trampas: { count: [1, 3] },
    incendio: { every: 4.5, minDepth: 2 },
  },

  enemyPool: [
    { id: 'perro', weight: 3.5 },
    { id: 'lobo', weight: 3.5 },
    { id: 'cazador', weight: 2.5 },
    { id: 'cepo', weight: 1.5 },
    { id: 'pavesa', weight: 2 },
    { id: 'aguila', weight: 1.5 },
    { id: 'oso', weight: 1.2 },
  ],
  miniboss: 'trampero',
  bosses: ['el_cazador', 'el_incendio', 'lobo_gris'],
  eventPool: ['arroyo', 'huellas'],

  roomPool: [
    'bosque_claro_inicio', 'bosque_espesura', 'bosque_arroyo', 'bosque_zarzas',
    'bosque_rocas', 'bosque_campamento', 'bosque_madriguera', 'bosque_gran_claro',
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
    budget: { base: 3, perDepth: 1, wavesEvery: 2, maxWaves: 3, maxPerWave: 9, delayBetweenWaves: 1.2 },
    roleCaps: { trampa: 2, tanque: 1 },
    clearDrop: { chance: 0.45, table: [{ type: 'lucidity', weight: 3, amount: [2, 5] }, { type: 'heart', weight: 1, amount: [1, 1] }] },
  },

  shop: [
    { product: 'halfHeart', price: 3 },
    { product: 'heart', price: 5 },
    { product: 'container', price: 15 },
  ],

  fragments: [
    { id: 'visita', unlock: 'visit', text: 'Huele a pólvora y a humo. El ciervo no sabe qué es un sueño: para él, todo esto es real.' },
    { id: 'arroyo', unlock: 'event:arroyo', text: 'Su madre le enseñó a beber con una oreja siempre hacia atrás.' },
    { id: 'trampero', unlock: 'miniboss', text: 'El verano pasado vio a un zorro con la pata atrapada. Estuvo allí dos días.' },
    { id: 'secreto', unlock: 'secret', text: 'Una madriguera vacía, caliente todavía. Aquí durmió una vez, cuando era un cervatillo.' },
    { id: 'jefe', unlock: 'boss', text: 'Empieza a llover sobre el bosque. El ciervo se tumba entre los helechos y, por fin, duerme sin miedo.' },
  ],

  text: {
    intro: 'Un ciervo está soñando con el bosque',
    wave: 'Acecho {n} de {total}',
    cleared: 'El bosque se calla',
    exitPrompt: 'Huir más adentro',
    minibossTitle: 'Alguien ha puesto trampas',
    bossBoard: 'El bosque en llamas',
    bossBoardCleared: 'Llueve sobre el bosque',
    transition: 'El ciervo levanta la cabeza. Solo era el viento.',
  },
};
