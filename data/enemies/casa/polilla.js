// Enemigo: Polilla (La Casa que se Vacía)
export default {
  id: 'polilla', name: 'Polilla', dream: 'casa', role: 'perseguidor', tags: ['casa'],
  cost: 0.6, minDepth: 0,
  description: 'Revolotea hacia ti en grupo. Si hay una lámpara encendida, prefiere la luz.',
  theme: 'Lo único que entra en una casa cerrada mucho tiempo.',
  sprite: 'enemy_polilla',
  radius: 3, bodyRadius: 5, bodyHeight: 10,
  hp: 1.5, speed: 62, contactDamage: 1, mass: 0.4,
  behavior: 'flutter',
  params: { flutter: 6, lampRange: 120 },
  drops: [{ type: 'lucidity', chance: 0.4, amount: [1, 1] }],
};
