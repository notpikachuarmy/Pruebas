// Sueño final: Ragnarök. Siempre cierra la noche (final: true).
export default {
  id: 'ragnarok',
  tier: 5,
  final: true,                   // siempre el último sueño de la noche
  locked: true,                  // se desbloquea con el logro "El ocaso se acerca"
  name: 'Ragnarök',
  owner: {
    name: 'Todos los soñadores',
    age: null,
    summary: 'Íñigo, Lucía, Martina, Tomás… y todos los demás. Algo enorme se ha colado en sus sueños a la vez.',
  },
  concept: 'La pesadilla de todos: el fin del mundo. Una única plataforma sobre un mar de lava y un gigante de fuego que quiere quemar todos los sueños.',
  palette: { background: '#140806', accent: '#ff6a1e', paper: '#fff0a0' },
  tileset: 'tiles_ragnarok',
  music: { explore: 'ragnarok_boss', combat: 'ragnarok_boss', boss: 'ragnarok_boss' },

  rules: ['cenizas'],
  ruleConfig: {},

  enemyPool: [{ id: 'chispa', weight: 1 }, { id: 'brasa', weight: 1 }],
  bosses: ['surtur'],
  eventPool: [],
  roomPool: ['ragnarok_plataforma'],

  floor: {
    arena: true,               // una sola sala: la plataforma del jefe
    budget: { base: 0, perDepth: 0, wavesEvery: 1, maxWaves: 1, maxPerWave: 1 },
  },
  shop: [],

  fragments: [
    { id: 'visita', unlock: 'visit', text: 'Todos los sueños de la noche han empezado a oler a humo.' },
    { id: 'jefe', unlock: 'boss', text: 'El fuego se apaga. En cuatro camas distintas, cuatro personas se dan la vuelta y siguen durmiendo.' },
  ],

  ending: {
    title: 'Amanece',
    text: 'El fuego se apaga. Todos siguen soñando, y nadie sabrá nunca que estuvo a punto de acabarse.',
  },

  text: {
    intro: 'Algo arde al fondo de todos los sueños',
    wave: 'Llamarada {n} de {total}',
    cleared: 'El fuego se apaga',
    exitPrompt: 'Ver amanecer',
    bossBoard: 'Ragnarök',
    bossBoardCleared: 'Amanece',
    transition: 'Todos duermen. Por ahora.',
  },
};
