// Objeto: Mantita de Ganchillo
export default {
  id: 'mantita',
  name: 'Mantita',
  rarity: 'común',
  pools: ['casa', 'general', 'minijefe'],
  tags: ['vida', 'casa'],
  description: 'Tras recibir un golpe, eres invulnerable durante más tiempo. Taparse hasta la cabeza ayuda.',
  modifiers: [{ stat: 'hurtInvulnerability', mult: 1.6 }],
  effects: [],
  icon: ['rryyrryy', 'ryyrryyr', 'yyrryyrr', 'yrryyrry', 'rryyrryy', 'ryyrryyr', 'yyrryyrr', '.k.k.k.k'],
};
