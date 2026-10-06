// Enemigo: Peluche Roto (solo se mueve cuando no lo miras)
export default {
  id: 'peluche', name: 'Peluche Roto', dream: 'casa', role: 'perseguidor', tags: ['casa'],
  cost: 1.5, minDepth: 1,
  description: 'Mientras le apuntas, no se mueve. En cuanto miras a otro lado, corre hacia ti.',
  theme: 'Su osito de siempre. En la oscuridad, hasta lo conocido da miedo.',
  sprite: 'enemy_peluche',
  radius: 4, bodyRadius: 6, bodyHeight: 7,
  hp: 5, speed: 82, contactDamage: 1, mass: 0.8,
  behavior: 'staring',
  params: { sightRange: 220, cone: 0.82 },
  drops: [{ type: 'lucidity', chance: 0.7, amount: [1, 2] }, { type: 'heart', chance: 0.06 }],
};
