// Jefe de El País de las Chuches (patternBoss)
export default {
  id: 'fuente_chocolate', name: 'La Fuente de Chocolate', dream: 'dulce', role: 'jefe', boss: true, tags: ['dulce'],
  cost: 99, minDepth: 99,
  title: 'Barra libre',
  description: 'No se mueve: escupe chorros de chocolate en espiral y llena el suelo de charcos pegajosos.',
  theme: 'La fuente de la boda de su tía, a la que no la dejaron acercarse.',
  board: 'Barra libre de chocolate', boardCleared: 'Ya no puedo más',
  sprite: 'boss_fuente', noFlip: true,
  spawnAt: [14, 6],
  radius: 16, bodyRadius: 18, bodyHeight: 18,
  hp: 120, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'static', speed: 0,
    phases: [
      { name: 'Primera ronda', from: 1, attacks: [
        { type: 'spiral', every: 0.3, arms: 3, speed: 62, turn: 1.4, color: '#6e3e28', trail: '#ffe0b0' },
      ] },
      { name: 'Charcos de chocolate', from: 0.66, attacks: [
        { type: 'spiral', every: 0.34, arms: 3, speed: 62, turn: -1.6, color: '#6e3e28', trail: '#ffe0b0' },
        { type: 'marks', every: 2.4, count: 3, hazard: 'caramelDrop', delay: 1.1, r: 12 },
      ] },
      { name: 'Desbordamiento', from: 0.33, attacks: [
        { type: 'spiral', every: 0.28, arms: 4, speed: 66, turn: 1.9, color: '#6e3e28', trail: '#ffe0b0' },
        { type: 'aimed', every: 2.2, count: 3, spread: 0.2, speed: 110 },
      ] },
    ],
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }],
};
