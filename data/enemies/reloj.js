// Enemigo: Reloj de Pared (modificador)
export default {
  id: 'reloj',
  name: 'Reloj de Pared',
  dream: 'examen',
  role: 'modificador',
  cost: 2,
  minDepth: 3,
  description: 'No ataca. Cada pocos segundos anuncia que quedan cinco minutos y todos se dan prisa.',
  theme: 'El tiempo que se acaba.',
  sprite: 'enemy_reloj',
  radius: 5, bodyRadius: 7, bodyHeight: 7,
  hp: 5, speed: 0, contactDamage: 0, mass: 50,
  behavior: 'wallClock',
  params: { every: 5, hasteTime: 2.5 },
  drops: [{ type: 'lucidity', chance: 1, amount: [2, 3] }],
};
