// Mini-jefe de El Bosque en Llamas (patternBoss)
export default {
  id: 'trampero', name: 'El Trampero', dream: 'bosque', role: 'minijefe', boss: true, tags: ['bosque', 'cazador'],
  cost: 99, minDepth: 99,
  title: 'Conoce cada sendero',
  description: 'Va sembrando cepos por la sala, dispara con su escopeta de dos cañones y suelta a sus perros. Cruza los cepos con el Silencio.',
  theme: 'El que pone las trampas nunca está cuando se cierran.',
  sprite: 'boss_trampero', light: 20,
  radius: 6, bodyRadius: 9, bodyHeight: 14,
  hp: 60, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'wander', speed: 30,
    phases: [
      { name: 'Senderos minados', from: 1, attacks: [
        { type: 'marks', every: 3, count: 2, hazard: 'trap', delay: 14, r: 7, spread: 60 },
        { type: 'aimed', every: 2.2, count: 2, spread: 0.12, speed: 150, radius: 2, color: '#fff6d6', trail: '#3a2a1c' },
      ] },
      { name: '¡Soltad a los perros!', from: 0.5, attacks: [
        { type: 'marks', every: 3.4, count: 2, hazard: 'trap', delay: 14, r: 7, spread: 60 },
        { type: 'aimed', every: 1.8, count: 5, spread: 0.18, speed: 130, radius: 2, color: '#fff6d6', trail: '#3a2a1c' },
        { type: 'summon', every: 5, ids: ['perro'], max: 3 },
      ] },
    ],
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [6, 9] }, { type: 'heart', chance: 1 }],
};
