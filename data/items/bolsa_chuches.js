// Objeto: Bolsa de Chuches
export default {
  id: 'bolsa_chuches',
  name: 'Bolsa de Chuches',
  rarity: 'común',
  pools: ['dulce', 'general'],
  locked: true,
  tags: ['dulce', 'lucidez'],
  description: 'Cada sala que limpias suelta un puñado de Lucidez.',
  modifiers: [],
  effects: [{ effect: 'clearLucidity', amount: [2, 4] }],
};
