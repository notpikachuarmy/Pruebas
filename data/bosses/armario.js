// Mini-jefe de La Casa a Oscuras (reutiliza el comportamiento de la Fotocopiadora)
export default {
  id: 'armario', name: 'El Armario', dream: 'casa', role: 'minijefe', boss: true, tags: ['casa'],
  cost: 99, minDepth: 99,
  description: 'Cerrado apenas siente los golpes. Cuando abre las puertas para soltar lo que vive dentro, está indefenso.',
  theme: 'El monstruo del armario. Nadie vino nunca a comprobar que no estaba.',
  sprite: 'boss_armario', noFlip: true,
  light: 34,
  radius: 12, bodyRadius: 14, bodyHeight: 16,
  hp: 50, speed: 10, contactDamage: 1, mass: 999,
  behavior: 'photocopier',
  params: {
    printEvery: 1.8, maxCopies: 6, jamEvery: 3, jamTime: 3.2, jamDamageMult: 2.2, baseDamageMult: 0.35,
    sheets: 9, sheetColor: '#c4b696', sheetTrail: '#64422c', printCopies: false,
    prints: ['polilla', 'polilla', 'polvo'], jamText: 'Las puertas se abren',
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [6, 9] }, { type: 'heart', chance: 1 }],
};
