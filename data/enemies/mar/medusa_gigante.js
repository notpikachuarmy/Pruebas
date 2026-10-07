// Variante: Medusa Gigante (se separa en dos medusas)
import medusa from './medusa.js';

export default {
  ...medusa,
  id: 'medusa_gigante', name: 'Medusa Gigante',
  cost: 2.2, minDepth: 2,
  description: 'Una medusa del tamaño de un paraguas. Su descarga llega lejos; al deshacerla, quedan dos.',
  theme: 'Las cosas grandes que flotan sin hacer ruido.',
  scale: 1.7, radius: 6, bodyRadius: 11, bodyHeight: 13,
  hp: 7, speed: 20, mass: 1.4,
  params: { every: 3.4, charge: 0.8, radius: 40, sparks: 10 },
  splitInto: { id: 'medusa', count: 2 },
  drops: [{ type: 'lucidity', chance: 1, amount: [2, 3] }],
};
