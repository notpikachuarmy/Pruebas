// Enemigo: Águila Real (sombra en el suelo que cae en picado)
import tentaculo from '../mar/tentaculo.js';

export default {
  ...tentaculo,
  id: 'aguila', name: 'Águila Real', dream: 'bosque', role: 'trampa', tags: ['bosque', 'depredador'],
  cost: 1.5, minDepth: 2,
  description: 'Solo ves su sombra deslizándose por el suelo. Cuando se oscurece con un borde rojo, cae en picado. Después se queda un momento en tierra: ahí es vulnerable.',
  theme: 'Para un cervatillo, el peligro también viene del cielo.',
  sprite: 'enemy_aguila', scale: 1.2,
  hp: 4,
  params: { chase: 60, underTime: 2.4, rise: 0.6, upTime: 1.4, shadow: true, burstColor: '#c88a3c' },
  drops: [{ type: 'lucidity', chance: 0.8, amount: [1, 3] }],
};
