// Objeto: Polvo Luminoso (guiño al polvo de piedra luminosa)
export default {
  id: 'polvo_luminoso',
  name: 'Polvo Luminoso',
  rarity: 'rara',
  pools: ['boss', 'general', 'casa'],
  locked: true,
  tags: ['luz', 'aura'],
  description: 'Te rodea un aura brillante que hace un poco de daño a los enemigos que se acercan. En la oscuridad, también alumbra.',
  modifiers: [],
  effects: [{ effect: 'aura', radius: 30, damage: 0.45, tick: 0.45 }, { effect: 'light', mult: 1.25 }],
};
