/**
 * Lo que se puede comprar o encontrar en cofres. Los sueños eligen qué vender y a qué precio (dream.shop).
 * En la Fase 5 se añadirán los objetos aquí o en un sistema propio.
 */
export const PRODUCTS = {
  halfHeart: {
    name: 'Medio corazón',
    canApply: (world) => world.player.hp < world.player.stats.get('maxHp'),
    apply: (world) => world.damage.healPlayer(1),
    render: (g, x, y) => heart(g, x, y, true),
  },
  heart: {
    name: 'Corazón',
    canApply: (world) => world.player.hp < world.player.stats.get('maxHp'),
    apply: (world) => world.damage.healPlayer(2),
    render: (g, x, y) => heart(g, x, y, false),
  },
  container: {
    name: 'Corazón extra',
    canApply: (world) => world.player.stats.get('maxHp') < 24,
    apply: (world) => {
      world.player.stats.addModifier({ stat: 'maxHp', add: 2, source: 'container' });
      world.damage.healPlayer(2);
    },
    render: (g, x, y, t) => {
      heart(g, x, y, false);
      g.fillStyle = '#ffd65c';
      if (Math.floor(t * 3) % 2) { g.fillRect(x - 6, y - 6, 1, 1); g.fillRect(x + 5, y - 5, 1, 1); }
      g.fillRect(x - 1, y - 9, 2, 1);
    },
  },
};

function heart(g, x, y, half) {
  g.fillStyle = '#eb2f2d';
  g.fillRect(x - 4, y - 4, 3, 2); g.fillRect(x + 1, y - 4, 3, 2);
  g.fillRect(x - 5, y - 3, 10, 3); g.fillRect(x - 4, y, 8, 2); g.fillRect(x - 3, y + 2, 6, 1); g.fillRect(x - 1, y + 3, 2, 1);
  if (half) { g.fillStyle = '#3a2f5c'; g.fillRect(x, y - 4, 5, 8); }
}
