/** "[E] Interactuar" o "[Y] Interactuar" según el dispositivo que se esté usando. */
export function promptText(game, action, label) {
  return `[${game.input.glyph(action)}] ${label}`;
}
