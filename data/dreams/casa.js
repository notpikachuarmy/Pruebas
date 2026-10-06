// Sueño 2: La Casa que se Vacía
export default {
  id: 'casa',
  tier: 2,                       // orden en la noche (1 = primer sueño)
  locked: true,                  // se desbloquea (ver data/progression/unlocks.js)
  name: 'La Casa que se Vacía',
  owner: {
    name: 'Carmen',
    age: 81,
    summary: 'Viuda desde hace seis años. Sus hijos viven lejos. Cada domingo pone la mesa para todos.',
  },
  concept: 'La soledad. Nada ataca con prisa: las cosas se apagan, se van o se quedan quietas esperando.',
  palette: { background: '#141220', accent: '#ffb347', paper: '#ece8da' },
  tileset: 'tiles_casa',
  music: { explore: 'casa_explore', combat: 'casa_combat', boss: 'casa_boss' },

  rules: ['penumbra', 'nadieEspera'],
  ruleConfig: {
    penumbra: { radius: 78, lamps: [1, 2] },
  },

  enemyPool: [
    { id: 'polilla', weight: 4 },
    { id: 'sombra', weight: 3 },
    { id: 'polvo', weight: 3 },
    { id: 'mecedora', weight: 1.5 },
    { id: 'telefono', weight: 1 },
  ],
  miniboss: 'armario',
  boss: 'mesa_puesta',
  eventPool: ['llamada_perdida', 'album_fotos'],

  roomPool: [
    'casa_recibidor', 'casa_salon', 'casa_comedor', 'casa_pasillo_largo',
    'casa_dormitorio', 'casa_cocina', 'casa_trastero', 'casa_comedor_grande',
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
    miniboss: 0.4,               // probabilidad de que la antesala del jefe tenga mini-jefe
    challengeChance: 0.5,
    secret: true,
    budget: { base: 3, perDepth: 1, wavesEvery: 2, maxWaves: 3, maxPerWave: 9, delayBetweenWaves: 1.3 },
    roleCaps: { modificador: 1, trampa: 2 },
    clearDrop: { chance: 0.45, table: [{ type: 'lucidity', weight: 3, amount: [2, 5] }, { type: 'heart', weight: 1, amount: [1, 1] }] },
  },

  shop: [
    { product: 'halfHeart', price: 3 },
    { product: 'heart', price: 5 },
    { product: 'container', price: 15 },
  ],

  // Registro de soñadores: fragmentos que se descubren jugando
  fragments: [
    { id: 'visita', unlock: 'visit', text: 'La casa huele a cerrado y a colonia de hombre.' },
    { id: 'llamada', unlock: 'event:llamada_perdida', text: 'El contestador tiene once mensajes. Todos dicen «Mamá, ya te llamo el domingo».' },
    { id: 'armario', unlock: 'miniboss', text: 'En el armario sigue su chaqueta de los domingos. Nadie la ha movido.' },
    { id: 'secreto', unlock: 'secret', text: 'Detrás del papel pintado: las marcas de altura de tres niños.' },
    { id: 'mesa', unlock: 'boss', text: 'Seis platos. Esta vez hay alguien en una de las sillas.' },
  ],

  text: {
    intro: 'Carmen está soñando con su casa',
    wave: 'Visita {n} de {total}',
    cleared: 'La casa vuelve a estar en silencio',
    exitPrompt: 'Abrir las cortinas',
    bossBoard: 'Mesa para seis',
    bossBoardCleared: 'Mesa para dos',
    transition: 'Carmen duerme tranquila.',
  },
};
