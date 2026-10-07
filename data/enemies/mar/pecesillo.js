// Enemigo: Pececillo (va en bancos)
import polilla from '../casa/polilla.js';

export default {
  ...polilla,
  id: 'pecesillo', name: 'Banco de Pececillos', dream: 'mar', tags: ['mar'],
  cost: 0.45, minDepth: 0,
  description: 'Pequeños y muchos. Giran a tu alrededor y se lanzan en grupo.',
  theme: 'El banco que se abrió a su alrededor cuando cayó al agua.',
  sprite: 'enemy_pecesillo',
  hp: 1.2, speed: 70,
  params: { flutter: 4, lampRange: 0 },
};
