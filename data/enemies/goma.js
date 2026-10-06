// Enemigo: Goma Gastada (soporte)
export default {
  id: 'goma',
  name: 'Goma Gastada',
  dream: 'examen',
  role: 'soporte',
  cost: 2,
  minDepth: 2,
  description: 'Se planta delante de sus compañeros y borra las ondas que la rozan, pero solo unas pocas seguidas. Cuando se le apaga el escudo, es tu momento.',
  theme: 'Querer deshacer lo que ya está hecho.',
  sprite: 'enemy_goma',
  radius: 5, bodyRadius: 7, bodyHeight: 6,
  hp: 6, speed: 30, contactDamage: 1, mass: 1.6,
  behavior: 'eraser',
  params: { guardDistance: 22, eraseRadius: 12, charges: 3, rechargeTime: 1.6, healEvery: 2.4, healRadius: 50, healAmount: 1 },
  drops: [{ type: 'lucidity', chance: 0.8, amount: [2, 3] }],
};
