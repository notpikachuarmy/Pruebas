import { Scene } from './Scene.js';
import { Run } from '../world/Run.js';
import { World } from '../world/World.js';
import { HUD } from '../ui/HUD.js';
import { PauseScene } from './PauseScene.js';
import { RunEndScene } from './RunEndScene.js';

/**
 * Partida en curso. Fase 2: una run = un sueño = una sala con oleadas.
 * En Fase 3 RoomManager sustituirá a la sala única y GameScene no cambiará mucho.
 */
export class GameScene extends Scene {
  constructor(game, { seed } = {}) {
    super(game);
    const urlSeed = new URLSearchParams(location.search).get('seed');
    this.run = new Run(game, { seed: seed ?? urlSeed ?? undefined });
    this.world = this._createWorld(this.run.dream.roomPool[0]);
    this.hud = new HUD(game);
    this.introTime = 2.5;
    this.endTimer = -1;
    this._unsubs = [];
  }

  _createWorld(roomId) {
    const w = new World(this.game, this.run, roomId);
    w.onDeath = () => { this.endTimer = 1.6; };
    return w;
  }

  enter() {
    const ev = this.game.events, run = this.run;
    this._unsubs.push(
      ev.on('enemy:killed', () => run.kills++),
      ev.on('player:shot', () => run.shots++),
      ev.on('player:hitEnemy', () => run.hits++),
      ev.on('input:padLost', () => this._pause()),
    );
    this._onBlur = () => { if (this.game.scene === this) this._pause(); };
    window.addEventListener('blur', this._onBlur);
    ev.emit('run:start', { run });
    this.game.audio.playMusic(run.dream.music.explore);
  }

  exit() {
    for (const off of this._unsubs) off();
    window.removeEventListener('blur', this._onBlur);
  }

  _pause() {
    if (this.game.scene !== this || this.endTimer >= 0) return;
    this.game.pushScene(new PauseScene(this.game, this));
  }

  update(dt) {
    super.update(dt);
    const input = this.game.input;
    if (input.isPressed('PAUSE')) { this._pause(); return; }
    if (input.isPressed('MAP')) this.game.toasts.show('Este sueño todavía tiene una sola sala (mapa en Fase 3)');

    this.introTime = Math.max(0, this.introTime - dt);
    this.world.update(dt);
    if (this.world.player.alive) this.run.time += dt;

    if (this.world.playerAtExit() && input.isPressed('INTERACT')) this.finish('win');

    if (this.endTimer >= 0) {
      this.endTimer -= dt;
      if (this.endTimer < 0) this.finish('death');
    }
  }

  finish(result) {
    if (this.run.result) return;
    this.run.result = result;
    this.game.events.emit('run:end', { result, time: this.run.time, run: this.run });
    if (result === 'win') this.game.haptics.play('bossDown');
    this.game.pushScene(new RunEndScene(this.game, this.run));
  }

  renderWorld(g) {
    this.world.render(g);
    this.hud.renderWorld(g, this.world);
  }

  renderUI(r) { this.hud.renderUI(r, this.world, this); }
}
