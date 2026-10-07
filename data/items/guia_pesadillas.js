// Objeto: Guía de Pesadillas (guiño a la Pokédex)
export default {
  id: 'guia_pesadillas',
  name: 'Guía de Pesadillas',
  rarity: 'común',
  pools: ['general', 'minijefe'],
  locked: true,
  tags: ['conocimiento'],
  description: 'Lo apunta todo: muestra una barra de vida sobre cada enemigo.',
  modifiers: [],
  effects: [{ effect: 'healthBars' }],
};
