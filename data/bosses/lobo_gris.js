// Jefe de El Bosque en Llamas: El Lobo Gris (comportamiento rival)
export default {
  id: 'lobo_gris', name: 'El Lobo Gris', dream: 'bosque', role: 'jefe', boss: true, tags: ['bosque', 'depredador'],
  cost: 99, minDepth: 99,
  title: 'Jefe de la manada',
  description: 'Rápido y listo: da vueltas a tu alrededor, aúlla ondas de colmillos y se aparta de un salto cuando le apuntas. Tras cada ráfaga se queda quieto un instante. Llama a su manada.',
  theme: 'El que lleva días siguiendo el rastro. Sabe que la presa se cansará antes.',
  board: 'La manada', boardCleared: 'Huellas que se alejan',
  sprite: 'boss_lobo_gris',
  radius: 5, bodyRadius: 9, bodyHeight: 9,
  hp: 90, speed: 58, contactDamage: 1, mass: 999,
  behavior: 'rival',
  params: {
    range: [70, 120], dodgeCooldown: [4, 3.4, 2.8], fireEvery: [1.7, 1.5, 1.2], burst: [3, 4, 5], poseTime: 0.9, copyEvery: 8,
    summon: 'lobo', maxSummons: 2,
    phaseNames: ['Aullido', 'La manada', 'Luna llena'],
    shotColor: '#e6e0d0', shotTrail: '#5a5a62',
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }, { type: 'heart', chance: 1 }],
};
