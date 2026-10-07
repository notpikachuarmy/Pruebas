// Jefe de Mar Adentro (reutiliza el comportamiento de Lo que hay Debajo de la Cama)
export default {
  id: 'leviatan', name: 'Lo que Hay Abajo', dream: 'mar', role: 'jefe', boss: true, tags: ['mar'],
  cost: 99, minDepth: 99,
  title: 'No mires hacia abajo',
  description: 'Una sombra enorme bajo el agua. Sumergida es intocable y te intenta arrastrar; cuando asoma los ojos, es vulnerable.',
  theme: 'Lo que Tomás imaginó debajo de sus pies durante las horas que pasó flotando.',
  board: 'Profundidad: desconocida', boardCleared: 'Solo era el fondo',
  sprite: 'boss_leviatan', noFlip: true,
  radius: 18, bodyRadius: 20, bodyHeight: 12,
  hp: 115, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'underBed',
  params: {
    hideTime: [4, 3.4, 2.6], peekTime: 2.8, grabEvery: [1.2, 1.05, 0.95], grabDelay: 1.0,
    summon: 'pecesillo', phaseNames: ['Algo se mueve', 'Te rodea', 'Te arrastra'],
    deathText: 'Solo era el fondo', shotColor: '#0a1828',
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }],
};
