// Mini-jefe de El País de las Chuches (reutiliza el comportamiento de la Fotocopiadora)
export default {
  id: 'tarta', name: 'La Tarta de Cumpleaños', dream: 'dulce', role: 'minijefe', boss: true, tags: ['dulce'],
  cost: 99, minDepth: 99,
  title: 'Pide un deseo',
  description: 'Con las velas encendidas apenas siente nada. Cuando se le apagan, es vulnerable y escupe nata.',
  theme: 'La tarta más grande que ha visto nunca.',
  sprite: 'boss_tarta', noFlip: true,
  radius: 12, bodyRadius: 14, bodyHeight: 14,
  hp: 50, speed: 12, contactDamage: 1, mass: 999,
  behavior: 'photocopier',
  params: {
    printEvery: 2, maxCopies: 5, jamEvery: 3, jamTime: 3, jamDamageMult: 2.2, baseDamageMult: 0.35,
    sheets: 9, sheetColor: '#fff6d6', sheetTrail: '#ff8fc0', printCopies: false,
    prints: ['osito', 'gominola', 'osito'], jamText: '¡Se apagan las velas!',
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [6, 9] }, { type: 'heart', chance: 1 }],
};
