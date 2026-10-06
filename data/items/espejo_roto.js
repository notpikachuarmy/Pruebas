// Objeto: Espejo Roto
export default {
  id: 'espejo_roto',
  name: 'Espejo Roto',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['examen', 'general'],
  tags: ['reflejo'],
  description: 'Las ondas rebotan dos veces en las paredes. Cada rebote las hace un poco más pequeñas.',
  modifiers: [],
  effects: [{ effect: 'bounce', count: 2, shrink: 0.85 }],
  icon: [
    'kkkkkkkk',
    'kccccwck',
    'kcwcckck',
    'kcckccck',
    'kckccwck',
    'kcccwcck',
    'kcwccckk',
    'kkkkkkkk',
  ],
};
