// Enemigo: Mina Marina
export default {
  id: 'mina', name: 'Mina Marina', dream: 'mar', role: 'trampa', tags: ['mar'],
  cost: 1, minDepth: 1,
  description: 'Flota a la deriva. Si te acercas, se arma y explota. Revientala desde lejos.',
  theme: 'Restos de otras guerras que el mar no olvida.',
  sprite: 'enemy_mina',
  radius: 5, bodyRadius: 7, bodyHeight: 6,
  hp: 1.5, speed: 10, contactDamage: 0, mass: 50,
  behavior: 'mine',
  params: { trigger: 40, fuse: 0.7, radius: 30 },
  deathBurst: { count: 12, speed: 90, color: '#3c4048', trail: '#ff9a3c' },
  drops: [{ type: 'lucidity', chance: 0.5, amount: [1, 2] }],
};
