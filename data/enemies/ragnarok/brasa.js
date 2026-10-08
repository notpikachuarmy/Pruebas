// Enemigo: Brasa Viva (reutiliza la Mina Marina: se arma y estalla en llamas)
import mina from '../mar/mina.js';

export default {
  ...mina,
  id: 'brasa', name: 'Brasa Viva', dream: 'ragnarok', tags: ['fuego'],
  description: 'Rueda despacio por la plataforma. Si te acercas, se aviva y estalla. Mejor de lejos.',
  theme: 'Restos de mundos que ya han ardido.',
  sprite: 'enemy_brasa', light: 20,
  hp: 2, speed: 14,
  deathBurst: { count: 10, speed: 85, color: '#ff6a1e', trail: '#fff0a0' },
  drops: [{ type: 'lucidity', chance: 0.5, amount: [1, 2] }],
};
