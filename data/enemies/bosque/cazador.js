// Enemigo: Cazador (tirador a distancia que se esconde si le apuntas)
import interrogante from '../interrogante.js';

export default {
  ...interrogante,
  id: 'cazador', name: 'Cazador', dream: 'bosque', role: 'tirador', tags: ['bosque', 'cazador'],
  cost: 1.7, minDepth: 1,
  description: 'Se queda lejos, apunta un momento y dispara una bala rápida. Si le apuntas tú, se esconde entre los árboles.',
  theme: 'El olor a pólvora. El chasquido seco antes del disparo.',
  sprite: 'enemy_cazador',
  radius: 4, bodyRadius: 6, bodyHeight: 10,
  hp: 3.5, speed: 30, mass: 0.8,
  params: { minRange: 90, maxRange: 150, windup: 0.7, cooldown: 2.6, shotSpeed: 175, hideTime: 0.8,
    glyph: '', shotRadius: 2, expire: false, shotColor: '#fff6d6', shotTrail: '#3a2a1c' },
  drops: [{ type: 'lucidity', chance: 0.75, amount: [1, 3] }, { type: 'heart', chance: 0.07 }],
};
