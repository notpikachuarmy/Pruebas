import { Scene } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { Backdrop } from '../ui/Backdrop.js';
import { GameScene } from './GameScene.js';
import { OptionsScene } from './OptionsScene.js';
import { ControlsScene } from './ControlsScene.js';
import { RecordScene } from './RecordScene.js';
import { AchievementsScene } from './AchievementsScene.js';
import { DreamersScene } from './DreamersScene.js';
import { Run } from '../world/Run.js';
import { Random } from '../core/Random.js';

export class MainMenuScene extends Scene {
  constructor(game, backdrop = new Backdrop()) {
    super(game);
    this.backdrop = backdrop;
    this.menu = new Menu(game, [
      { type: 'button', label: 'Empezar a soñar', action: () => game.setScene(new GameScene(game)), hint: () => this._nightHint() },
      { type: 'button', label: 'Soñadores', action: () => game.pushScene(new DreamersScene(game, backdrop)), hint: 'Quién sueña cada sueño y lo que has descubierto' },
      { type: 'button', label: 'Logros', action: () => game.pushScene(new AchievementsScene(game, backdrop)), hint: 'Algunos logros desbloquean sueños y objetos' },
      { type: 'button', label: 'Estadísticas', action: () => game.pushScene(new RecordScene(game, backdrop)), hint: 'Tus números entre runs' },
      { type: 'button', label: 'Controles', action: () => game.pushScene(new ControlsScene(game, backdrop)), hint: 'Consulta y cambia teclas y botones' },
      { type: 'button', label: 'Opciones', action: () => game.pushScene(new OptionsScene(game, backdrop)), hint: 'Sonido, vibración, sensibilidad y datos guardados' },
    ], { x: 42, y: 144, align: 'left', width: 150, spacing: 15, size: 11 });
  }

  enter() { this.game.audio.playMusic('menu'); }

  /** Qué sueños tocan esta noche (según lo desbloqueado). */
  _nightHint() {
    const ids = Run.planNight(this.game, new Random('vista'));
    return `Esta noche: ${ids.map((id) => this.game.content.dreams[id].name).join(' → ')}`;
  }

  update(dt) { super.update(dt); this.menu.update(dt); }

  renderWorld(g) {
    this.backdrop.render(g, this.game.time, {
      sprite: this.game.assets.sprite('player'),
      player: { x: 330, y: 228, scale: 5 },
    });
  }

  renderUI(r) {
    r.text('Sueños', 40, 104, { size: 46, weight: 700, color: '#e8e6dc', shadow: '#eb2f2d' });
    this.menu.render(r);
    if (!this.game.save.available) r.text('El navegador no permite guardar: el progreso se perderá al cerrar', 240, 238, { size: 7, color: '#d6403a', align: 'center' });
  }
}
