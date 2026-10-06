// Enemigo: Interrogante (tirador)
export default {
  id: 'interrogante',
  name: 'Interrogante',
  dream: 'examen',
  role: 'tirador',
  cost: 1.5,
  minDepth: 1,
  description: 'Flota a distancia y lanza preguntas que manchan el suelo al caer. Si le apuntas, se esconde.',
  theme: 'Las preguntas que Íñigo no sabe responder: huyen en cuanto las miras de frente.',
  tags: ['tinta'],
  sprite: 'enemy_interrogante',
  radius: 4, bodyRadius: 6, bodyHeight: 8,
  hp: 3, speed: 34, contactDamage: 1, mass: 0.7,
  behavior: 'shyShooter',
  params: { minRange: 70, maxRange: 130, windup: 0.45, cooldown: 2.1, shotSpeed: 85, hideTime: 0.7 },
  drops: [{ type: 'lucidity', chance: 0.7, amount: [1, 2] }, { type: 'heart', chance: 0.06 }],
};
