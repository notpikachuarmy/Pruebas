// Mini-jefe del Examen Infinito
export default {
  id: 'fotocopiadora',
  name: 'La Fotocopiadora',
  dream: 'examen',
  role: 'minijefe',
  boss: true,
  cost: 99, minDepth: 99,
  description: 'Imprime copias de lo que hay en la sala. Cuando se atasca, abre la bandeja: su punto débil.',
  theme: 'Ser una copia más. Con poca vida empieza a imprimirte a ti.',
  sprite: 'boss_fotocopiadora',
  noFlip: true,
  radius: 12, bodyRadius: 14, bodyHeight: 12,
  hp: 45, speed: 14, contactDamage: 1, mass: 999,
  behavior: 'photocopier',
  params: { printEvery: 2.6, maxCopies: 4, jamEvery: 3, jamTime: 3, jamDamageMult: 2.5, sheets: 7, prints: ['tachon', 'tachon', 'interrogante'] },
  drops: [{ type: 'lucidity', chance: 1, amount: [6, 9] }, { type: 'heart', chance: 1 }],
};
