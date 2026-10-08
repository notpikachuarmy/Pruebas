// Objeto: Semilla
export default {
  id: 'semilla',
  name: 'Semilla',
  rarity: 'rara',
  pools: ['bosque', 'general'],
  tags: ['bosque', 'crecimiento'],
  description: 'Cada sala que limpias suma +0,06 de daño para el resto de la noche (hasta 15 veces).',
  modifiers: [],
  effects: [{ effect: 'growth', per: 0.06, max: 15 }],
};
