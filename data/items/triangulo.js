// Objeto: Triángulo
export default {
  id: 'triangulo',
  name: 'Triángulo',
  rarity: 'común',
  pools: ['general', 'minijefe'],
  tags: ['musica', 'control'],
  description: 'Cada golpe tiene un 15 % de dejar aturdido al enemigo un momento (no afecta a los jefes).',
  modifiers: [],
  effects: [{ effect: 'stunOnHit', chance: 0.15, time: 0.7 }],
};
