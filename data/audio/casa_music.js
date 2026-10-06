// Música placeholder de La Casa a Oscuras: una cajita de música en compás de vals.
export default {
  casa_explore: {
    bpm: 84, root: 261.6,
    pattern: [
      { wave: 'sine', volume: 0.1, length: 0.6, notes: [12, null, 16, 19, null, 16, 12, null, 14, 17, null, 14, 11, null, 14, 17, null, 19] },
      { wave: 'triangle', volume: 0.09, octave: 0.5, length: 2.5, notes: [0, null, null, null, null, null, -3, null, null, null, null, null, -5, null, null, null, null, null] },
    ],
  },
  casa_combat: {
    bpm: 120, root: 220,
    pattern: [
      { wave: 'triangle', volume: 0.1, notes: [12, 15, 19, 15, 12, 15, 17, 14, 11, 14, 17, 14] },
      { wave: 'sine', volume: 0.12, octave: 0.5, length: 2.5, notes: [0, null, null, -2, null, null, -4, null, null, -5, null, null] },
    ],
  },
  casa_boss: {
    bpm: 108, root: 196,
    pattern: [
      { wave: 'square', volume: 0.03, length: 0.1, notes: [24, null, null, 24, null, null] },
      { wave: 'sawtooth', volume: 0.06, notes: [0, 3, 7, 12, 7, 3, -1, 2, 7, 11, 7, 2] },
      { wave: 'triangle', volume: 0.13, octave: 0.5, length: 5.5, notes: [0, null, null, null, null, null, -4, null, null, null, null, null] },
    ],
  },
};
