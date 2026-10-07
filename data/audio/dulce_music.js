// Música placeholder de El País de las Chuches: alegre, rápida, en mayor.
export default {
  dulce_explore: {
    bpm: 132, root: 293.7,
    pattern: [
      { wave: 'square', volume: 0.05, length: 0.5, notes: [12, 16, 19, 16, 14, 17, 21, 17, 12, 16, 19, 24, 21, 19, 16, 14] },
      { wave: 'triangle', volume: 0.1, octave: 0.5, length: 1.5, notes: [0, null, 7, null, 5, null, 7, null, 0, null, 7, null, 9, null, 7, null] },
    ],
  },
  dulce_combat: {
    bpm: 156, root: 293.7,
    pattern: [
      { wave: 'square', volume: 0.05, length: 0.4, notes: [12, 19, 16, 19, 14, 21, 17, 21] },
      { wave: 'triangle', volume: 0.11, octave: 0.5, notes: [0, 0, 7, 7, 5, 5, 7, 7] },
    ],
  },
  dulce_boss: {
    bpm: 168, root: 261.6,
    pattern: [
      { wave: 'square', volume: 0.05, length: 0.3, notes: [24, null, 24, 19, 24, null, 26, 24] },
      { wave: 'sawtooth', volume: 0.05, notes: [12, 16, 19, 24, 12, 17, 21, 24] },
      { wave: 'triangle', volume: 0.12, octave: 0.5, length: 3.5, notes: [0, null, null, null, 5, null, null, null] },
    ],
  },
};
