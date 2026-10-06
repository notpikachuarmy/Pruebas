// Objeto: Lata de Galletas
export default {
  id: 'galletas',
  name: 'Lata de Galletas',
  rarity: 'común',
  pools: ['casa', 'general'],
  tags: ['vida', 'casa'],
  description: 'Al limpiar una sala, a veces recuperas medio corazón.',
  modifiers: [],
  effects: [{ effect: 'clearHeal', chance: 0.35, amount: 1 }],
  icon: ['........', '.bbbbbb.', 'bccccccb', 'bnynynnb', 'bynnnynb', 'bnnynnnb', '.bbbbbb.', '........'],
};
