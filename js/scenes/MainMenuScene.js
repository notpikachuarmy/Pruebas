import { Scene } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { Backdrop } from '../ui/Backdrop.js';
import { GameScene } from './GameScene.js';
import { OptionsScene } from './OptionsScene.js';
import { ControlsScene } from './ControlsScene.js';
import { RecordScene } from './RecordScene.js';

export class MainMenuScene extends Scene {
  constructor(game, backdrop = new Backdrop()) {
    super(game);
    this.backdrop = backdrop;
    this.menu = new Menu(game, [
      { type: 'button', label: 'Empezar a soñar', action: () => game.setScene(new GameScene(game)), hint: 'Nueva run en El Examen Infinito' },
      { type: 'button', label: 'Controles', action: () => game.pushScene(new ControlsScene(game, backdrop)), hint: 'Consulta y cambia teclas y botones' },
      { type: 'button', label: 'Opciones', action: () => game.pushScene(new OptionsScene(game, backdrop)), hint: 'Sonido, vibración, sensibilidad y datos guardados' },
      { type: 'button', label: 'Registro', action: () => game.pushScene(new RecordScene(game, backdrop)), hint: 'Tus estadísticas entre runs' },
    ], { x: 42, y: 160, align: 'left', width: 150, spacing: 16, size: 11 });
  }

  enter() { this.game.audio.playMusic('menu'); }

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
