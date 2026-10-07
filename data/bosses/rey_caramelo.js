// Jefe de El País de las Chuches (definido solo con datos: comportamiento patternBoss)
export default {
  id: 'rey_caramelo', name: 'El Rey Caramelo', dream: 'dulce', role: 'jefe', boss: true, tags: ['dulce'],
  cost: 99, minDepth: 99,
  title: 'Su Majestad Azucarada',
  description: 'Se pasea por su salón lanzando caramelos en abanico, bombardea con caramelos y llama a su guardia de ositos.',
  theme: 'Quien manda en el país de las chuches: nadie le dice que ya está bien de dulces.',
  board: '¡Viva el rey!', boardCleared: 'Cada cosa a su hora',
  sprite: 'boss_rey', noFlip: true,
  radius: 10, bodyRadius: 13, bodyHeight: 18,
  hp: 110, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'slide', speed: 26,
    phases: [
      { name: 'Audiencia real', from: 1, attacks: [
        { type: 'aimed', every: 1.6, count: 5, spread: 0.18, speed: 105 },
        { type: 'ring', every: 3.4, count: 16, gap: 3, speed: 60 },
      ] },
      { name: '¡A mí la guardia!', from: 0.66, attacks: [
        { type: 'aimed', every: 1.9, count: 3, spread: 0.2, speed: 115 },
        { type: 'marks', every: 2.6, count: 2, hazard: 'caramelDrop', delay: 1.1, r: 13 },
        { type: 'summon', every: 5, ids: ['osito', 'gominola'], max: 3 },
      ] },
      { name: 'Rabieta real', from: 0.33, attacks: [
        { type: 'spiral', every: 0.22, arms: 2, speed: 75, turn: 1.8 },
        { type: 'ring', every: 3, count: 18, gap: 3, speed: 58, color: '#ffd65c', trail: '#eb2f2d' },
      ] },
    ],
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }],
};
