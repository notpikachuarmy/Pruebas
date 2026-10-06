// Jefe alternativo del Examen Infinito
export default {
  id: 'companero_perfecto', name: 'El Compañero Perfecto', dream: 'examen', role: 'jefe', boss: true, tags: ['examen'],
  cost: 99, minDepth: 99,
  title: 'Siempre saca mejor nota',
  description: 'Hace lo mismo que tú, pero mejor: dispara en ráfagas y esquiva cuando le apuntas. Luego llama a sus copias.',
  theme: 'El compañero con el que siempre le comparaban.',
  board: 'Media de la clase: él', boardCleared: 'Media de la clase: tú',
  sprite: 'boss_perfecto',
  radius: 4, bodyRadius: 7, bodyHeight: 10,
  hp: 80, speed: 46, contactDamage: 1, mass: 999,
  behavior: 'rival',
  params: { range: [80, 130], dodgeCooldown: [4.5, 4, 3.4], fireEvery: [1.8, 1.6, 1.4], burst: [3, 3, 5], poseTime: 1.0, copyEvery: 9 },
  drops: [{ type: 'lucidity', chance: 1, amount: [10, 14] }],
};
