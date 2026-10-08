// Música placeholder de El Bosque en Llamas: tensa, con pulso de corazón y viento.
export default {
  bosque_explore: {
    bpm: 72, root: 164.8,
    pattern: [
      { wave: 'sine', volume: 0.12, octave: 0.5, length: 0.4, notes: [0, null, 0, null, null, null, null, null, 0, null, 0, null, null, null, null, null] },
      { wave: 'triangle', volume: 0.05, octave: 2, length: 1.5, notes: [null, null, 7, null, null, null, 5, null, null, null, 3, null, null, null, 2, null] },
    ],
  },
  bosque_combat: {
    bpm: 132, root: 164.8,
    pattern: [
      { wave: 'square', volume: 0.04, length: 0.2, notes: [0, null, 0, 3, null, 0, 5, null, 0, null, 0, 3, null, 7, 5, 3] },
      { wave: 'sine', volume: 0.13, octave: 0.5, length: 0.3, notes: [0, null, null, 0, null, null, 0, null, -2, null, null, -2, null, null, -2, null] },
    ],
  },
  bosque_boss: {
    bpm: 140, root: 146.8,
    pattern: [
      { wave: 'sawtooth', volume: 0.06, notes: [0, 0, 1, 0, 3, 0, 1, 0, 6, 0, 5, 0, 3, 0, 1, 0] },
      { wave: 'square', volume: 0.04, length: 0.15, notes: [12, null, null, null, 12, null, null, null, 13, null, null, null, 12, null, 15, null] },
      { wave: 'sine', volume: 0.14, octave: 0.5, length: 3.5, notes: [0, null, null, null, null, null, null, null, -1, null, null, null, null, null, null, null] },
    ],
  },
};
