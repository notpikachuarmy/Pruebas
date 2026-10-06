import { Scene, dim } from './Scene.js';
import { Menu } from '../ui/Menu.js';
import { choiceBlocked, applyChoice } from '../world/EventEffects.js';

/** Diálogo de evento con elecciones, manejable con mando. Pausa la partida mientras está abierto. */
export class EventScene extends Scene {
  constructor(game, world, obj) {
    super(game);
    this.overlay = true;
    this.world = world;
    this.obj = obj;
    this.def = game.content.events[obj.event];
    this.result = null;
    this.menu = new Menu(game, this.def.choices.map((c) => ({
      type: 'button',
      label: c.label,
      disabled: () => !!choiceBlocked(world, c),
      hint: () => choiceBlocked(world, c) ?? '',
      action: () => this._choose(c),
    })), { x: 240, y: 170, spacing: 16, width: 340, size: 9 });
  }

  _choose(choice) {
    applyChoice(this.world, choice);
    this.obj.done = true;
    this.world.game.events.emit('event:choice', { event: this.def.id, choice });
    this.result = choice.result ?? '';
    this.menu = new Menu(this.game, [{ type: 'button', label: 'Continuar', action: () => this.game.popScene() }],
      { x: 240, y: 190, onCancel: () => this.game.popScene() });
  }

  update(dt) { super.update(dt); if (this.time > 0.2) this.menu.update(dt); }

  renderUI(r) {
    dim(r, 0.8);
    r.text(this.def.title, 240, 82, { size: 14, weight: 700, color: '#fff6d6', align: 'center' });
    const lines = this.result !== null ? [this.result] : this.def.text;
    lines.forEach((l, i) => r.text(l, 240, 110 + i * 14, { size: 9, color: '#c9bde6', align: 'center' }));
    this.menu.render(r);
  }
}
