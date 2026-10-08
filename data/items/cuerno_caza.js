// Objeto: Cuerno de Caza
export default {
  id: 'cuerno_caza',
  name: 'Cuerno de Caza',
  rarity: 'común',
  pools: ['bosque', 'general'],
  tags: ['bosque', 'marca'],
  description: 'Marca a los enemigos que golpeas (reciben +30 % de daño) y empuja más.',
  modifiers: [{ stat: 'knockback', mult: 1.4 }],
  effects: [{ effect: 'markOnHit', time: 3, mult: 1.3 }],
};
