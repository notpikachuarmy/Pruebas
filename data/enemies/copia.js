// Enemigo especial: Copia (solo la crea la Fotocopiadora; no entra en presupuestos)
export default {
  id: 'copia',
  name: 'Copia',
  dream: 'examen',
  role: 'especial',
  cost: 99,
  minDepth: 99,
  description: 'Una fotocopia tuya en tinta. Hace lo que tú hiciste hace un momento.',
  theme: 'La presión de ser igual que los demás.',
  tags: ['tinta'],
  sprite: 'enemy_copia',
  radius: 4, bodyRadius: 5, bodyHeight: 10,
  hp: 6, speed: 0, contactDamage: 1, mass: 1,
  behavior: 'mimic',
  params: { delay: 0.9, speedFactor: 0.85, minFireGap: 0.35 },
  drops: [{ type: 'lucidity', chance: 1, amount: [2, 3] }],
};
