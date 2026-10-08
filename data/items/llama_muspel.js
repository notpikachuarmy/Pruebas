// Objeto: Llama de Muspel (recompensa por vencer a Surtur)
export default {
  id: 'llama_muspel',
  name: 'Llama de Muspel',
  rarity: 'legendaria',
  pools: ['boss', 'secret'],
  locked: true,
  tags: ['fuego'],
  description: 'Un pedazo del fuego de Surtur. Tus notas prenden a los enemigos: arden unos segundos.',
  modifiers: [],
  effects: [{ effect: 'burn', time: 2.5, dps: 1 }],
};
