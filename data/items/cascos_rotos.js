// Objeto: Cascos Rotos
export default {
  id: 'cascos_rotos',
  name: 'Cascos Rotos',
  rarity: 'común',
  pools: ['general'],
  tags: ['sonido'],
  description: 'Disparas un 35 % más rápido, pero las notas salen un poco torcidas.',
  modifiers: [{ stat: 'fireRate', mult: 1.35 }],
  effects: [{ effect: 'inaccuracy', spread: 0.16 }],
};
