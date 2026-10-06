import { SAVE_VERSION } from './config.js';

/** Estructura completa del guardado. Todo campo nuevo debe añadirse aquí con su valor por defecto. */
export function defaultSave() {
  return {
    version: SAVE_VERSION,
    settings: {
      musicVolume: 0.5,
      sfxVolume: 0.8,
      vibration: true,
      moveDeadzone: 0.2,
      aimDeadzone: 0.3,
      fireOnAim: true,       // apuntar con flechas / stick derecho también dispara
      screenShake: true,
      showFps: false,
    },
    bindings: { keyboard: {}, gamepad: {} }, // solo se guardan los cambios del jugador
    meta: {
      stats: {
        runs: 0, wins: 0, deaths: 0,
        kills: 0, shots: 0, hits: 0,
        damageTaken: 0, playTime: 0, lucidity: 0,
      },
      unlocks: { dreams: ['examen'], items: [], characters: ['oyente'] },
      discovered: { enemies: [], bosses: [], items: [] },
      achievements: {},
    },
  };
}

function isPlainObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }

/** Mezcla un guardado antiguo con los valores por defecto actuales (tolera campos nuevos o corruptos). */
function mergeDefaults(def, loaded) {
  if (!isPlainObject(loaded)) return def;
  const out = { ...def };
  for (const key of Object.keys(loaded)) {
    const d = def[key], l = loaded[key];
    if (d === undefined) out[key] = l;                       // datos extra (bindings, logros...)
    else if (isPlainObject(d)) out[key] = mergeDefaults(d, l);
    else if (Array.isArray(d)) out[key] = Array.isArray(l) ? l : d;
    else if (typeof d === typeof l) out[key] = l;
  }
  return out;
}

// Migraciones entre versiones de guardado: { [versionOrigen]: (data) => data }
const MIGRATIONS = {};

function refill(target, source) {
  if (target === source) return;
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, source);
}

function safeStorage() {
  try {
    const k = '__suenos_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return localStorage;
  } catch {
    return null; // modo privado estricto, cookies bloqueadas...
  }
}

export class SaveSystem {
  constructor(key) {
    this.key = key;
    this.storage = safeStorage();
    this.available = !!this.storage;
    this.data = defaultSave();
  }

  load() {
    if (!this.storage) return this.data;
    try {
      const raw = this.storage.getItem(this.key);
      if (raw) {
        let parsed = JSON.parse(raw);
        while (parsed.version < SAVE_VERSION && MIGRATIONS[parsed.version]) {
          parsed = MIGRATIONS[parsed.version](parsed);
        }
        this.replaceData(mergeDefaults(defaultSave(), parsed));
        this.data.version = SAVE_VERSION;
      }
    } catch (err) {
      console.warn('[Save] Guardado ilegible, se usan valores por defecto.', err);
    }
    return this.data;
  }

  persist() {
    if (!this.storage) return false;
    try {
      this.storage.setItem(this.key, JSON.stringify(this.data));
      return true;
    } catch (err) {
      console.warn('[Save] No se pudo guardar.', err);
      return false;
    }
  }

  /**
   * Sustituye el contenido manteniendo las mismas referencias de objeto,
   * porque Input y Audio leen `settings` y `bindings` en vivo.
   */
  replaceData(next) {
    for (const k of ['settings', 'bindings', 'meta']) refill(this.data[k], next[k]);
    this.data.version = next.version;
  }

  /** Borra el progreso (estadísticas, desbloqueos) pero conserva opciones y controles. */
  resetProgress() {
    refill(this.data.meta, defaultSave().meta);
    this.persist();
  }

  /** Borra absolutamente todo. */
  wipeAll() {
    try { this.storage?.removeItem(this.key); } catch { /* nada */ }
    this.replaceData(defaultSave());
  }
}
