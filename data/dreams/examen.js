// Sueño 1: El Examen Infinito
// Diseño completo en docs/GAME_DESIGN.md. Lo que no se usa aún está marcado con su fase.
export default {
  id: 'examen',
  name: 'El Examen Infinito',
  owner: {
    name: 'Íñigo',
    age: 34,
    summary: 'Hace doce años que terminó la carrera. Sigue soñando que le queda una asignatura.',
  },
  concept: 'La ansiedad de ser evaluado. Nada es peligroso de verdad, pero todo da prisa.',
  palette: { background: '#17122b', ink: '#25307a', accent: '#d6403a', paper: '#e8e6dc' },
  tileset: 'tiles_examen',
  music: { explore: 'examen_explore' },   // Fase 4: combat, boss

  rules: [],                     // Fase 4: 'relojDeExamen', 'folioEnBlanco'
  enemyPool: [{ id: 'tachon', weight: 1 }],
  roomPool: [
    'aula_inicio', 'aula_filas', 'aula_vacia', 'aula_circulo',
    'pasillo_taquillas', 'aula_trincheras', 'despacho', 'examen_final',
  ],

  // Generación del plano (js/rooms/FloorGenerator.js)
  floor: {
    rooms: [8, 11],              // salas normales + especiales (la secreta va aparte)
    minBossDepth: 4,             // el jefe está como mínimo a 4 salas del inicio
    specials: [                  // tipos que ocupan callejones sin salida
      { type: 'reward', required: true },
      { type: 'shop', required: true, minDepth: 2 },
      { type: 'healing', chance: 0.6, minDepth: 2 },
    ],
    challengeChance: 0.5,
    secret: true,
    budget: { base: 2, perDepth: 0.9, wavesEvery: 2, maxWaves: 3, maxPerWave: 8, delayBetweenWaves: 1.1 },
    roleCaps: { soporte: 1, modificador: 1 },
    clearDrop: { chance: 0.4, table: [{ type: 'lucidity', weight: 3, amount: [2, 4] }, { type: 'heart', weight: 1, amount: [1, 1] }] },
  },

  shop: [
    { product: 'halfHeart', price: 3 },
    { product: 'heart', price: 5 },
    { product: 'container', price: 14 },
  ],

  encounters: {
    // Sala del jefe mientras no exista La Profesora Sin Cara (Fase 4)
    final: {
      waves: [
        [{ id: 'tachon', count: 6 }],
        [{ id: 'tachon', count: 8 }],
        [{ id: 'tachon', count: 10 }],
      ],
      delayBetweenWaves: 1.4,
    },
  },

  text: {
    intro: 'Íñigo está soñando con un examen',
    wave: 'Pregunta {n} de {total}',
    cleared: 'Examen entregado',
    exitPrompt: 'Apagar el despertador',
    bossDoor: 'Examen final',
  },
};
