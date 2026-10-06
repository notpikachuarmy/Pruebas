// Enemigo: Borrón (tanque; al deshacerse suelta dos Tachones)
import tachon from './tachon.js';

export default {
  ...tachon,
  id: 'borron', name: 'Borrón', role: 'tanque',
  cost: 2.4, minDepth: 3,
  description: 'Un tachón sobre otro tachón sobre otro. Lento y resistente; al deshacerse suelta dos Tachones.',
  theme: 'Cuando corriges tanto que ya no se lee nada.',
  scale: 1.6,
  radius: 7, bodyRadius: 10, bodyHeight: 9,
  hp: 10, speed: 22, mass: 2,
  params: { ...tachon.params, wobble: 0.4, lungeRange: 50, windup: 0.7, lungeSpeed: 150, inkRadius: 11, inkEvery: 0.06 },
  splitInto: { id: 'tachon', count: 2 },
  drops: [{ type: 'lucidity', chance: 1, amount: [2, 4] }, { type: 'heart', chance: 0.1 }],
};
