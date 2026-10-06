// Jefe de La Casa que se Vacía
export default {
  id: 'mesa_puesta', name: 'La Mesa Puesta', dream: 'casa', role: 'jefe', boss: true, tags: ['casa'],
  cost: 99, minDepth: 99,
  title: 'Cena para seis, cada domingo',
  description: 'Seis platos, una vela y nadie más. Lanza la vajilla y apaga la casa.',
  theme: 'Carmen pone la mesa para toda la familia cada domingo. Al vencerla, por fin hay alguien sentado.',
  sprite: 'boss_mesa_puesta', noFlip: true,
  light: 70,          // la vela ilumina alrededor de la mesa (regla Penumbra)
  radius: 18, bodyRadius: 20, bodyHeight: 18,
  hp: 150, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'dinnerTable',
  params: { ringEvery: [2.2, 2.8, 2.6], ringCount: 14, ringSpeed: 68, aimEvery: 3.2, spiralEvery: 0.16 },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }],
};
