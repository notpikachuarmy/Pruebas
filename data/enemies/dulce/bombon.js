// Enemigo: Bombón Relleno (tanque; al romperse suelta su relleno en todas direcciones)
import tachon from '../tachon.js';

export default {
  ...tachon,
  id: 'bombon', name: 'Bombón Relleno', dream: 'dulce', role: 'tanque', tags: ['dulce'],
  cost: 2.2, minDepth: 2,
  description: 'Lento y duro. Al romperlo, el relleno sale disparado en todas direcciones: no lo rompas pegado a él.',
  theme: 'Nunca sabes qué lleva dentro.',
  sprite: 'enemy_bombon', scale: 1.3,
  radius: 6, bodyRadius: 9, bodyHeight: 8,
  hp: 9, speed: 24, mass: 2,
  params: { ...tachon.params, wobble: 0.3, lungeRange: 40, windup: 0.8, lungeSpeed: 130, inkType: null },
  deathBurst: { count: 10, speed: 80, color: '#5c3422', trail: '#ffe0b0' },
  drops: [{ type: 'lucidity', chance: 1, amount: [2, 4] }, { type: 'heart', chance: 0.12 }],
};
