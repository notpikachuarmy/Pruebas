// Sueño 1: El Examen Infinito
// En la Fase 2 solo se usan: tileset, paleta, música, enemyPool, encounters y textos.
// El resto está documentado en docs/GAME_DESIGN.md y se implementará en la Fase 4.
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
  roomPool: ['aula_prueba'],

  encounters: {
    prueba: {
      // Cada oleada es una "pregunta" del examen.
      waves: [
        [{ id: 'tachon', count: 3 }],
        [{ id: 'tachon', count: 5 }],
        [{ id: 'tachon', count: 8 }],
      ],
      delayBetweenWaves: 1.2,
    },
  },

  text: {
    intro: 'Íñigo está soñando con un examen',
    wave: 'Pregunta {n} de {total}',
    cleared: 'Examen entregado',
    exitPrompt: 'Apagar el despertador',
  },
};
