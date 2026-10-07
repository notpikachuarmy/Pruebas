// Objeto: Anillo Rosa (guiño a los Zafiros Estelares)
// Al golpear, de vez en cuando cae un constructo rosa sobre el enemigo. Cuál cae depende de tu vida máxima.
export default {
  id: 'anillo_rosa',
  name: 'Anillo Rosa',
  rarity: 'legendaria',
  pools: ['boss', 'secret'],
  locked: true,
  tags: ['luz', 'amor'],
  description: 'Al golpear, cae un constructo rosa sobre el enemigo: con poca vida máxima un corazón que a veces cura, con más un martillo, y con 6 corazones o más una estrella que daña en área.',
  modifiers: [],
  effects: [{ effect: 'construct', cooldown: 1.6 }],
};
