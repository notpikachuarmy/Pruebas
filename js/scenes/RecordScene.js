import { Scene } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { Backdrop } from '../ui/Backdrop.js';

const fmtTime = (s) => `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min`;

/** Estadísticas permanentes (base de la futura pantalla de progreso). */
export class RecordScene extends Scene {
  constructor(game, backdrop = new Backdrop()) {
    super(game);
    this.backdrop = backdrop;
    this.menu = new Menu(game, [{ type: 'button', label: 'Volver', action: () => game.popScene() }],
      { x: 240, y: 236, onCancel: () => game.popScene() });
  }

  update(dt) { super.update(dt); this.menu.update(dt); }
  renderWorld(g) { this.backdrop.render(g, this.game.time); }

  renderUI(r) {
    const m = this.game.save.data.meta, s = m.stats;
    const total = Object.keys(this.game.content.enemies).length;
    const rows = [
      ['Noches', s.runs], ['Noches completas', s.nights], ['Expulsiones', s.deaths], ['Jefes vencidos', s.bossesDefeated],
      ['Enemigos disipados', s.kills], ['Precisión', s.shots ? `${Math.round((s.hits / s.shots) * 100)}%` : '—'],
      ['Lucidez reunida', s.lucidity], ['Tiempo soñando', fmtTime(s.playTime)],
      ['Enemigos descubiertos', `${m.discovered.enemies.length} / ${total}`],
      ['Objetos descubiertos', `${m.discovered.items.length} / ${Object.keys(this.game.content.items).length}`],
    ];
    r.text('Estadísticas', 240, 36, { size: 18, weight: 700, color: '#e8e6dc', align: 'center' });
    rows.forEach(([k, v], i) => {
      r.text(k, 140, 60 + i * 16, { size: 10, color: '#c9bde6' });
      r.text(String(v), 340, 60 + i * 16, { size: 10, color: '#fff6d6', align: 'right' });
    });
    this.menu.render(r);
  }
}
