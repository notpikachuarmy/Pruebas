// Enemigo: Cepo (trampa de acero que se cierra si te acercas)
import mina from '../mar/mina.js';

export default {
  ...mina,
  id: 'cepo', name: 'Cepo', dream: 'bosque', role: 'trampa', tags: ['bosque', 'trampa'],
  cost: 0.9, minDepth: 1,
  description: 'Escondido entre la hojarasca. Si te acercas tiembla y se cierra de golpe. Los que ves en el suelo sin moverse también muerden: crúzalos con el Silencio.',
  theme: 'El miedo más antiguo del bosque: una pata atrapada y nadie que venga.',
  sprite: 'enemy_cepo',
  radius: 5, bodyRadius: 6, bodyHeight: 3,
  hp: 2, speed: 0,
  params: { trigger: 30, fuse: 0.45, radius: 20 },
  deathBurst: { count: 6, speed: 70, color: '#5a5a62', trail: '#c9bde6' },
  drops: [{ type: 'lucidity', chance: 0.4, amount: [1, 2] }],
};
