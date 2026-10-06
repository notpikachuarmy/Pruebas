// Objeto: Dibujo de Familia (id antiguo: foto_familia)
export default {
  id: 'foto_familia',
  name: 'Dibujo de Familia',
  rarity: 'rara',
  pools: ['casa'],
  locked: true,
  tags: ['recuerdo'],
  description: 'Con la vida llena, tus ondas golpean un 40 % más fuerte.',
  modifiers: [],
  effects: [{ effect: 'fullHpDamage', mult: 1.4 }],
  icon: ['nnnnnnnn', 'nccccccn', 'ncppcpcn', 'ncwwcwcn', 'nbbbbbbn', 'nbbbbbbn', 'nnnnnnnn', '........'],
};
