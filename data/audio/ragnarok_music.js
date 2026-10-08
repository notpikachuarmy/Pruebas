// Música placeholder de Ragnarök: tambores de guerra y un riff grave.
export default {
  ragnarok_boss: {
    bpm: 150, root: 110,
    pattern: [
      { wave: 'square', volume: 0.06, length: 0.12, notes: [12, null, 12, 12, null, 12, null, 12] },
      { wave: 'sawtooth', volume: 0.07, notes: [0, 0, 3, 0, 5, 0, 6, 5, 0, 0, 3, 0, 8, 7, 6, 5] },
      { wave: 'triangle', volume: 0.15, octave: 0.5, length: 3.5, notes: [0, null, null, null, -2, null, null, null, -4, null, null, null, -5, null, null, null] },
    ],
  },
};
