// Objeto: Vinilo de Oro
export default {
  id: 'vinilo_oro',
  name: 'Vinilo de Oro',
  rarity: 'legendaria',
  pools: ['boss', 'secret'],
  locked: true,          // se desbloquea con un logro (data/progression/achievements.js)
  tags: ['musica'],
  description: 'Cada enemigo disipado suma un 5 % de daño (hasta un 50 %). Si te golpean, vuelves a empezar.',
  modifiers: [],
  effects: [{ effect: 'killStack', per: 0.05, max: 10 }],
};
