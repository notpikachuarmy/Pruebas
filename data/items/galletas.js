// Objeto: Lata de Galletas
export default {
  id: 'galletas',
  name: 'Galletas de la Merienda',
  rarity: 'común',
  pools: ['casa', 'general', 'minijefe'],
  tags: ['vida', 'casa'],
  description: 'Al limpiar una sala, a veces recuperas medio corazón.',
  modifiers: [],
  effects: [{ effect: 'clearHeal', chance: 0.35, amount: 1 }],
  icon: ['........', '.bbbbbb.', 'bccccccb', 'bnynynnb', 'bynnnynb', 'bnnynnnb', '.bbbbbb.', '........'],
};
