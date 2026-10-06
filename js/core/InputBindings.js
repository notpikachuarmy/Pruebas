// Acciones del juego y sus controles por defecto.
// La lógica del juego SOLO conoce los nombres de acción, nunca teclas ni botones.

/** rebind: el jugador puede cambiarla en la pantalla de controles. */
export const ACTIONS = {
  MOVE_UP:    { label: 'Mover arriba',     rebind: true },
  MOVE_DOWN:  { label: 'Mover abajo',      rebind: true },
  MOVE_LEFT:  { label: 'Mover izquierda',  rebind: true },
  MOVE_RIGHT: { label: 'Mover derecha',    rebind: true },
  AIM_UP:     { label: 'Apuntar arriba',   rebind: true },
  AIM_DOWN:   { label: 'Apuntar abajo',    rebind: true },
  AIM_LEFT:   { label: 'Apuntar izquierda', rebind: true },
  AIM_RIGHT:  { label: 'Apuntar derecha',  rebind: true },
  ATTACK:     { label: 'Atacar',           rebind: true },
  DASH:       { label: 'Silencio (esquiva)', rebind: true },
  INTERACT:   { label: 'Interactuar',      rebind: true },
  MAP:        { label: 'Mapa',             rebind: true },
  PAUSE:      { label: 'Pausa',            rebind: true },
  // Navegación de menús: fija, para que nunca se pueda dejar el menú inutilizable.
  UI_UP:      { label: 'Menú arriba' },
  UI_DOWN:    { label: 'Menú abajo' },
  UI_LEFT:    { label: 'Menú izquierda' },
  UI_RIGHT:   { label: 'Menú derecha' },
  UI_CONFIRM: { label: 'Aceptar' },
  UI_CANCEL:  { label: 'Volver' },
};

export const REBINDABLE = Object.keys(ACTIONS).filter((a) => ACTIONS[a].rebind);

// Teclas: KeyboardEvent.code (independiente del idioma del teclado).
export const DEFAULT_KEYBOARD = {
  MOVE_UP: ['KeyW'], MOVE_DOWN: ['KeyS'], MOVE_LEFT: ['KeyA'], MOVE_RIGHT: ['KeyD'],
  AIM_UP: ['ArrowUp'], AIM_DOWN: ['ArrowDown'], AIM_LEFT: ['ArrowLeft'], AIM_RIGHT: ['ArrowRight'],
  ATTACK: ['Space'],
  DASH: ['ShiftLeft', 'ShiftRight'],
  INTERACT: ['KeyE'],
  MAP: ['Tab'],
  PAUSE: ['Escape', 'KeyP'],
  UI_UP: ['ArrowUp', 'KeyW'], UI_DOWN: ['ArrowDown', 'KeyS'],
  UI_LEFT: ['ArrowLeft', 'KeyA'], UI_RIGHT: ['ArrowRight', 'KeyD'],
  UI_CONFIRM: ['Enter', 'Space', 'KeyE'],
  UI_CANCEL: ['Escape', 'Backspace'],
};

// Botones según el "standard mapping" de la Gamepad API:
// 0 A/✕  1 B/○  2 X/□  3 Y/△  4 LB  5 RB  6 LT  7 RT  8 View/Select  9 Menu/Start
// 10 L3  11 R3  12-15 cruceta (arriba, abajo, izquierda, derecha)
export const DEFAULT_GAMEPAD = {
  MOVE_UP: [12], MOVE_DOWN: [13], MOVE_LEFT: [14], MOVE_RIGHT: [15],
  AIM_UP: [], AIM_DOWN: [], AIM_LEFT: [], AIM_RIGHT: [],
  ATTACK: [7, 2],
  DASH: [0, 5],
  INTERACT: [3],
  MAP: [8],
  PAUSE: [9],
  UI_UP: [12], UI_DOWN: [13], UI_LEFT: [14], UI_RIGHT: [15],
  UI_CONFIRM: [0],
  UI_CANCEL: [1],
};

const KEY_NAMES = {
  Space: 'Espacio', ShiftLeft: 'Mayús', ShiftRight: 'Mayús der.', ControlLeft: 'Ctrl', ControlRight: 'Ctrl der.',
  AltLeft: 'Alt', AltRight: 'Alt Gr', Enter: 'Intro', Escape: 'Esc', Backspace: 'Retroceso', Tab: 'Tab',
  ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', CapsLock: 'Bloq Mayús',
  Semicolon: 'Ñ', Quote: '´', BracketLeft: '`', BracketRight: '+', Backslash: 'Ç', Minus: "'", Equal: '¡',
  Comma: ',', Period: '.', Slash: '-', Backquote: 'º', IntlBackslash: '<',
};

export function keyLabel(code) {
  if (!code) return '—';
  if (KEY_NAMES[code]) return KEY_NAMES[code];
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Numpad')) return 'Num ' + code.slice(6);
  return code;
}

const PAD_GLYPHS = {
  xbox: ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'View', 'Menu', 'L3', 'R3', '↑', '↓', '←', '→', 'Guide'],
  playstation: ['✕', '○', '□', '△', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', '↑', '↓', '←', '→', 'PS'],
  nintendo: ['B', 'A', 'Y', 'X', 'L', 'R', 'ZL', 'ZR', '−', '+', 'L3', 'R3', '↑', '↓', '←', '→', 'Home'],
};

/** Deduce la familia de mando a partir de Gamepad.id para mostrar los iconos correctos. */
export function detectPadStyle(id = '') {
  const s = id.toLowerCase();
  if (/054c|playstation|dualsense|dualshock|sony/.test(s)) return 'playstation';
  if (/057e|nintendo|pro controller|joy-con/.test(s)) return 'nintendo';
  return 'xbox';
}

export function buttonLabel(index, style = 'xbox') {
  if (index == null) return '—';
  return PAD_GLYPHS[style]?.[index] ?? `Botón ${index}`;
}
