// Enemigo: Tentáculo (asoma desde el fondo)
export default {
  id: 'tentaculo', name: 'Tentáculo', dream: 'mar', role: 'trampa', tags: ['mar'],
  cost: 1.6, minDepth: 2,
  description: 'Bajo el agua solo es una onda que te sigue. Asoma con aviso rojo, golpea y se queda fuera un momento.',
  theme: 'Lo que hay debajo. Siempre lo que hay debajo.',
  sprite: 'enemy_tentaculo', scale: 1.4,
  radius: 4, bodyRadius: 8, bodyHeight: 10,
  hp: 5, speed: 0, contactDamage: 1, mass: 50,
  behavior: 'tentacle',
  params: { chase: 52, underTime: 2.6, rise: 0.55, upTime: 1.8 },
  drops: [{ type: 'lucidity', chance: 0.9, amount: [1, 3] }],
};
