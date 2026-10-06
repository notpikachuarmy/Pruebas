// Enemigo: Pelusa (lo que queda de una Bola de Polvo; no entra en presupuestos)
import polvo from './polvo.js';

export default {
  ...polvo,
  id: 'polvo_mini', name: 'Pelusa', role: 'especial',
  cost: 99, minDepth: 99,
  description: 'Media bola de polvo. Más rápida y más frágil.',
  scale: 0.6,
  radius: 3, bodyRadius: 4, bodyHeight: 4,
  hp: 1.5, speed: 50,
  splitInto: null,
  drops: [{ type: 'lucidity', chance: 0.3, amount: [1, 1] }],
};
