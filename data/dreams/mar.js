// Sueño 4: Mar Adentro (pesadilla con talasofobia)
export default {
  id: 'mar',
  tier: 4,
  locked: true,                  // se desbloquea con el logro "Diente dulce"
  name: 'Mar Adentro',
  owner: {
    name: 'Tomás',
    age: 56,
    summary: 'Marinero de toda la vida. El año pasado su pesquero volcó en un temporal y pasó horas flotando en mar abierto. Desde entonces no puede mirar el agua.',
  },
  concept: 'Talasofobia: la inmensidad, la oscuridad que crece con la profundidad y, sobre todo, no saber qué hay debajo.',
  palette: { background: '#08141f', accent: '#8fd3ff', paper: '#c9e8ff' },
  tileset: 'tiles_mar',
  music: { explore: 'mar_explore', combat: 'mar_combat', boss: 'mar_boss' },

  // El abismo: cuanto más lejos del inicio, más oscuro. Corrientes: el agua te arrastra.
  rules: ['abismo', 'corrientes'],
  ruleConfig: {
    abismo: { base: 150, perDepth: 18, min: 62 },
    corrientes: { chance: 0.55, strength: [22, 38] },
  },

  enemyPool: [
    { id: 'pecesillo', weight: 4 },
    { id: 'medusa', weight: 3.5 },
    { id: 'anguila', weight: 3 },
    { id: 'pez_linterna', weight: 2.5 },
    { id: 'mina', weight: 1.5 },
    { id: 'tentaculo', weight: 1.5 },
    { id: 'medusa_gigante', weight: 1.2 },
  ],
  miniboss: 'pulpo',
  bosses: ['tormenta', 'leviatan', 'barco_hundido'],
  eventPool: ['radio_sos', 'botella_mensaje'],

  roomPool: [
    'mar_cubierta', 'mar_arrecife', 'mar_rocas', 'mar_pecio',
    'mar_fosa', 'mar_corales', 'mar_bodega', 'mar_mar_abierto',
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
    roleCaps: { trampa: 2 },
    clearDrop: { chance: 0.45, table: [{ type: 'lucidity', weight: 3, amount: [2, 5] }, { type: 'heart', weight: 1, amount: [1, 1] }] },
  },

  shop: [
    { product: 'halfHeart', price: 3 },
    { product: 'heart', price: 5 },
    { product: 'container', price: 15 },
  ],

  fragments: [
    { id: 'visita', unlock: 'visit', text: 'El agua está fría. No se ve el fondo. Nunca se ve el fondo.' },
    { id: 'radio', unlock: 'event:radio_sos', text: '«Mayday, mayday. Aquí el Esperanza.» Nadie contestó durante tres horas.' },
    { id: 'pulpo', unlock: 'miniboss', text: 'Su padre también fue marinero. Le enseñó a nadar tirándolo desde el muelle.' },
    { id: 'secreto', unlock: 'secret', text: 'Una foto plastificada: Tomás y su tripulación, sonriendo en la cubierta. Dos de ellos no volvieron.' },
    { id: 'jefe', unlock: 'boss', text: 'Por primera vez desde aquella noche, Tomás mira el mar sin apartar la vista.' },
  ],

  text: {
    intro: 'Tomás está soñando con el mar',
    wave: 'Ola {n} de {total}',
    cleared: 'El agua se calma',
    exitPrompt: 'Salir a la superficie',
    minibossTitle: 'Algo vive en el pecio',
    bossBoard: 'Mar abierto',
    bossBoardCleared: 'Mar en calma',
    transition: 'Tomás respira hondo, en tierra firme.',
  },
};
