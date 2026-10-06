import {
  ACTIONS, DEFAULT_KEYBOARD, DEFAULT_GAMEPAD, REBINDABLE,
  keyLabel, buttonLabel, detectPadStyle,
} from './InputBindings.js';
import { clamp } from './math.js';

const UI_DIRS = ['UI_UP', 'UI_DOWN', 'UI_LEFT', 'UI_RIGHT'];
const REPEAT_DELAY = 0.35;
const REPEAT_RATE = 0.09;
const STICK_UI_THRESHOLD = 0.55;
const TRIGGER_THRESHOLD = 0.5;

/** Zona muerta radial con reescalado: no hay "salto" al salir de la zona muerta. */
function applyDeadzone(out, x, y, deadzone) {
  const mag = Math.hypot(x, y);
  if (mag < deadzone) { out.x = 0; out.y = 0; out.mag = 0; return out; }
  const scaled = clamp((mag - deadzone) / (1 - deadzone), 0, 1);
  out.x = (x / mag) * scaled;
  out.y = (y / mag) * scaled;
  out.mag = scaled;
  return out;
}

/**
 * Sistema de input abstracto: teclado + mando → acciones.
 * Se actualiza una vez por paso de simulación (Input.update()).
 */
export class Input {
  constructor(settings, savedBindings) {
    this.settings = settings;
    this.saved = savedBindings;             // referencia al objeto del guardado
    this.bindings = { keyboard: {}, gamepad: {} };
    this.rebuildBindings();

    this.keysDown = new Set();
    this.keysTapped = new Set();            // pulsadas desde el último update
    this.down = new Set();
    this.pressed = new Set();
    this.repeatTimers = Object.fromEntries(UI_DIRS.map((a) => [a, 0]));

    this.prevButtons = [];
    this.padIndex = null;
    this.padStyle = 'xbox';
    this.padName = '';
    this.lastDevice = 'keyboard';

    this.move = { x: 0, y: 0, mag: 0 };
    this.aim = { x: 0, y: 0, mag: 0, active: false };
    this._stickL = { x: 0, y: 0, mag: 0 };
    this._stickR = { x: 0, y: 0, mag: 0 };
    this._prevStickUI = { UI_UP: false, UI_DOWN: false, UI_LEFT: false, UI_RIGHT: false };

    this.anyPressed = false;                // cualquier tecla/botón nuevo este paso
    this.capture = null;                    // callback de reasignación de controles
    this.listeners = new Set();             // cambios de dispositivo / conexión

    this._allBoundKeys = new Set();
    this._collectBoundKeys();

    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup', (e) => this.keysDown.delete(e.code));
    window.addEventListener('blur', () => this.keysDown.clear());
    window.addEventListener('gamepadconnected', (e) => this._onPadConnected(e.gamepad));
    window.addEventListener('gamepaddisconnected', (e) => this._onPadDisconnected(e.gamepad));
  }

  // ---------- Ratón (opcional, solo para apuntar y disparar) ----------

  /** Conecta el ratón al canvas. Las coordenadas se pasan a píxeles virtuales del juego. */
  attachPointer(canvas, renderer) {
    this.mouse = { x: 0, y: 0, down: false, lastMove: -1e9, tapped: false };
    const toVirtual = (e) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = canvas.width / rect.width;
      this.mouse.x = ((e.clientX - rect.left) * dpr - renderer.offsetX) / renderer.scale;
      this.mouse.y = ((e.clientY - rect.top) * dpr - renderer.offsetY) / renderer.scale;
    };
    canvas.addEventListener('pointermove', (e) => { toVirtual(e); this.mouse.lastMove = performance.now(); });
    canvas.addEventListener('pointerdown', (e) => {
      toVirtual(e);
      if (e.button === 0) { this.mouse.down = true; this.mouse.tapped = true; this.mouse.lastMove = performance.now(); }
    });
    window.addEventListener('pointerup', (e) => { if (e.button === 0) this.mouse.down = false; });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /** ¿Está el jugador usando el ratón para apuntar? (lo ha movido hace poco o mantiene el clic) */
  mouseAimActive() {
    const m = this.mouse;
    if (!m || !this.settings.mouseAim || this.lastDevice === 'gamepad') return false;
    return m.down || performance.now() - m.lastMove < 2500;
  }

  // ---------- API pública para la lógica del juego ----------

  isDown(action) { return this.down.has(action); }
  isPressed(action) { return this.pressed.has(action); }

  /** "MOVE" o "AIM": {x, y, mag} normalizado. AIM incluye `active` (fuera de la zona muerta). */
  getAxis(name) { return name === 'AIM' ? this.aim : this.move; }

  /** Texto del control asignado a una acción según el dispositivo en uso: "E", "Y", "✕"... */
  glyph(action, device = this.lastDevice) {
    if (device === 'gamepad') {
      const b = this.bindings.gamepad[action]?.[0];
      return buttonLabel(b, this.padStyle);
    }
    return keyLabel(this.bindings.keyboard[action]?.[0]);
  }

  hasGamepad() { return this.padIndex !== null; }

  getActivePad() {
    if (this.padIndex === null) return null;
    return navigator.getGamepads?.()[this.padIndex] ?? null;
  }

  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }

  // ---------- Reasignación ----------

  /** El siguiente botón/tecla pulsado se entrega a `fn({device, code})` en lugar de generar acciones. */
  startCapture(fn) { this.capture = fn; this.keysTapped.clear(); }
  cancelCapture() { this.capture = null; }

  rebind(action, device, code) {
    if (!ACTIONS[action]?.rebind) return;
    const table = this.saved[device];
    const current = this.bindings[device];
    // Si otra acción jugable usaba ese control, se lo quitamos (evita conflictos).
    for (const other of REBINDABLE) {
      if (other !== action && current[other]?.includes(code)) {
        table[other] = current[other].filter((c) => c !== code);
      }
    }
    // Sustituye el control principal y conserva los secundarios.
    const rest = (current[action] ?? []).slice(1).filter((c) => c !== code);
    table[action] = [code, ...rest];
    this.rebuildBindings();
  }

  resetBindings() {
    this.saved.keyboard = {};
    this.saved.gamepad = {};
    this.rebuildBindings();
  }

  rebuildBindings() {
    for (const action of Object.keys(ACTIONS)) {
      this.bindings.keyboard[action] = this.saved.keyboard?.[action] ?? DEFAULT_KEYBOARD[action] ?? [];
      this.bindings.gamepad[action] = this.saved.gamepad?.[action] ?? DEFAULT_GAMEPAD[action] ?? [];
    }
    if (this._allBoundKeys) this._collectBoundKeys();
  }

  // ---------- Actualización por paso ----------

  update(dt) {
    this.pressed.clear();
    this.down.clear();
    this.anyPressed = this.keysTapped.size > 0 || !!this.mouse?.tapped;
    if (this.mouse) this.mouse.tapped = false;

    const pad = this._pollPad();

    if (this.capture) { this._updateCapture(pad); return; }

    // Teclado
    const kb = this.bindings.keyboard;
    for (const action in kb) {
      for (const code of kb[action]) {
        if (this.keysTapped.has(code)) { this.pressed.add(action); this.down.add(action); }
        else if (this.keysDown.has(code)) this.down.add(action);
      }
    }
    this.keysTapped.clear();

    // Mando
    if (pad) this._readPad(pad);

    this._composeAxes(pad);
    this._uiRepeat(dt);
  }

  _readPad(pad) {
    const gp = this.bindings.gamepad;
    const buttons = pad.buttons;
    let anyNew = false;
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i];
      const isDown = b.pressed || b.value > TRIGGER_THRESHOLD;
      const was = this.prevButtons[i] || false;
      if (isDown && !was) anyNew = true;
      this.prevButtons[i] = isDown;
    }
    for (const action in gp) {
      for (const idx of gp[action]) {
        if (!this.prevButtons[idx]) continue;
        this.down.add(action);
        if (this._justPressed[idx]) this.pressed.add(action);
      }
    }

    applyDeadzone(this._stickL, pad.axes[0] ?? 0, pad.axes[1] ?? 0, this.settings.moveDeadzone);
    applyDeadzone(this._stickR, pad.axes[2] ?? 0, pad.axes[3] ?? 0, this.settings.aimDeadzone);
    if (anyNew) this.anyPressed = true;
    if (anyNew || this._stickL.mag > 0 || this._stickR.mag > 0) this._setDevice('gamepad');

    // Stick izquierdo también navega menús (con flanco, la repetición la gestiona _uiRepeat)
    const s = this._stickL;
    const dirs = {
      UI_UP: s.y < -STICK_UI_THRESHOLD, UI_DOWN: s.y > STICK_UI_THRESHOLD,
      UI_LEFT: s.x < -STICK_UI_THRESHOLD, UI_RIGHT: s.x > STICK_UI_THRESHOLD,
    };
    for (const a of UI_DIRS) {
      if (dirs[a]) { this.down.add(a); if (!this._prevStickUI[a]) this.pressed.add(a); }
      this._prevStickUI[a] = dirs[a];
    }
  }

  _pollPad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let pad = this.padIndex !== null ? pads[this.padIndex] : null;
    if (!pad || !pad.connected) {
      pad = null;
      for (const p of pads) if (p && p.connected) { pad = p; this._onPadConnected(p, true); break; }
    }
    // flancos de botón calculados antes de _readPad
    this._justPressed = this._justPressed || [];
    if (pad) {
      for (let i = 0; i < pad.buttons.length; i++) {
        const b = pad.buttons[i];
        const isDown = b.pressed || b.value > TRIGGER_THRESHOLD;
        this._justPressed[i] = isDown && !this.prevButtons[i];
      }
    }
    return pad;
  }

  _composeAxes(pad) {
    // Movimiento: teclado/cruceta digital, sustituido por el stick si se usa
    let mx = 0, my = 0;
    if (this.down.has('MOVE_LEFT')) mx -= 1;
    if (this.down.has('MOVE_RIGHT')) mx += 1;
    if (this.down.has('MOVE_UP')) my -= 1;
    if (this.down.has('MOVE_DOWN')) my += 1;
    const dl = Math.hypot(mx, my);
    if (pad && this._stickL.mag > 0) {
      this.move.x = this._stickL.x; this.move.y = this._stickL.y; this.move.mag = this._stickL.mag;
    } else if (dl > 0) {
      this.move.x = mx / dl; this.move.y = my / dl; this.move.mag = 1;
    } else {
      this.move.x = 0; this.move.y = 0; this.move.mag = 0;
    }

    // Apuntado: flechas o stick derecho. Dentro de la zona muerta → inactivo (se conserva la dirección previa).
    let ax = 0, ay = 0;
    if (this.down.has('AIM_LEFT')) ax -= 1;
    if (this.down.has('AIM_RIGHT')) ax += 1;
    if (this.down.has('AIM_UP')) ay -= 1;
    if (this.down.has('AIM_DOWN')) ay += 1;
    const al = Math.hypot(ax, ay);
    if (pad && this._stickR.mag > 0) {
      const m = Math.hypot(this._stickR.x, this._stickR.y);
      this.aim.x = this._stickR.x / m; this.aim.y = this._stickR.y / m;
      this.aim.mag = this._stickR.mag; this.aim.active = true;
    } else if (al > 0) {
      this.aim.x = ax / al; this.aim.y = ay / al; this.aim.mag = 1; this.aim.active = true;
    } else {
      this.aim.mag = 0; this.aim.active = false; // x,y conservan el último valor
    }
  }

  /** Auto-repetición al mantener una dirección en menús. */
  _uiRepeat(dt) {
    for (const a of UI_DIRS) {
      if (!this.down.has(a)) { this.repeatTimers[a] = 0; continue; }
      if (this.pressed.has(a)) { this.repeatTimers[a] = -REPEAT_DELAY; continue; }
      this.repeatTimers[a] += dt;
      if (this.repeatTimers[a] >= REPEAT_RATE) { this.repeatTimers[a] = 0; this.pressed.add(a); }
    }
  }

  _updateCapture(pad) {
    if (pad) {
      for (let i = 0; i < pad.buttons.length; i++) {
        if (this._justPressed[i]) {
          const b = pad.buttons[i];
          this.prevButtons[i] = b.pressed || b.value > TRIGGER_THRESHOLD;
          const fn = this.capture; this.capture = null;
          this._setDevice('gamepad');
          fn({ device: 'gamepad', code: i });
          return;
        }
      }
      for (let i = 0; i < pad.buttons.length; i++) {
        const b = pad.buttons[i];
        this.prevButtons[i] = b.pressed || b.value > TRIGGER_THRESHOLD;
      }
    }
    for (const code of this.keysTapped) {
      const fn = this.capture; this.capture = null;
      this.keysTapped.clear();
      this._setDevice('keyboard');
      fn({ device: 'keyboard', code });
      return;
    }
  }

  // ---------- Eventos del navegador ----------

  _onKeyDown(e) {
    // Evita que Tab cambie el foco, Espacio haga scroll, etc.
    if (this._allBoundKeys.has(e.code) || this.capture) e.preventDefault();
    if (e.repeat) return;
    this.keysDown.add(e.code);
    this.keysTapped.add(e.code);
    this._setDevice('keyboard');
  }

  _collectBoundKeys() {
    this._allBoundKeys.clear();
    for (const codes of Object.values(this.bindings.keyboard)) for (const c of codes) this._allBoundKeys.add(c);
  }

  _onPadConnected(gamepad, silent = false) {
    if (this.padIndex === gamepad.index) return;
    this.padIndex = gamepad.index;
    this.padName = gamepad.id;
    this.padStyle = detectPadStyle(gamepad.id);
    this.prevButtons = [];
    // Botones ya pulsados al conectar no cuentan como pulsación nueva
    gamepad.buttons.forEach((b, i) => { this.prevButtons[i] = b.pressed; });
    this._emit({ type: 'connected', name: gamepad.id, style: this.padStyle, mapping: gamepad.mapping, silent });
  }

  _onPadDisconnected(gamepad) {
    if (gamepad.index !== this.padIndex) return;
    this.padIndex = null;
    this.prevButtons = [];
    this._stickL.mag = 0; this._stickR.mag = 0;
    if (this.lastDevice === 'gamepad') this._setDevice('keyboard');
    this._emit({ type: 'disconnected', name: gamepad.id });
  }

  _setDevice(device) {
    if (this.lastDevice === device) return;
    this.lastDevice = device;
    this._emit({ type: 'device', device });
  }

  _emit(evt) { for (const fn of this.listeners) fn(evt); }
}
