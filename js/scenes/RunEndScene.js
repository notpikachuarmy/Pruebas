import { Scene, dim } from './Scene.js';
import { Menu } from '../ui/Menu.js';

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** Resultado de la run: despertar tranquilo (victoria) o expulsión (muerte). */
export class RunEndScene extends Scene {
  constructor(game, run, world = null) {
    super(game);
    this.itemCount = world ? `${world.items.owned.length} (${world.items.synergies.length} sinergias)` : '—';
    this.overlay = true;
    this.run = run;
    const again = async () => {
      const { GameScene } = await import('./GameScene.js');
      game.setScene(new GameScene(game));
    };
    const menu = async () => {
      const { MainMenuScene } = await import('./MainMenuScene.js');
      game.setScene(new MainMenuScene(game));
    };
    this.menu = new Menu(game, [
      { type: 'button', label: 'Volver a dormir', action: again },
      { type: 'button', label: 'Menú principal', action: menu },
    ], { x: 240, y: 236, spacing: 14, width: 170 });
  }

  enter() { if (this.run.result === 'death') this.game.audio.stopMusic(); }

  update(dt) {
    super.update(dt);
    if (this.time > 0.6) this.menu.update(dt); // evita saltarse la pantalla sin querer
  }

  renderUI(r) {
    dim(r, Math.min(0.85, this.time * 2));
    const win = this.run.result === 'win';
    const end = this.run.dream.ending;   // sueños finales: texto propio
    const title = win ? (end?.title ?? 'Te despiertas tranquilo') : 'El sueño te expulsa';
    const by = this.run.expelledBy && this.game.content.enemies[this.run.expelledBy];
    const sub = !win && by ? `Te ha expulsado: ${by.name}` : win ? (end?.text ?? `${this.run.dream.owner.name} sigue durmiendo. Esta vez, mejor.`) : `${this.run.dream.owner.name} se revuelve en la cama.`;
    r.text(title, 240, 62, { size: 20, weight: 700, color: win ? '#ffd65c' : '#eb2f2d', align: 'center' });
    r.text(sub, 240, 78, { size: 9, color: '#c9bde6', align: 'center' });
    const rows = [
      ['Tiempo', fmt(this.run.time)],
      ['Sueños calmados', `${this.run.dreamsCleared + (this.run.result === 'win' ? 1 : 0)} / ${this.run.night.length}`],
      ['Salas exploradas', this.run.roomsVisited],
      ['Enemigos disipados', this.run.kills],
      ['Precisión', this.run.shots ? `${Math.round(this.run.accuracy * 100)}%` : '—'],
      ['Lucidez', this.run.lucidity],
      ['Objetos', this.itemCount],
      ['Semilla', this.run.seed],
    ];
    rows.forEach(([k, v], i) => {
      r.text(k, 170, 104 + i * 12, { size: 9, color: '#9b8fc7' });
      r.text(String(v), 310, 104 + i * 12, { size: 9, color: '#e8e6dc', align: 'right' });
    });
    const un = this.run.unlockedThisRun;
    if (un.length) {
      r.text('Esta noche has desbloqueado:', 240, 190, { size: 8, color: '#ffd65c', align: 'center' });
      un.slice(-3).forEach((l, i) => r.text(l, 240, 200 + i * 9, { size: 8, color: '#e8e6dc', align: 'center' }));
    }
    if (this.time > 0.6) this.menu.render(r);
  }
}
