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
    // Aviso de vida baja: latido
    const p = this.world.player;
    if (p.alive && p.hp <= 2) {
      this._beat = (this._beat ?? 0) - dt;
      if (this._beat <= 0) { this._beat = 1; this.game.audio.play('heartbeat'); }
    } else this._beat = 0;
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
    this._vignette(r);
    this.hud.renderUI(r, this.world, this);
    if (this.hidesCursor()) this._crosshair(r);
  }

  hidesCursor() { return this.game.scene === this && this.game.input.mouseAimActive(); }

  /** Bordes rojos: al recibir daño (destello) y con vida baja (pulso suave). */
  _vignette(r) {
    const w = this.world, s = this.game.save.data.settings;
    let a = 0;
    if (w.hurtFlash > 0 && !s.reduceFlashes) a = w.hurtFlash * 1.2;
    if (w.player.alive && w.player.hp <= 2) a = Math.max(a, s.reduceFlashes ? 0.18 : 0.15 + 0.12 * Math.sin(this.time * 6));
    if (a <= 0) return;
    const ctx = r.ui, W = r.width, H = r.height, e = 26;
    const edge = (x0, y0, x1, y1, x, y, w2, h2) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, `rgba(200,20,30,${Math.min(0.6, a)})`); g.addColorStop(1, 'rgba(200,20,30,0)');
      ctx.fillStyle = g; ctx.fillRect(x, y, w2, h2);
    };
    edge(0, 0, 0, e, 0, 0, W, e); edge(0, H, 0, H - e, 0, H - e, W, e);
    edge(0, 0, e, 0, 0, 0, e, H); edge(W, 0, W - e, 0, W - e, 0, e, H);
  }

  _crosshair(r) {
    const m = this.game.input.mouse, ctx = r.ui;
    ctx.fillStyle = '#fff6d6';
    ctx.fillRect(m.x - 5, m.y - 0.5, 3, 1); ctx.fillRect(m.x + 2, m.y - 0.5, 3, 1);
    ctx.fillRect(m.x - 0.5, m.y - 5, 1, 3); ctx.fillRect(m.x - 0.5, m.y + 2, 1, 3);
    ctx.fillStyle = '#eb2f2d'; ctx.fillRect(m.x - 0.5, m.y - 0.5, 1, 1);
  }
}
