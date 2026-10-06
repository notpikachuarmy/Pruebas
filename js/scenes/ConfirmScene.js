import { Scene, dim } from './Scene.js';
import { Menu } from '../ui/Menu.js';

/** Diálogo Sí/No superpuesto. */
export class ConfirmScene extends Scene {
  constructor(game, message, onYes, { yes = 'Sí', no = 'Cancelar', detail = '' } = {}) {
    super(game);
    this.overlay = true;
    this.message = message;
    this.detail = detail;
    this.menu = new Menu(game, [
      { type: 'button', label: no, action: () => game.popScene() },
      { type: 'button', label: yes, action: () => { game.popScene(); onYes(); } },
    ], { x: 240, y: 150, spacing: 16, width: 140, onCancel: () => game.popScene() });
  }

  update(dt) { super.update(dt); this.menu.update(dt); }

  renderUI(r) {
    dim(r, 0.8);
    r.text(this.message, 240, 110, { size: 12, weight: 700, color: '#e8e6dc', align: 'center' });
    if (this.detail) r.text(this.detail, 240, 126, { size: 8, color: '#9b8fc7', align: 'center' });
    this.menu.render(r);
  }
}
