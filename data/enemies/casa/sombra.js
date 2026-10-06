// Enemigo: Sombra de Visita
export default {
  id: 'sombra', name: 'Sombra de Visita', dream: 'casa', role: 'tirador', tags: ['casa'],
  cost: 1.6, minDepth: 1,
  description: 'Si te acercas, se desvanece. Desde lejos es sólida y llora lágrimas lentas.',
  theme: 'Las visitas que se van en cuanto llegan.',
  sprite: 'enemy_sombra',
  radius: 4, bodyRadius: 6, bodyHeight: 8,
  hp: 4, speed: 30, contactDamage: 1, mass: 0.8,
  behavior: 'fadingVisitor',
  params: { fadeRange: 62, cooldown: 2.3, shotSpeed: 70 },
  drops: [{ type: 'lucidity', chance: 0.8, amount: [1, 2] }, { type: 'heart', chance: 0.06 }],
};
