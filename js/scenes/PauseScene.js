import { Scene, dim } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { OptionsScene } from './OptionsScene.js';
import { ControlsScene } from './ControlsScene.js';
import { ConfirmScene } from './ConfirmScene.js';
import { ItemsScene } from './ItemsScene.js';

export class PauseScene extends Scene {
  constructor(game, gameScene) {
    super(game);
    this.overlay = true;
    this.gameScene = gameScene;
    const resume = () => game.popScene();
    this.menu = new Menu(game, [
      { type: 'button', label: 'Continuar', action: resume },
      { type: 'button', label: 'Objetos', action: () => game.pushScene(new ItemsScene(game, gameScene.world)) },
      { type: 'button', label: 'Controles', action: () => game.pushScene(new ControlsScene(game)) },
      { type: 'button', label: 'Opciones', action: () => game.pushScene(new OptionsScene(game)) },
      { type: 'button', label: 'Abandonar el sueño', action: () => this._confirmQuit() },
    ], { x: 240, y: 114, spacing: 15, width: 180, onCancel: resume });
  }

  _confirmQuit() {
    this.game.pushScene(new ConfirmScene(this.game, '¿Abandonar este sueño?', () => {
      this.gameScene.run.result = 'quit';
      this.game.events.emit('run:end', { result: 'quit', time: this.gameScene.run.time, run: this.gameScene.run });
      import('./MainMenuScene.js').then(({ MainMenuScene }) => this.game.setScene(new MainMenuScene(this.game)));
    }, { yes: 'Abandonar', detail: 'La run actual se perderá.' }));
  }

  update(dt) {
    super.update(dt);
    if (this.game.input.isPressed('PAUSE') && this.time > 0.05) { this.game.popScene(); return; }
    this.menu.update(dt);
  }

  renderUI(r) {
    dim(r, 0.72);
    r.text('Pausa', 240, 84, { size: 22, weight: 700, color: '#e8e6dc', align: 'center' });
    const run = this.gameScene.run;
    r.text(`${run.dream.name} · semilla ${run.seed}`, 240, 98, { size: 8, color: '#9b8fc7', align: 'center' });
    this.menu.render(r);
  }
}
