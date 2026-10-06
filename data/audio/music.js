// Música. `src` (opcional) apunta a un archivo en assets/music/. Sin archivo, suena el patrón placeholder.
// Notas en semitonos respecto a `root` (Hz). null = silencio. Cada nota dura una corchea.
export default {
  menu: {
    bpm: 72, root: 220,
    pattern: [
      { wave: 'sine', volume: 0.12, notes: [0, null, 7, null, 12, null, 7, null, 3, null, 10, null, 15, null, 10, null] },
      { wave: 'triangle', volume: 0.08, octave: 0.5, length: 6, notes: [0, null, null, null, null, null, null, null, -4, null, null, null, null, null, null, null] },
    ],
  },
  examen_explore: {
    bpm: 112, root: 196,
    pattern: [
      // un tic-tac de reloj de examen
      { wave: 'square', volume: 0.03, length: 0.1, notes: [24, null, 19, null] },
      { wave: 'triangle', volume: 0.1, notes: [0, 3, 7, 3, 0, 3, 8, 3, -2, 2, 7, 2, -2, 2, 5, 2] },
      { wave: 'sine', volume: 0.12, octave: 0.5, length: 3.5, notes: [0, null, null, null, 0, null, null, null, -4, null, null, null, -5, null, null, null] },
    ],
  },
  examen_combat: {
    bpm: 132, root: 196,
    pattern: [
      { wave: 'square', volume: 0.04, length: 0.1, notes: [24, 19, 24, 19] },
      { wave: 'triangle', volume: 0.11, notes: [0, 3, 7, 10, 7, 3, 0, 3, -2, 2, 5, 9, 5, 2, -2, 2] },
      { wave: 'sawtooth', volume: 0.05, octave: 0.5, length: 1.5, notes: [0, null, 0, null, 0, null, 0, null, -4, null, -4, null, -5, null, -5, null] },
    ],
  },
  examen_boss: {
    bpm: 144, root: 174.6,
    pattern: [
      // metrónomo implacable
      { wave: 'square', volume: 0.05, length: 0.08, notes: [24, null, 24, null, 24, null, 24, null] },
      { wave: 'sawtooth', volume: 0.07, notes: [0, 1, 0, 6, 0, 1, 0, 7, 0, 1, 0, 6, 12, 11, 7, 6] },
      { wave: 'triangle', volume: 0.14, octave: 0.5, length: 3.5, notes: [0, null, null, null, 1, null, null, null, -2, null, null, null, -1, null, null, null] },
    ],
  },
};
