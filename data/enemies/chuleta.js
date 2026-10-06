// Enemigo: Chuleta (huidiza, riesgo/recompensa)
export default {
  id: 'chuleta',
  name: 'Chuleta',
  dream: 'examen',
  role: 'huidizo',
  cost: 0.6,
  minDepth: 1,
  description: 'Huye de ti. Atrápala y tendrás un buen botín… y una alarma. Dispárala y tendrás poco, pero en silencio.',
  theme: 'La tentación de hacer trampa.',
  sprite: 'enemy_chuleta',
  radius: 4, bodyRadius: 6, bodyHeight: 6,
  hp: 2, speed: 78, contactDamage: 0, mass: 0.5,
  behavior: 'fleeing',
  params: {
    panicRange: 90, catchRange: 12, escapeAfter: 14,
    catchLoot: [4, 6], catchHeart: 0.35, alarmSpawns: 2, alarmEnemy: 'tachon',
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [1, 2] }],
};
