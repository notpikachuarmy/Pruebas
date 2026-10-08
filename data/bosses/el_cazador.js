// Jefe de El Bosque en Llamas: El Cazador (patternBoss)
export default {
  id: 'el_cazador', name: 'El Cazador', dream: 'bosque', role: 'jefe', boss: true, tags: ['bosque', 'cazador'],
  cost: 99, minDepth: 99,
  title: 'Temporada abierta',
  description: 'Te sigue con el punto de mira: cuando el círculo rojo se cierra, dispara. No te quedes quieto. Luego llama a la jauría.',
  theme: 'Un disparo en la niebla, y después silencio. Es lo que más teme cualquier ciervo.',
  board: 'Temporada de caza', boardCleared: 'Veda',
  sprite: 'boss_cazador', light: 30,
  radius: 6, bodyRadius: 10, bodyHeight: 18,
  hp: 95, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'wander', speed: 26,
    phases: [
      { name: 'En el punto de mira', from: 1, attacks: [
        { type: 'marks', every: 2.2, count: 1, hazard: 'crosshair', delay: 1.3, r: 14, aim: true },
        { type: 'aimed', every: 2.6, count: 3, spread: 0.1, speed: 165, radius: 2, color: '#fff6d6', trail: '#3a2a1c' },
      ] },
      { name: 'La jauría', from: 0.66, attacks: [
        { type: 'marks', every: 2.4, count: 2, hazard: 'crosshair', delay: 1.3, r: 14, aim: true, spread: 40 },
        { type: 'summon', every: 6, ids: ['perro'], max: 4 },
        { type: 'aimed', every: 2.2, count: 3, spread: 0.12, speed: 165, radius: 2, color: '#fff6d6', trail: '#3a2a1c' },
      ] },
      { name: 'Batida', from: 0.33, attacks: [
        { type: 'marks', every: 1.6, count: 3, hazard: 'crosshair', delay: 1.2, r: 14, aim: true, spread: 50 },
        { type: 'marks', every: 4, count: 2, hazard: 'trap', delay: 12, r: 7, spread: 70 },
        { type: 'ring', every: 3.4, count: 16, gap: 3, speed: 90, radius: 2, color: '#fff6d6', trail: '#3a2a1c' },
        { type: 'summon', every: 7, ids: ['perro'], max: 3 },
      ] },
    ],
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }, { type: 'heart', chance: 1 }],
};
