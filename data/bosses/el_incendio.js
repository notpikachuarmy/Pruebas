// Jefe de El Bosque en Llamas: El Incendio (patternBoss)
export default {
  id: 'el_incendio', name: 'El Incendio', dream: 'bosque', role: 'jefe', boss: true, tags: ['bosque', 'fuego'],
  cost: 99, minDepth: 99,
  title: 'El bosque arde',
  description: 'Un muro de fuego con forma de bestia. Lanza anillos de llamas, hace caer ramas ardiendo y, al final, el fuego cerca el claro.',
  theme: 'No tiene ojos ni dientes, y aun así es el peor depredador del bosque.',
  board: 'Incendio forestal', boardCleared: 'Lluvia',
  sprite: 'boss_incendio', noFlip: true, light: 80,
  spawnAt: [14, 4],
  radius: 14, bodyRadius: 18, bodyHeight: 18,
  hp: 105, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'slide', speed: 18,
    phases: [
      { name: 'Humo en el aire', from: 1, attacks: [
        { type: 'ring', every: 2.6, count: 18, gap: 4, speed: 60, color: '#3a1a0c', trail: '#ffb347' },
        { type: 'marks', every: 2.4, count: 2, hazard: 'fireMark', delay: 1.2, r: 12 },
      ] },
      { name: 'Las copas arden', from: 0.66, attacks: [
        { type: 'line', every: 4, orient: 'random', gap: 3, hazard: 'fireMark', delay: 1.1, r: 12 },
        { type: 'aimed', every: 2, count: 5, spread: 0.2, speed: 95, color: '#fff0a0', trail: '#3a1a0c' },
        { type: 'summon', every: 7, ids: ['pavesa'], max: 3 },
      ] },
      { name: 'Cercado por el fuego', from: 0.33, attacks: [
        { type: 'arena', every: 999, margin: 30 },
        { type: 'spiral', every: 0.3, arms: 3, speed: 62, turn: 1.4, color: '#3a1a0c', trail: '#ffb347' },
        { type: 'marks', every: 2.2, count: 2, hazard: 'meteor', delay: 1.3, r: 14 },
        { type: 'summon', every: 9, ids: ['pavesa'], max: 2 },
      ] },
    ],
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }, { type: 'heart', chance: 1 }],
};
