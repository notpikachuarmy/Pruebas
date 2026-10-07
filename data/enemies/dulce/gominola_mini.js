// Gominola pequeña (sale al deshacer una Gominola; no entra en presupuestos)
import gominola from './gominola.js';

export default {
  ...gominola,
  id: 'gominola_mini', name: 'Gominolita', role: 'especial',
  cost: 99, minDepth: 99,
  description: 'Media gominola, el doble de saltarina.',
  scale: 0.6, radius: 3, bodyRadius: 4, bodyHeight: 4,
  hp: 1.2,
  params: { ...gominola.params, jumpRange: 55, airTime: 0.4, wait: 0.35, height: 9 },
  splitInto: null,
  drops: [{ type: 'lucidity', chance: 0.3, amount: [1, 1] }],
};
