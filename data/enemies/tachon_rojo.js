// Variante: Tachón Rojo (corrección). Igual que el Tachón, pero su tinta quema.
import tachon from './tachon.js';

export default {
  ...tachon,
  id: 'tachon_rojo',
  name: 'Tachón Rojo',
  description: 'Un tachón hecho con el boli de corregir. Su rastro no solo frena: duele.',
  theme: 'Cuando el error ya no es tuyo, sino la nota que te ponen.',
  sprite: 'enemy_tachon_rojo',
  cost: 1.6,
  minDepth: 3,
  hp: 5,
  params: { ...tachon.params, inkType: 'redInk', inkLife: 2.2, inkEvery: 0.06 },
  drops: [{ type: 'lucidity', chance: 0.8, amount: [1, 3] }, { type: 'heart', chance: 0.08 }],
};
