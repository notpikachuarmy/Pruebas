import { Scene, closeHint, wantsClose } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { Backdrop } from '../ui/Backdrop.js';

/** Lista de logros con su descripción y recompensa. */
export class AchievementsScene extends Scene {
  constructor(game, backdrop = new Backdrop()) {
    super(game);
    this.backdrop = backdrop;
    const sys = game.achievements;
    this.list = game.content.achievements;
    const rows = this.list.map((a) => ({ type: 'button', label: sys.isUnlocked(a.id) ? `✓ ${a.name}` : a.name, action: () => {} }));
    rows.push({ type: 'button', label: 'Volver', action: () => game.popScene() });
    this.menu = new Menu(game, rows, { x: 40, y: 62, align: 'left', width: 170, spacing: 12, size: 9, maxVisible: 14, onCancel: () => game.popScene() });
  }

  update(dt) {
    super.update(dt);
    if (this.time > 0.1 && wantsClose(this.game)) { this.game.popScene(); return; }
    this.menu.update(dt);
  }
  renderWorld(g) { this.backdrop.render(g, this.game.time); }

  renderUI(r) {
    closeHint(r, this.game);
    const sys = this.game.achievements;
    const done = this.list.filter((a) => sys.isUnlocked(a.id)).length;
    r.text('Logros', 240, 30, { size: 18, weight: 700, color: '#e8e6dc', align: 'center' });
    r.text(`${done} / ${this.list.length}`, 240, 44, { size: 8, color: '#9b8fc7', align: 'center' });
    this.menu.render(r);
    const a = this.list[this.menu.index];
    if (!a) return;
    const unlocked = sys.isUnlocked(a.id);
    r.text(a.name, 250, 76, { size: 12, weight: 700, color: unlocked ? '#ffd65c' : '#c9bde6' });
    r.text(a.description, 250, 94, { size: 9, color: '#e8e6dc' });
    if (a.reward) {
      const c = this.game.content;
      const what = a.reward.dream ? `Sueño: ${c.dreams[a.reward.dream].name}` : `Objeto: ${c.items[a.reward.item].name}`;
      r.text(unlocked ? `Desbloqueado → ${what}` : 'Desbloquea algo nuevo', 250, 112, { size: 8, color: unlocked ? '#7fd6a0' : '#9b8fc7' });
    }
    if (unlocked) r.text(new Date(this.game.save.data.meta.achievements[a.id]).toLocaleDateString('es-ES'), 250, 128, { size: 7, color: '#5d5480' });
  }
}
