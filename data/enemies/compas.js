// Enemigo: Compás (trampa viviente)
export default {
  id: 'compas',
  name: 'Compás',
  dream: 'examen',
  role: 'trampa',
  cost: 1.6,
  minDepth: 2,
  description: 'Clava la punta y gira trazando un círculo perfecto. De vez en cuando la clava junto a ti.',
  theme: 'La exigencia de hacerlo todo perfecto.',
  sprite: 'enemy_compas',
  radius: 4, bodyRadius: 6, bodyHeight: 8,
  hp: 7, speed: 0, contactDamage: 1, mass: 50,
  behavior: 'compass',
  params: { radius: 26, angularSpeed: 2.6, spinTime: 4, liftTime: 0.5 },
  drops: [{ type: 'lucidity', chance: 0.8, amount: [1, 3] }],
};
