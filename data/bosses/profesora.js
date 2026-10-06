// Jefe del Examen Infinito
export default {
  id: 'profesora',
  name: 'La Profesora Sin Cara',
  dream: 'examen',
  role: 'jefe',
  boss: true,
  cost: 99, minDepth: 99,
  title: 'Asignatura pendiente',
  description: 'Una figura sin rostro tras una mesa enorme. Dicta, corrige y suspende.',
  theme: 'La evaluación que Íñigo lleva doce años esperando. Al vencerla, la nota cambia a "Aprobado".',
  sprite: 'boss_profesora',
  noFlip: true,
  radius: 14, bodyRadius: 16, bodyHeight: 24,
  hp: 115, speed: 20, contactDamage: 1, mass: 999,
  behavior: 'professor',
  // Ajustado tras las pruebas: más tiempo entre ataques, huecos más anchos y sin invocaciones
  params: {
    slide: 20,
    rowEvery: [3.0, 3.8, 2.6], rowSpeed: [55, 50, 62], rowGap: 4,
    aimEvery: 3.6,
    markEvery: [0, 3.2, 2.5], marks: [0, 2, 3], markDelay: 1.15,
    arenaMargin: 36,
    phaseSpeedup: 0.85,        // en la fase 3 los ataques salen un 15 % más seguidos
    summons: [],               // antes invocaba Gomas en la fase 2
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [10, 14] }],
};
