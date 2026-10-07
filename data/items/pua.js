// Objeto: Púa de Guitarra
export default {
  id: 'pua',
  name: 'Púa de Guitarra',
  rarity: 'común',
  pools: ['general', 'minijefe'],
  tags: ['musica', 'critico'],
  description: 'Un 12 % de las notas son críticas y hacen el doble de daño.',
  modifiers: [],
  effects: [{ effect: 'crit', chance: 0.12, mult: 2 }],
};
