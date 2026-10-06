// Objeto: Post-it
export default {
  id: 'post_it',
  name: 'Post-it',
  rarity: 'común',          // común | rara | legendaria
  pools: ['examen', 'general', 'minijefe'],
  tags: ['marca'],
  description: 'Los enemigos que golpeas quedan marcados: reciben más daño de todo durante 3 s.',
  modifiers: [],
  effects: [{ effect: 'markOnHit', time: 3, mult: 1.35 }],
  icon: [
    'yyyyyyy.',
    'yyyyyyy.',
    'ykkkkyy.',
    'yyyyyyy.',
    'ykkkyyy.',
    'yyyyyy..',
    'yyyyy...',
    '........',
  ],
};
