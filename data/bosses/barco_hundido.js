// Jefe de Mar Adentro (patternBoss): el barco de Tomás
export default {
  id: 'barco_hundido', name: 'El Barco Hundido', dream: 'mar', role: 'jefe', boss: true, tags: ['mar'],
  cost: 99, minDepth: 99,
  title: 'El Esperanza',
  description: 'El pesquero fantasma dispara andanadas por la borda, suelta tablones en anillo y llama a lo que vive en su bodega.',
  theme: 'Su barco. Se hundió con todo lo que tenía, menos con él.',
  board: 'Esperanza — Puerto de Vigo', boardCleared: 'Descanse en paz',
  sprite: 'boss_barco', light: 40,
  radius: 18, bodyRadius: 20, bodyHeight: 18,
  hp: 115, speed: 0, contactDamage: 1, mass: 999,
  behavior: 'patternBoss',
  params: {
    move: 'slide', speed: 30,
    phases: [
      { name: '¡Andanada!', from: 1, attacks: [
        { type: 'aimed', every: 1.7, count: 5, spread: 0.12, speed: 120, color: '#3c4048', trail: '#ff9a3c' },
      ] },
      { name: 'Vía de agua', from: 0.66, attacks: [
        { type: 'aimed', every: 2, count: 5, spread: 0.12, speed: 120, color: '#3c4048', trail: '#ff9a3c' },
        { type: 'ring', every: 3, count: 14, gap: 3, speed: 60, color: '#8a5a34', trail: '#fff6d6' },
        { type: 'summon', every: 6, ids: ['anguila', 'tentaculo'], max: 3 },
      ] },
      { name: 'A pique', from: 0.33, attacks: [
        { type: 'spiral', every: 0.26, arms: 2, speed: 72, turn: -1.6, color: '#8a5a34', trail: '#fff6d6' },
        { type: 'aimed', every: 1.8, count: 3, spread: 0.18, speed: 125, color: '#3c4048', trail: '#ff9a3c' },
      ] },
    ],
  },
  drops: [{ type: 'lucidity', chance: 1, amount: [12, 16] }],
};
