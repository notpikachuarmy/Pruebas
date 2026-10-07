// Jefe de El País de las Chuches (patternBoss)
export default {
  id: 'pinata', name: 'La Piñata Gigante', dream: 'dulce', role: 'jefe', boss: true, tags: ['dulce'],
  cost: 99, minDepth: 99,
  title: '¡Dale, dale, dale!',
  description: 'Va de un lado a otro de la sala. Cada golpe la hace más rabiosa; al final suelta gominolas y estalla en caramelos.',
  theme: 'La piñata de su cumpleaños, que nadie conseguía romper.',
  board: '¡Dale, dale, dale!', boardCleared: '¡Lluvia de caramelos!',
  sprite: 'boss_pinata', noFlip: false,
  radius: 10, bodyRadius: 13, bodyHeight: 16,
  hp: 105, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'wander', speed: 48,
    phases: [
      { name: '¡Dale!', from: 1, attacks: [
        { type: 'aimed', every: 1.5, count: 3, spread: 0.25, speed: 100, color: '#ffd65c', trail: '#ff6ad5' },
      ] },
      { name: '¡Dale más fuerte!', from: 0.66, attacks: [
        { type: 'aimed', every: 1.7, count: 3, spread: 0.25, speed: 105, color: '#ffd65c', trail: '#ff6ad5' },
        { type: 'summon', every: 4.5, ids: ['gominola'], max: 3 },
      ] },
      { name: '¡Que se rompe!', from: 0.33, attacks: [
        { type: 'ring', every: 2.2, count: 14, gap: 3, speed: 66, color: '#7fd6a0', trail: '#ff6ad5' },
        { type: 'aimed', every: 1.6, count: 5, spread: 0.2, speed: 100, color: '#ffd65c', trail: '#ff6ad5' },
      ] },
    ],
  },
  // Al romperse: lluvia de caramelos (mucha Lucidez)
  deathBurst: { count: 0 },
  drops: [{ type: 'lucidity', chance: 1, amount: [18, 24] }, { type: 'heart', chance: 1 }],
};
