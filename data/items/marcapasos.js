// Objeto: Marcapasos
export default {
  id: 'marcapasos',
  name: 'Marcapasos',
  rarity: 'rara',
  pools: ['general', 'secret'],
  tags: ['vida'],
  description: 'Cada 30 segundos sin recibir daño, recuperas medio corazón.',
  modifiers: [],
  effects: [{ effect: 'regen', every: 30 }],
};
