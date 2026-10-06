// Variante: Interrogante Doble («¿¿») — dispara tres preguntas en abanico
import interrogante from './interrogante.js';

export default {
  ...interrogante,
  id: 'interrogante_doble', name: 'Interrogante Doble',
  cost: 2.1, minDepth: 3,
  description: 'Una pregunta dentro de otra. Lanza tres a la vez y su tinta es roja.',
  theme: 'Las preguntas trampa.',
  sprite: 'enemy_interrogante_doble',
  hp: 4,
  params: { ...interrogante.params, shots: 3, spread: 0.32, cooldown: 2.6, expire: 'redInk' },
  drops: [{ type: 'lucidity', chance: 0.9, amount: [2, 3] }, { type: 'heart', chance: 0.08 }],
};
