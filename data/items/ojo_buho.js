// Objeto: Ojo de Búho
export default {
  id: 'ojo_buho',
  name: 'Ojo de Búho',
  rarity: 'común',
  pools: ['bosque', 'general'],
  tags: ['bosque', 'luz'],
  description: 'Ves de noche y tus notas llegan más lejos.',
  modifiers: [{ stat: 'range', mult: 1.12 }],
  effects: [{ effect: 'light', mult: 1.5 }],
};
