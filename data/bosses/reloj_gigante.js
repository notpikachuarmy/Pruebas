// Jefe alternativo del Examen Infinito
export default {
  id: 'reloj_gigante', name: 'El Gran Reloj', dream: 'examen', role: 'jefe', boss: true, tags: ['examen'],
  cost: 99, minDepth: 99,
  title: 'Quedan cinco minutos',
  description: 'Sus agujas son chorros de tinta que barren el aula. Cuanto menos tiempo queda, más rápido giran.',
  theme: 'El tiempo del examen, que nunca alcanza.',
  board: 'Tiempo restante: 5 minutos', boardCleared: 'Tiempo: de sobra',
  sprite: 'enemy_reloj', scale: 3, noFlip: true,
  spawnAt: [14, 5],
  radius: 18, bodyRadius: 20, bodyHeight: 22,
  hp: 120, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'clockBoss',
  params: {
    minuteSpeed: [0.85, 1.05, 1.2], hourSpeed: 0.3, minuteEvery: 0.3, hourEvery: 0.7,
    shoutEvery: 6.5, maxMinions: 3, chimeEvery: 2.6,
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [10, 14] }],
};
