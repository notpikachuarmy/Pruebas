// Enemigo: Gominola (salta; al deshacerse se separa en dos)
export default {
  id: 'gominola', name: 'Gominola', dream: 'dulce', role: 'perseguidor', tags: ['dulce'],
  cost: 1.2, minDepth: 0,
  description: 'Va hacia ti a saltos. En el aire no hace daño; al caer, aplasta. Se divide en dos al deshacerla.',
  theme: 'Las chuches que nunca le dejan comer antes de cenar.',
  sprite: 'enemy_gominola',
  radius: 5, bodyRadius: 7, bodyHeight: 6,
  hp: 3.5, speed: 0, contactDamage: 1, mass: 0.8,
  behavior: 'hopper',
  params: { jumpRange: 70, airTime: 0.55, height: 14, wait: 0.7, color: '#7fd67f' },
  splitInto: { id: 'gominola_mini', count: 2 },
  drops: [{ type: 'lucidity', chance: 0.5, amount: [1, 1] }],
};
