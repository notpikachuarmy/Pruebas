// Enemigo: Medusa
export default {
  id: 'medusa', name: 'Medusa', dream: 'mar', role: 'perseguidor', tags: ['mar'],
  cost: 1.2, minDepth: 0,
  description: 'Flota hacia ti despacio. Cuando se ilumina, suelta una descarga a su alrededor: aléjate.',
  theme: 'Lo que roza la pierna en el agua y no sabes qué es.',
  sprite: 'enemy_medusa',
  radius: 4, bodyRadius: 7, bodyHeight: 8,
  hp: 3.5, speed: 26, contactDamage: 1, mass: 0.6,
  behavior: 'pulser',
  params: { every: 3, charge: 0.7, radius: 26, sparks: 6 },
  drops: [{ type: 'lucidity', chance: 0.6, amount: [1, 2] }],
};
