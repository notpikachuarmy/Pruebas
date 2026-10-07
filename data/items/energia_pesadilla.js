// Objeto: Energía de Pesadilla
export default {
  id: 'energia_pesadilla',
  name: 'Energía de Pesadilla',
  rarity: 'rara',
  pools: ['boss', 'general'],
  locked: true,
  tags: ['pesadilla'],
  description: 'Tus notas hacen bastante más daño, pero en las salas pueden aparecer enemigos de cualquier sueño desbloqueado.',
  modifiers: [{ stat: 'damage', mult: 1.35 }],
  effects: [],   // la mezcla de enemigos la aplica el generador de encuentros si llevas este objeto
};
