import { Scene } from './Scene.js';
import { Run } from '../world/Run.js';
import { World } from '../world/World.js';
import { HUD } from '../ui/HUD.js';
import { PauseScene } from './PauseScene.js';
import { RunEndScene } from './RunEndScene.js';
import { DreamTransitionScene } from './DreamTransitionScene.js';
import { ROOM_OFFSET_X, ROOM_OFFSET_Y } from '../core/config.js';

/**
 * Partida en curso: un Run (semilla, plano, contadores) y un World (la sala actual y el jugador).
 */
export class GameScene extends Scene {
  constructor(game, { seed } = {}) {
    super(game);
    const urlSeed = new URLSearchParams(location.search).get('seed');
    this.run = new Run(game, { seed: seed ?? urlSeed ?? undefined });
    this.world = new World(game, this.run);
    this.world.onDeath = () => { this.endTimer = 1.6; };
    this.world.onExit = () => this._dreamCleared();
    this.world.enterNode(this.run.floor.start);
    this.hud = new HUD(game);
    this.introTime = 2.5;
    this.endTimer = -1;
    this._unsubs = [];
  }

  enter() {
    const ev = this.game.events, run = this.run;
    this.game.activeRun = run;
    this.game.activeWorld = this.world;
    this._unsubs.push(
      ev.on('enemy:killed', () => run.kills++),
      ev.on('player:shot', () => run.shots++),
      ev.on('player:hitEnemy', () => run.hits++),
      ev.on('input:padLost', () => this._pause()),
    );
    this._onBlur = () => { if (this.game.scene === this) this._pause(); };
    window.addEventListener('blur', this._onBlur);
    ev.emit('run:start', { run });
    ev.emit('dream:start', { dream: run.dream });
    this.game.audio.playMusic(run.dream.music.explore);
  }

  /** El jugador apaga el despertador: siguiente sueño de la noche, o fin si era el último. */
  _dreamCleared() {
    const run = this.run;
    this.game.events.emit('dream:cleared', { dream: run.dream });
    if (run.isLastDream) { this.finish('win'); return; }
    const next = this.game.content.dreams[run.night[run.dreamIndex + 1]];
    this.game.pushScene(new DreamTransitionScene(this.game, run.dream, next, () => this.startNextDream()));
  }

  startNextDream() {
    this.run.nextDream();
    this.world.changeDream();
    this.introTime = 2.5;
    this.game.events.emit('dream:start', { dream: this.run.dream });
  }

  exit() {
    this.game.activeRun = null;
    this.game.activeWorld = null;
    for (const off of this._unsubs) off();
    window.removeEventListener('blur', this._onBlur);
  }

  _pause() {
    if (this.game.scene !== this || this.endTimer >= 0) return;
    this.game.pushScene(new PauseScene(this.game, this));
  }

  update(dt) {
    super.update(dt);
    if (this.game.input.isPressed('PAUSE')) { this._pause(); return; }
    this.introTime = Math.max(0, this.introTime - dt);
    this.world.update(dt);
    if (this.world.player.alive) this.run.time += dt;

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
    this.game.pushScene(new RunEndScene(this.game, this.run, this.world));
  }

  renderWorld(g) {
    this.world.render(g);
    const fade = this.world.fade;
    if (fade > 0) {
      g.globalAlpha = fade;
      g.fillStyle = '#0e0a1c';
      g.fillRect(ROOM_OFFSET_X, ROOM_OFFSET_Y, this.world.room.width, this.world.room.height);
      g.globalAlpha = 1;
    }
    this.hud.renderWorld(g, this.world);
  }

  renderUI(r) {
    if (!this.hud.showFullMap(this.world) && this.world.fade < 0.5) this.world.renderUI(r);
    this.hud.renderUI(r, this.world, this);
  }
}
