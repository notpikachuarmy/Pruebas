// Enemigo: Regla de 30 cm (embiste en línea recta)
export default {
  id: 'regla', name: 'Regla de 30 cm', dream: 'examen', role: 'perseguidor', tags: ['examen'],
  cost: 1.4, minDepth: 2,
  description: 'Apunta con calma y cruza el aula en línea recta. Esquivarla de lado es fácil; aguantarle de frente, no.',
  theme: 'Los márgenes que había que respetar.',
  sprite: 'enemy_regla',
  radius: 4, bodyRadius: 6, bodyHeight: 6,
  hp: 4, speed: 22, contactDamage: 1, mass: 0.9,
  behavior: 'scribbleChaser',
  params: { wobble: 0, wobbleSpeed: 1, lungeRange: 150, windup: 0.65, lungeSpeed: 270, lungeTime: 0.55, recover: 0.9, inkType: null, inkEvery: 1, inkLife: 0, inkRadius: 0 },
  drops: [{ type: 'lucidity', chance: 0.7, amount: [1, 2] }],
};
