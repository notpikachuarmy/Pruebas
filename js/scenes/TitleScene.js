import { Scene } from './Scene.js';
import { Backdrop } from '../ui/Backdrop.js';
import { MainMenuScene } from './MainMenuScene.js';

export class TitleScene extends Scene {
  constructor(game) {
    super(game);
    this.backdrop = new Backdrop();
  }

  enter() { this.game.audio.playMusic('menu'); }

  update(dt) {
    super.update(dt);
    if (this.time > 0.3 && this.game.input.anyPressed) {
      this.game.audio.unlock();
      this.game.audio.play('menuOk');
      this.game.setScene(new MainMenuScene(this.game, this.backdrop));
    }
  }

  renderWorld(g) {
    this.backdrop.render(g, this.time, {
      sprite: this.game.assets.sprite('player'),
      player: { x: 330, y: 228, scale: 5 },
    });
  }

  renderUI(r) {
    r.text('Sueños', 40, 104, { size: 46, weight: 700, color: '#e8e6dc', shadow: '#eb2f2d' });
    r.text('Escucha lo que sueñan los demás. Entra. Despierta.', 42, 124, { size: 9, color: '#c9bde6' });
    if (Math.floor(this.time * 1.6) % 2 === 0) {
      const device = this.game.input.hasGamepad() ? 'Pulsa cualquier botón' : 'Pulsa cualquier tecla o haz clic';
      r.text(device, 42, 170, { size: 10, color: '#fff6d6' });
    }
    r.text('v0.7 · Fase 7: pulido', 8, 264, { size: 7, color: '#5d5480' });
  }
}
