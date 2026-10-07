// Enemigo: Osito de Goma (embiste dejando sirope)
import tachon from '../tachon.js';

export default {
  ...tachon,
  id: 'osito', name: 'Osito de Goma', dream: 'dulce', role: 'perseguidor', tags: ['dulce'],
  cost: 1, minDepth: 0,
  description: 'Corre a trompicones y se lanza sobre ti dejando un rastro de sirope que frena.',
  theme: 'La bolsa de ositos que se comió entera ella sola.',
  sprite: 'enemy_osito',
  hp: 3.5, speed: 44,
  params: { ...tachon.params, inkType: 'syrup', inkLife: 2.5, wobble: 0.6 },
};
