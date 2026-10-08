// Enemigo: Chispa de Muspel (invocada por Surtur)
import tachon from '../tachon.js';

export default {
  ...tachon,
  id: 'chispa', name: 'Chispa de Muspel', dream: 'ragnarok', role: 'perseguidor', tags: ['fuego'],
  cost: 1, minDepth: 0,
  description: 'Un trozo del fuego de Surtur con ganas de quemar. Se lanza contra ti y deja brasas.',
  theme: 'El fuego que se extiende de un sueño a otro.',
  sprite: 'enemy_chispa', light: 26,
  hp: 3, speed: 52,
  params: { ...tachon.params, wobble: 0.8, lungeRange: 60, lungeSpeed: 210, inkType: 'embers', inkLife: 1, inkEvery: 0.08, inkRadius: 6 },
  drops: [{ type: 'lucidity', chance: 0.4, amount: [1, 1] }, { type: 'heart', chance: 0.06 }],
};
