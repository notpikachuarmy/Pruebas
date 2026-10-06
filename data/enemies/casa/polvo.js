// Enemigo: Bola de Polvo (se divide en dos al morir)
export default {
  id: 'polvo', name: 'Bola de Polvo', dream: 'casa', role: 'perseguidor', tags: ['casa'],
  cost: 1.3, minDepth: 1,
  description: 'Se acumula donde nadie limpia. Al deshacerla, se separa en dos más pequeñas.',
  theme: 'Habitaciones que nadie pisa.',
  sprite: 'enemy_polvo',
  radius: 5, bodyRadius: 7, bodyHeight: 6,
  hp: 4, speed: 34, contactDamage: 1, mass: 0.9,
  behavior: 'scribbleChaser',
  params: { wobble: 0.5, wobbleSpeed: 3, lungeRange: 50, windup: 0.5, lungeSpeed: 160, lungeTime: 0.3, recover: 0.8, inkType: null, inkEvery: 1, inkLife: 0, inkRadius: 0 },
  splitInto: { id: 'polvo_mini', count: 2 },
  drops: [{ type: 'lucidity', chance: 0.5, amount: [1, 1] }],
};
