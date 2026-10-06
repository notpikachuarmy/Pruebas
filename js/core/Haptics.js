// Vibración opcional del mando. Si el navegador o el mando no la soportan, no hace nada.

const PRESETS = {
  hurt:      { duration: 160, strongMagnitude: 0.7, weakMagnitude: 0.4 },
  shoot:     { duration: 25,  strongMagnitude: 0.0, weakMagnitude: 0.12 },
  heavy:     { duration: 120, strongMagnitude: 0.5, weakMagnitude: 0.5 },
  kill:      { duration: 50,  strongMagnitude: 0.15, weakMagnitude: 0.3 },
  bossDown:  { duration: 700, strongMagnitude: 1.0, weakMagnitude: 0.8 },
  event:     { duration: 220, strongMagnitude: 0.3, weakMagnitude: 0.6 },
  death:     { duration: 450, strongMagnitude: 0.9, weakMagnitude: 0.5 },
};

export class Haptics {
  constructor(input, settings) {
    this.input = input;
    this.settings = settings;
  }

  play(kind) {
    if (!this.settings.vibration || this.input.lastDevice !== 'gamepad') return;
    const pad = this.input.getActivePad();
    const effect = PRESETS[kind];
    if (!pad || !effect) return;
    try {
      if (pad.vibrationActuator?.playEffect) {
        pad.vibrationActuator.playEffect('dual-rumble', { startDelay: 0, ...effect }).catch(() => {});
      } else if (pad.hapticActuators?.[0]?.pulse) {
        pad.hapticActuators[0].pulse(effect.strongMagnitude, effect.duration);
      }
    } catch { /* navegador sin soporte */ }
  }
}
