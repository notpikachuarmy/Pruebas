// Enemigo: Pavesa (chispa del incendio que deja brasas)
import chispa from '../ragnarok/chispa.js';

export default {
  ...chispa,
  id: 'pavesa', name: 'Pavesa', dream: 'bosque', tags: ['bosque', 'fuego'],
  cost: 0.9, minDepth: 2,
  description: 'Una chispa que el viento arrastra desde el incendio. Se lanza contra ti y deja el suelo ardiendo.',
  theme: 'Cuando el bosque empieza a oler a humo, ya es tarde.',
  sprite: 'enemy_pavesa', light: 22,
  hp: 2.2, speed: 48,
};
