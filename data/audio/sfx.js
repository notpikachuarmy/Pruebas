// Efectos de sonido. Para usar un archivo real añade `src: 'assets/sounds/nombre.ogg'`.
// Sin `src`, se sintetiza un placeholder con estos parámetros.
export default {
  shoot:      { wave: 'triangle', from: 880, to: 520, duration: 0.07, volume: 0.12 },
  hitEnemy:   { wave: 'square', from: 300, to: 160, duration: 0.06, volume: 0.12 },
  killEnemy:  { wave: 'noise', from: 900, duration: 0.18, volume: 0.35 },
  wallHit:    { wave: 'noise', from: 2400, duration: 0.04, volume: 0.08 },
  dash:       { wave: 'sine', from: 600, to: 1400, duration: 0.12, volume: 0.15 },
  hurt:       { wave: 'sawtooth', from: 220, to: 70, duration: 0.25, volume: 0.25 },
  death:      { wave: 'sawtooth', from: 330, to: 40, duration: 0.9, volume: 0.3 },
  pickup:     { wave: 'sine', from: 990, to: 1480, duration: 0.09, volume: 0.15 },
  heal:       { wave: 'triangle', from: 520, to: 1040, duration: 0.2, volume: 0.2 },
  windup:     { wave: 'square', from: 140, to: 190, duration: 0.18, volume: 0.06 },
  spawn:      { wave: 'noise', from: 500, duration: 0.25, volume: 0.07 },
  waveStart:  { wave: 'triangle', from: 660, to: 660, duration: 0.25, volume: 0.18 },
  cleared:    { wave: 'triangle', from: 523, to: 1046, duration: 0.5, volume: 0.22 },
  heartbeat:  { wave: 'sine', from: 70, to: 45, duration: 0.18, volume: 0.35 },
  menuMove:   { wave: 'square', from: 700, to: 700, duration: 0.03, volume: 0.06 },
  menuOk:     { wave: 'square', from: 880, to: 1320, duration: 0.07, volume: 0.08 },
  menuBack:   { wave: 'square', from: 520, to: 330, duration: 0.07, volume: 0.08 },
};
