// Enemigo: Mecedora Vacía (reutiliza el comportamiento del Compás)
export default {
  id: 'mecedora', name: 'Mecedora Vacía', dream: 'casa', role: 'trampa', tags: ['casa'],
  cost: 1.4, minDepth: 1,
  description: 'Se mece sola, cada vez más cerca de donde estás.',
  theme: 'La silla de alguien que ya no está.',
  sprite: 'enemy_mecedora',
  radius: 4, bodyRadius: 7, bodyHeight: 6,
  hp: 8, speed: 0, contactDamage: 1, mass: 50,
  behavior: 'compass',
  params: { radius: 16, angularSpeed: 3.4, spinTime: 3.2, liftTime: 0.6 },
  drops: [{ type: 'lucidity', chance: 0.8, amount: [1, 3] }],
};
