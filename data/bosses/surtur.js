// Jefe final: Surtur, el gigante de fuego (patternBoss)
export default {
  id: 'surtur', name: 'Surtur', dream: 'ragnarok', role: 'jefe', boss: true, tags: ['fuego'],
  cost: 99, minDepth: 99,
  title: 'Señor de Muspelheim',
  description: 'Un gigante de fuego que se alza desde la lava. Barre la plataforma con su espada, hace llover el cielo y, al final, la tierra misma arde bajo tus pies.',
  theme: 'No es el sueño de nadie: es la pesadilla de todos a la vez. Si gana, ningún sueño vuelve a despertar.',
  board: 'Ragnarök', boardCleared: 'Amanece',
  sprite: 'boss_surtur', noFlip: true, light: 90,
  spawnAt: [14, 4],
  radius: 20, bodyRadius: 26, bodyHeight: 36,
  hp: 260, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'slide', speed: 14,
    phases: [
      { name: 'El gigante despierta', from: 1, attacks: [
        { type: 'aimed', every: 1.9, count: 5, spread: 0.16, speed: 100, color: '#fff0a0', trail: '#2a0e08' },
        { type: 'ring', every: 3.6, count: 20, gap: 4, speed: 58, color: '#2a0e08', trail: '#ffd65c' },
      ] },
      { name: 'La espada de fuego', from: 0.75, attacks: [
        { type: 'sprite', every: 4.2, anim: 'raise', time: 1 },
        { type: 'line', every: 4.2, orient: 'random', gap: 3, hazard: 'fireMark', delay: 1.1, r: 12 },
        { type: 'aimed', every: 2.3, count: 3, spread: 0.2, speed: 110, color: '#fff0a0', trail: '#2a0e08' },
        { type: 'summon', every: 7, ids: ['chispa'], max: 3 },
      ] },
      { name: 'Lluvia de Muspelheim', from: 0.5, attacks: [
        { type: 'marks', every: 1.7, count: 3, hazard: 'meteor', delay: 1.3, r: 16 },
        { type: 'ring', every: 3.2, count: 20, gap: 4, speed: 62, color: '#2a0e08', trail: '#ffd65c' },
        { type: 'summon', every: 8, ids: ['brasa', 'chispa'], max: 3 },
      ] },
      { name: 'Ragnarök', from: 0.25, attacks: [
        { type: 'arena', every: 999, margin: 34 },
        { type: 'spiral', every: 0.26, arms: 3, speed: 66, turn: 1.5, color: '#fff0a0', trail: '#2a0e08' },
        { type: 'sprite', every: 5, anim: 'raise', time: 1 },
        { type: 'line', every: 5, orient: 'both', gap: 3, hazard: 'fireMark', delay: 1.2, r: 12 },
        { type: 'marks', every: 2.6, count: 2, hazard: 'meteor', delay: 1.3, r: 16 },
      ] },
    ],
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [20, 26] }, { type: 'heart', chance: 1 }],
};
