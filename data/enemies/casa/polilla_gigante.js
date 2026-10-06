// Variante: Polilla Gigante (se deshace en tres polillas)
import polilla from './polilla.js';

export default {
  ...polilla,
  id: 'polilla_gigante', name: 'Polilla Gigante',
  cost: 2, minDepth: 2,
  description: 'Una polilla del tamaño de una mano. Al deshacerla, se separa en tres pequeñas.',
  theme: 'Las sombras que crecen cuando se apaga la luz.',
  scale: 1.8,
  radius: 5, bodyRadius: 9, bodyHeight: 14,
  hp: 5, speed: 44, mass: 1,
  splitInto: { id: 'polilla', count: 3 },
  drops: [{ type: 'lucidity', chance: 1, amount: [1, 3] }],
};
