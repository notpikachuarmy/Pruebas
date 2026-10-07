// Jefe de Mar Adentro (patternBoss): la tormenta que volcó el barco
export default {
  id: 'tormenta', name: 'La Tormenta', dream: 'mar', role: 'jefe', boss: true, tags: ['mar'],
  cost: 99, minDepth: 99,
  title: 'Aquella noche',
  description: 'Olas en anillo, rayos con aviso que iluminan toda la sala y un torbellino en espiral.',
  theme: 'La tormenta que volcó el barco. Tomás todavía oye los truenos.',
  board: 'Temporal fuerza 9', boardCleared: 'Mar en calma',
  sprite: 'boss_tormenta', noFlip: true, light: 50,
  spawnAt: [14, 5],
  radius: 16, bodyRadius: 20, bodyHeight: 22,
  hp: 120, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'slide', speed: 18,
    phases: [
      { name: 'Mar de fondo', from: 1, attacks: [
        { type: 'ring', every: 2.6, count: 18, gap: 3, speed: 60, color: '#8fd3ff', trail: '#1d3a5a' },
        { type: 'aimed', every: 2.2, count: 3, spread: 0.2, speed: 100, color: '#8fd3ff', trail: '#1d3a5a' },
      ] },
      { name: 'Rayos', from: 0.66, attacks: [
        { type: 'marks', every: 1.8, count: 2, hazard: 'lightning', delay: 0.9, r: 14 },
        { type: 'flash', every: 3.5, time: 0.18 },
        { type: 'ring', every: 3.2, count: 16, gap: 3, speed: 62, color: '#8fd3ff', trail: '#1d3a5a' },
      ] },
      { name: 'El ojo del huracán', from: 0.33, attacks: [
        { type: 'spiral', every: 0.24, arms: 3, speed: 68, turn: 1.7, color: '#c9e8ff', trail: '#25307a' },
        { type: 'marks', every: 2.4, count: 2, hazard: 'lightning', delay: 0.9, r: 14 },
        { type: 'flash', every: 4, time: 0.18 },
      ] },
    ],
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }],
};
