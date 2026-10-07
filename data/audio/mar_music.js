// Música placeholder de Mar Adentro: grave, lenta, con oleaje.
export default {
  mar_explore: {
    bpm: 66, root: 146.8,
    pattern: [
      { wave: 'sine', volume: 0.12, length: 3, notes: [0, null, null, 3, null, null, -2, null, null, -5, null, null] },
      { wave: 'triangle', volume: 0.05, octave: 2, length: 0.7, notes: [null, 7, null, null, 10, null, null, 5, null, null, 3, null] },
    ],
  },
  mar_combat: {
    bpm: 110, root: 146.8,
    pattern: [
      { wave: 'sawtooth', volume: 0.05, notes: [0, 0, 3, 0, 5, 0, 3, 0, -2, -2, 1, -2, 3, -2, 1, -2] },
      { wave: 'sine', volume: 0.13, octave: 0.5, length: 3.5, notes: [0, null, null, null, -4, null, null, null, -2, null, null, null, -5, null, null, null] },
    ],
  },
  mar_boss: {
    bpm: 126, root: 130.8,
    pattern: [
      { wave: 'square', volume: 0.04, length: 0.15, notes: [24, null, null, 24, null, null, 24, null] },
      { wave: 'sawtooth', volume: 0.06, notes: [0, 1, 0, 6, 0, 1, 0, 8] },
      { wave: 'sine', volume: 0.14, octave: 0.5, length: 7, notes: [0, null, null, null, null, null, null, null] },
    ],
  },
};
