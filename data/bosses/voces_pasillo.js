// Jefe alternativo de La Casa a Oscuras
export default {
  id: 'voces_pasillo', name: 'Las Voces del Pasillo', dream: 'casa', role: 'jefe', boss: true, tags: ['casa'],
  cost: 99, minDepth: 99,
  title: 'Otra vez gritos',
  description: 'Siluetas que discuten tras las puertas. Cambian de lado; cada grito es un anillo de ondas y la luz tiembla.',
  theme: 'Lo que Lucía oía a través de la pared antes de que se fueran.',
  board: 'Otra vez gritos', boardCleared: 'Silencio, por fin',
  sprite: 'enemy_sombra', scale: 2.6,
  radius: 10, bodyRadius: 14, bodyHeight: 20,
  hp: 100, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'argument',
  params: { sideX: 96, moveEvery: 5, shoutEvery: [2.0, 2.2, 2.6], ringCount: 18 },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }],
};
