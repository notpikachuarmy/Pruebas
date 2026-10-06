import { Scene } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { Backdrop } from '../ui/Backdrop.js';
import { ConfirmScene } from './ConfirmScene.js';
import { ACTIONS, REBINDABLE, keyLabel, buttonLabel } from '../core/InputBindings.js';

const CAPTURE_TIMEOUT = 6;
const PAD_REBINDABLE = new Set(['ATTACK', 'DASH', 'INTERACT', 'MAP', 'PAUSE']);

/**
 * Pantalla de controles: muestra teclado y mando a la vez.
 * Al elegir una acción, el siguiente control pulsado se asigna al dispositivo correspondiente.
 */
export class ControlsScene extends Scene {
  constructor(game, backdrop = new Backdrop()) {
    super(game);
    this.backdrop = backdrop;
    this.capturing = null;
    this.captureTime = 0;
    const input = game.input;

    const rows = REBINDABLE.map((action) => ({
      type: 'button',
      label: ACTIONS[action].label,
      action: () => this._startCapture(action),
      value: () => {
        const k = keyLabel(input.bindings.keyboard[action]?.[0]);
        const pad = input.bindings.gamepad[action];
        const b = pad?.length ? buttonLabel(pad[0], input.padStyle) : action.startsWith('AIM') ? 'Stick der.' : '—';
        return [k, b];
      },
    }));
    rows.push({ type: 'button', label: 'Restaurar controles por defecto', action: () => this._confirmReset() });
    rows.push({ type: 'button', label: 'Volver', action: () => game.popScene() });

    this.menu = new Menu(game, rows, { x: 240, y: 52, spacing: 12, width: 300, size: 9, columns: [312, 362], onCancel: () => game.popScene() });
  }

  _startCapture(action) {
    this.capturing = action;
    this.captureTime = 0;
    this.game.input.startCapture(({ device, code }) => {
      const a = this.capturing;
      this.capturing = null;
      if (device === 'keyboard' && code === 'Escape' && a !== 'PAUSE') return; // Esc cancela
      if (device === 'gamepad' && !PAD_REBINDABLE.has(a)) {
        this.game.toasts.show('El movimiento y apuntado del mando usan los sticks');
        return;
      }
      this.game.input.rebind(a, device, code);
      this.game.save.persist();
      this.game.toasts.show(`${ACTIONS[a].label}: ${device === 'keyboard' ? keyLabel(code) : buttonLabel(code, this.game.input.padStyle)}`);
    });
  }

  _confirmReset() {
    this.game.pushScene(new ConfirmScene(this.game, '¿Restaurar los controles?', () => {
      this.game.input.resetBindings();
      this.game.save.persist();
      this.game.toasts.show('Controles restaurados');
    }, { yes: 'Restaurar' }));
  }

  update(dt) {
    super.update(dt);
    if (this.capturing) {
      this.captureTime += dt;
      if (this.captureTime > CAPTURE_TIMEOUT) { this.game.input.cancelCapture(); this.capturing = null; }
      return;
    }
    this.menu.update(dt);
  }

  renderWorld(g) { this.backdrop.render(g, this.game.time); }

  renderUI(r) {
    r.text('Controles', 240, 26, { size: 16, weight: 700, color: '#e8e6dc', align: 'center' });
    r.text('Teclado', 312, 40, { size: 8, color: '#9b8fc7', align: 'center' });
    const padTitle = this.game.input.hasGamepad() ? 'Mando' : 'Mando (sin conectar)';
    r.text(padTitle, 362, 40, { size: 8, color: '#9b8fc7', align: 'center' });
    this.menu.render(r);
    r.text('Stick izquierdo: mover · Stick derecho: apuntar', 240, 264, { size: 7, color: '#5d5480', align: 'center' });
    if (this.capturing) {
      const ctx = r.ui;
      ctx.globalAlpha = 0.85; ctx.fillStyle = '#0e0a1c'; ctx.fillRect(0, 0, r.width, r.height); ctx.globalAlpha = 1;
      r.text(ACTIONS[this.capturing].label, 240, 120, { size: 14, weight: 700, color: '#ffd65c', align: 'center' });
      r.text('Pulsa una tecla o un botón del mando', 240, 140, { size: 10, color: '#e8e6dc', align: 'center' });
      r.text(`Esc o espera ${Math.ceil(CAPTURE_TIMEOUT - this.captureTime)} s para cancelar`, 240, 156, { size: 8, color: '#9b8fc7', align: 'center' });
    }
  }
}
