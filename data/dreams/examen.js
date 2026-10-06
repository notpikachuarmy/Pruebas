// Sueño 1: El Examen Infinito
// Diseño completo en docs/GAME_DESIGN.md. Lo que no se usa aún está marcado con su fase.
export default {
  id: 'examen',
  tier: 1,
  name: 'El Examen Infinito',
  owner: {
    name: 'Íñigo',
    age: 34,
    summary: 'Hace doce años que terminó la carrera. Sigue soñando que le queda una asignatura.',
  },
  concept: 'La ansiedad de ser evaluado. Nada es peligroso de verdad, pero todo da prisa.',
  palette: { background: '#17122b', ink: '#25307a', accent: '#d6403a', paper: '#e8e6dc' },
  tileset: 'tiles_examen',
  music: { explore: 'examen_explore', combat: 'examen_combat', boss: 'examen_boss' },

  // Reglas especiales (js/dreams/rules.js)
  rules: ['relojDeExamen', 'folioEnBlanco', 'tintaNoSeSeca'],
  ruleConfig: {
    relojDeExamen: { base: 10, perEnemy: 2.2, overtimeSpeed: 1.2, reinforcements: 2 },
  },

  enemyPool: [
    { id: 'tachon', weight: 4 },
    { id: 'tachon_rojo', weight: 2 },
    { id: 'interrogante', weight: 3 },
    { id: 'goma', weight: 1.5 },
    { id: 'chuleta', weight: 1 },
    { id: 'compas', weight: 1.5 },
    { id: 'reloj', weight: 1 },
  ],
  miniboss: 'fotocopiadora',
  boss: 'profesora',
  eventPool: ['companero_sin_goma', 'pupitre_grabado', 'revision_examen'],
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
      { type: 'event', chance: 0.8, minDepth: 1 },
    ],
    miniboss: true,              // la sala que da al jefe guarda al mini-jefe
    challengeChance: 0.5,
    secret: true,
    budget: { base: 2, perDepth: 0.9, wavesEvery: 2, maxWaves: 3, maxPerWave: 8, delayBetweenWaves: 1.1 },
    roleCaps: { soporte: 1, modificador: 1, huidizo: 1, trampa: 2 },
    clearDrop: { chance: 0.4, table: [{ type: 'lucidity', weight: 3, amount: [2, 4] }, { type: 'heart', weight: 1, amount: [1, 1] }] },
  },

  shop: [
    { product: 'halfHeart', price: 3 },
    { product: 'heart', price: 5 },
    { product: 'container', price: 14 },
  ],

  text: {
    intro: 'Íñigo está soñando con un examen',
    wave: 'Pregunta {n} de {total}',
    cleared: 'Examen entregado',
    exitPrompt: 'Apagar el despertador',
    bossDoor: 'Examen final',
    bossBoard: 'Nombre: {owner}. Asignatura pendiente.',
    bossBoardCleared: 'Aprobado',
    transition: 'Íñigo deja de dar vueltas en la cama.',
  },

  // Registro de soñadores: fragmentos que se descubren jugando
  fragments: [
    { id: 'visita', unlock: 'visit', text: 'Íñigo lleva corbata en el sueño. Nunca la llevó a un examen.' },
    { id: 'pupitre', unlock: 'event:pupitre_grabado', text: '«Í + ¿?» Nunca terminó de grabar el segundo nombre.' },
    { id: 'fotocopiadora', unlock: 'miniboss', text: 'Todos sus compañeros entregaron el mismo examen. Él no se atrevió a copiar.' },
    { id: 'secreto', unlock: 'secret', text: 'En un cajón escondido: un boletín de notas firmado por su padre. Profesor de instituto.' },
    { id: 'profesora', unlock: 'boss', text: 'La letra de la nota final es la de su padre. Pone «Aprobado».' },
  ],
};
