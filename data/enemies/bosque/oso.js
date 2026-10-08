// Enemigo: Oso (tanque lento que embiste fuerte)
import tachon from '../tachon.js';

export default {
  ...tachon,
  id: 'oso', name: 'Oso', dream: 'bosque', role: 'tanque', tags: ['bosque', 'depredador'],
  cost: 2.6, minDepth: 2,
  description: 'Lento, enorme y muy resistente. Se levanta antes de cargar: aléjate cuando lo veas erguirse.',
  theme: 'No caza por hambre. Defiende lo suyo.',
  sprite: 'enemy_oso', scale: 1.5,
  radius: 7, bodyRadius: 10, bodyHeight: 10,
  hp: 13, speed: 22, mass: 3,
  params: { ...tachon.params, wobble: 0.2, wobbleSpeed: 3, lungeRange: 64, windup: 0.8, lungeSpeed: 170, lungeTime: 0.45, recover: 1.1, inkType: null },
  drops: [{ type: 'lucidity', chance: 1, amount: [2, 4] }, { type: 'heart', chance: 0.12 }],
};
