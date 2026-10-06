// Enemigo: Teléfono que No Suena (reutiliza el comportamiento del Reloj de Pared)
export default {
  id: 'telefono', name: 'Teléfono que No Suena', dream: 'casa', role: 'modificador', tags: ['casa'],
  cost: 2, minDepth: 2,
  description: 'No ataca. A veces da un timbrazo y todos se ponen nerviosos.',
  theme: 'Esperar una llamada de los hijos que viven lejos.',
  sprite: 'enemy_telefono',
  radius: 5, bodyRadius: 7, bodyHeight: 6,
  hp: 5, speed: 0, contactDamage: 0, mass: 50,
  behavior: 'wallClock',
  params: { every: 4.5, hasteTime: 2.5, text: '¡Ring!' },
  drops: [{ type: 'lucidity', chance: 1, amount: [2, 3] }],
};
