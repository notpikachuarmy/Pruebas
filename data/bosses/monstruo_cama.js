// Jefe alternativo de La Casa a Oscuras
export default {
  id: 'monstruo_cama', name: 'Lo que hay Debajo de la Cama', dream: 'casa', role: 'jefe', boss: true, tags: ['casa'],
  cost: 99, minDepth: 99,
  title: 'No mires debajo',
  description: 'Escondido no se le puede herir: solo asoma unas manos de sombra. Cuando saca los ojos, es tu momento.',
  theme: 'El miedo de todas las noches, cuando nadie viene a apagar la luz contigo.',
  board: 'No mires debajo', boardCleared: 'Debajo no hay nada',
  sprite: 'boss_cama', noFlip: true,
  radius: 18, bodyRadius: 20, bodyHeight: 14,
  hp: 110, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'underBed',
  params: { hideTime: [4, 3.4, 2.6], peekTime: 2.8, grabEvery: [1.2, 1.1, 1.0], grabDelay: 1.0 },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }],
};
