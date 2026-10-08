// Objeto: Trampa Rota
export default {
  id: 'trampa_rota',
  name: 'Trampa Rota',
  rarity: 'rara',
  pools: ['bosque', 'general'],
  tags: ['bosque', 'silencio', 'control'],
  description: 'El Silencio deja un cepo (como mucho uno cada 2 s): el primer enemigo que lo pisa queda atrapado y herido.',
  modifiers: [],
  effects: [{ effect: 'dashTrap', cooldown: 2, life: 10 }],
};
