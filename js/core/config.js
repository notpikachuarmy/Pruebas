// Constantes globales del motor. Cambiar aquí, no repartidas por el código.
export const VIEW_W = 480;          // resolución interna (pixel art)
export const VIEW_H = 270;
export const TILE = 16;
export const ROOM_COLS = 28;        // todas las salas comparten tamaño (puertas en posiciones fijas)
export const ROOM_ROWS = 15;
export const ROOM_OFFSET_X = 16;    // dónde se dibuja la sala dentro de la pantalla
export const ROOM_OFFSET_Y = 24;
export const FIXED_DT = 1 / 60;     // la simulación siempre avanza a 60 pasos/s
export const MAX_FRAME_DT = 0.25;   // evita la "espiral de la muerte" tras pestaña inactiva
export const SAVE_KEY = 'suenos.save';
export const SAVE_VERSION = 2;
export const UI_FONT = '"Pixelify Sans", "Trebuchet MS", sans-serif';

export const DEBUG = new URLSearchParams(location.search).has('debug');
