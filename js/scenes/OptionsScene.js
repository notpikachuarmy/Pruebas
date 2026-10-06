import { Scene } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { Backdrop } from '../ui/Backdrop.js';
import { ConfirmScene } from './ConfirmScene.js';

const pct = (v) => `${Math.round(v * 100)}%`;

export class OptionsScene extends Scene {
  constructor(game, backdrop = new Backdrop()) {
    super(game);
    this.backdrop = backdrop;
    const s = game.save.data.settings;
    const set = (key, after) => (v) => { s[key] = v; after?.(); game.save.persist(); };
    const volumes = () => game.audio.applyVolumes();

    this.menu = new Menu(game, [
      { type: 'range', label: 'Música', get: () => s.musicVolume, set: set('musicVolume', volumes), min: 0, max: 1, step: 0.1, format: pct },
      { type: 'range', label: 'Efectos', get: () => s.sfxVolume, set: set('sfxVolume', volumes), min: 0, max: 1, step: 0.1, format: pct },
      { type: 'toggle', label: 'Vibración del mando', get: () => s.vibration, set: set('vibration', () => s.vibration && game.haptics.play('event')) },
      { type: 'range', label: 'Zona muerta (mover)', get: () => s.moveDeadzone, set: set('moveDeadzone'), min: 0.05, max: 0.5, step: 0.05, format: pct, hint: 'Súbela si el personaje se mueve solo con el stick suelto' },
      { type: 'range', label: 'Zona muerta (apuntar)', get: () => s.aimDeadzone, set: set('aimDeadzone'), min: 0.05, max: 0.6, step: 0.05, format: pct },
      { type: 'toggle', label: 'Disparar al apuntar', get: () => s.fireOnAim, set: set('fireOnAim'), hint: 'Apuntar con flechas o stick derecho también dispara' },
      { type: 'toggle', label: 'Temblor de pantalla', get: () => s.screenShake, set: set('screenShake') },
      { type: 'toggle', label: 'Mostrar FPS', get: () => s.showFps, set: set('showFps') },
      { type: 'button', label: 'Reiniciar progreso', action: () => this._confirmReset(), hint: 'Borra estadísticas y desbloqueos. Conserva opciones y controles' },
      { type: 'button', label: 'Borrar todos los datos', action: () => this._confirmWipe(), hint: 'Vuelve al estado de la primera vez que abriste el juego' },
      { type: 'button', label: 'Volver', action: () => this.back() },
    ], { x: 240, y: 62, spacing: 14, width: 260, onCancel: () => this.back() });
  }

  back() { this.game.popScene(); }

  _confirmReset() {
    this.game.pushScene(new ConfirmScene(this.game, '¿Reiniciar el progreso?', () => {
      this.game.save.resetProgress();
      this.game.toasts.show('Progreso reiniciado');
    }, { yes: 'Reiniciar', detail: 'Estadísticas, desbloqueos y logros volverán a cero.' }));
  }

  _confirmWipe() {
    this.game.pushScene(new ConfirmScene(this.game, '¿Borrar todos los datos?', () => {
      this.game.save.wipeAll();
      this.game.input.rebuildBindings();
      this.game.audio.applyVolumes();
      this.game.toasts.show('Datos borrados');
    }, { yes: 'Borrar todo', detail: 'Incluye opciones y controles personalizados. No se puede deshacer.' }));
  }

  update(dt) { super.update(dt); this.menu.update(dt); }

  renderWorld(g) { this.backdrop.render(g, this.game.time); }

  renderUI(r) {
    r.text('Opciones', 240, 36, { size: 18, weight: 700, color: '#e8e6dc', align: 'center' });
    this.menu.render(r);
  }
}
