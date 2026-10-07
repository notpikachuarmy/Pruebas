// Enemigo: Piruleta (tiradora en espiral)
export default {
  id: 'piruleta', name: 'Piruleta Giratoria', dream: 'dulce', role: 'tirador', tags: ['dulce'],
  cost: 1.6, minDepth: 1,
  description: 'Gira y gira lanzando caramelos en espiral. Fíjate en el hueco entre brazos.',
  theme: 'El mareo de dar vueltas en la feria.',
  sprite: 'enemy_piruleta',
  radius: 4, bodyRadius: 7, bodyHeight: 8,
  hp: 4, speed: 22, contactDamage: 1, mass: 1,
  behavior: 'spinner',
  params: { spin: 1.6, every: 0.55, arms: 3, speed: 70 },
  drops: [{ type: 'lucidity', chance: 0.8, amount: [1, 2] }],
};
