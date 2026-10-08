// Objeto: Colmillo
export default {
  id: 'colmillo',
  name: 'Colmillo',
  rarity: 'común',
  pools: ['bosque', 'general', 'minijefe'],
  tags: ['bosque', 'critico'],
  description: 'Un 15 % de las notas muerden: hacen 2,5 veces más daño.',
  modifiers: [],
  effects: [{ effect: 'crit', chance: 0.15, mult: 2.5 }],
};
