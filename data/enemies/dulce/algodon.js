// Enemigo: Algodón de Azúcar (deja caer bombas de caramelo)
export default {
  id: 'algodon', name: 'Algodón de Azúcar', dream: 'dulce', role: 'modificador', tags: ['dulce'],
  cost: 1.8, minDepth: 2,
  description: 'Flota a tu alrededor y deja caer caramelos que avisan con una sombra rosa y dejan sirope pegajoso.',
  theme: 'La nube de la feria, tan grande que no se acababa nunca.',
  sprite: 'enemy_algodon',
  radius: 5, bodyRadius: 8, bodyHeight: 10,
  hp: 4, speed: 55, contactDamage: 0, mass: 0.6,
  behavior: 'cloudDropper',
  params: { orbit: 55, every: 1.6, delay: 1.0 },
  drops: [{ type: 'lucidity', chance: 1, amount: [1, 3] }],
};
