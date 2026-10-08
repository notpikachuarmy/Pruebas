// Objeto: Luciérnaga
export default {
  id: 'luciernaga',
  name: 'Luciérnaga',
  rarity: 'rara',
  pools: ['bosque', 'general', 'secret'],
  tags: ['bosque', 'companero', 'luz'],
  description: 'Una luciérnaga te acompaña, alumbra un poco y dispara chispitas al enemigo más cercano.',
  modifiers: [],
  effects: [{ effect: 'familiar', kind: 'luciernaga', every: 1.1, damage: 0.5, color: '#fff38a', trail: '#c8a000' }, { effect: 'light', mult: 1.15 }],
};
