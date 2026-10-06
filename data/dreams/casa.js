// Sueño 2: La Casa a Oscuras (una pesadilla)
// Se conserva el id 'casa' para no romper partidas guardadas.
export default {
  id: 'casa',
  tier: 2,                       // orden en la noche (1 = primer sueño)
  locked: true,                  // se desbloquea con el logro "Aprobado"
  name: 'La Casa a Oscuras',
  owner: {
    name: 'Lucía',
    age: 8,
    summary: 'Una noche sus padres se fueron y la casa se quedó vacía. Desde entonces no puede dormir con la luz apagada.',
  },
  concept: 'Una pesadilla infantil: la oscuridad, una casa demasiado grande y los recuerdos de unos padres que discutían y se iban.',
  palette: { background: '#0e0c18', accent: '#ffb347', paper: '#ece8da' },
  tileset: 'tiles_casa',
  music: { explore: 'casa_explore', combat: 'casa_combat', boss: 'casa_boss' },

  // Penumbra: el miedo a la oscuridad. Nadie espera: nadie se queda con ella.
  rules: ['penumbra', 'nadieEspera'],
  ruleConfig: {
    penumbra: { radius: 78, lamps: [1, 2] },
  },

  enemyPool: [
    { id: 'polilla', weight: 4 },
    { id: 'sombra', weight: 3 },
    { id: 'polvo', weight: 2.5 },
    { id: 'peluche', weight: 2.5 },
    { id: 'mecedora', weight: 1.5 },
    { id: 'telefono', weight: 1 },
    { id: 'polilla_gigante', weight: 1.5 },
  ],
  miniboss: 'armario',
  // Cada noche se elige uno de estos jefes al azar
  bosses: ['mesa_puesta', 'monstruo_cama', 'voces_pasillo'],
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
    { id: 'visita', unlock: 'visit', text: 'La luz del pasillo siempre se quedaba encendida. Hasta que dejó de hacerlo.' },
    { id: 'llamada', unlock: 'event:llamada_perdida', text: 'El contestador repite la misma frase de su madre: «Volvemos pronto, cariño». Es de hace mucho.' },
    { id: 'armario', unlock: 'miniboss', text: 'En el armario vive algo. Lucía lo sabe porque nadie vino nunca a comprobar que no estaba.' },
    { id: 'secreto', unlock: 'secret', text: 'Bajo la cama, una caja de dibujos. En todos hay tres personas. En los últimos, solo una.' },
    { id: 'mesa', unlock: 'boss', text: 'Por primera vez en mucho tiempo, alguien se queda con ella hasta que se duerme.' },
  ],

  text: {
    intro: 'Lucía tiene una pesadilla',
    wave: 'Susto {n} de {total}',
    cleared: 'La casa se queda en silencio',
    exitPrompt: 'Encender la luz',
    bossBoard: 'Cena para tres',
    bossBoardCleared: 'Alguien se ha quedado',
    transition: 'Lucía se duerme con la luz encendida.',
  },
};
