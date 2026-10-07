// Mini-jefe de Mar Adentro (patternBoss)
export default {
  id: 'pulpo', name: 'El Pulpo del Pecio', dream: 'mar', role: 'minijefe', boss: true, tags: ['mar'],
  cost: 99, minDepth: 99,
  title: 'Ocho brazos',
  description: 'Se mueve por la sala escupiendo tinta y llamando a los peces del pecio.',
  theme: 'El guardián del barco hundido.',
  sprite: 'boss_pulpo', noFlip: true, light: 30,
  radius: 10, bodyRadius: 13, bodyHeight: 14,
  hp: 55, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'wander', speed: 34,
    phases: [
      { name: 'Ocho brazos', from: 1, attacks: [
        { type: 'aimed', every: 1.8, count: 5, spread: 0.2, speed: 95, color: '#1a1428', trail: '#c9bde6' },
        { type: 'summon', every: 6, ids: ['pecesillo'], max: 4 },
      ] },
      { name: 'Nube de tinta', from: 0.5, attacks: [
        { type: 'ring', every: 2.4, count: 12, gap: 3, speed: 70, color: '#1a1428', trail: '#c9bde6' },
        { type: 'marks', every: 2.6, count: 2, hazard: 'mark', delay: 1.1, r: 13 },
      ] },
    ],
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [6, 9] }, { type: 'heart', chance: 1 }],
};
