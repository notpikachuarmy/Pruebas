// Enemigo: Caballito de Balancín (reutiliza el comportamiento del Compás)
export default {
  id: 'mecedora', name: 'Caballito de Balancín', dream: 'casa', role: 'trampa', tags: ['casa'],
  cost: 1.4, minDepth: 1,
  description: 'Se balancea solo en círculos y, de vez en cuando, salta junto a ti.',
  theme: 'Su juguete favorito. En la oscuridad se mece sin que nadie lo empuje.',
  sprite: 'enemy_mecedora',
  radius: 4, bodyRadius: 7, bodyHeight: 6,
  hp: 8, speed: 0, contactDamage: 1, mass: 50,
  behavior: 'compass',
  params: { radius: 16, angularSpeed: 3.4, spinTime: 3.2, liftTime: 0.6 },
  drops: [{ type: 'lucidity', chance: 0.8, amount: [1, 3] }],
};
