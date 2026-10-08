/**
 * Logros y desbloqueos. Escucha eventos del juego, comprueba condiciones declarativas
 * (data/progression/achievements.js), guarda el resultado y aplica las recompensas.
 */
export class AchievementSystem {
  constructor(game) {
    this.game = game;
    this.list = game.content.achievements;
    this.bossHit = false;
    const ev = game.events;

    ev.on('boss:defeated', ({ def }) => {
      this.meta.stats.bossesDefeated++;
      const beaten = (this.meta.defeatedBosses ??= []);
      if (!beaten.includes(def.id)) beaten.push(def.id);
      this._check((c) => c.type === 'bossDefeated' && c.boss === def.id);
      if (def.role === 'jefe') this._checkBosses();
      if (def.role === 'jefe' && !this.bossHit) this._check((c) => c.type === 'noHitBoss');
      if (def.id === 'surtur' && !this.bossHit) this._check((c) => c.type === 'noHitSurtur');
    });
    ev.on('room:enter', ({ node }) => { if (node.type === 'boss' || node.type === 'miniboss') this.bossHit = false; });
    ev.on('player:damaged', () => { this.bossHit = true; });
    ev.on('room:cleared', ({ overtime }) => { if (overtime) this._check((c) => c.type === 'overtimeClear'); });
    ev.on('item:taken', () => {
      const w = game.activeWorld;
      if (!w) return;
      this._check((c) => c.type === 'runMaxHp' && w.player.stats.get('maxHp') >= c.gte);
      this.meta.stats.itemsTaken++;
      this._check((c) => c.type === 'runItems' && w.items.owned.length >= c.gte);
      this._check((c) => c.type === 'runSynergies' && w.items.synergies.length >= c.gte);
      this._check((c) => c.type === 'discoveredItems' && this.meta.discovered.items.length >= c.gte);
    });
    ev.on('shop:buy', ({ price }) => {
      this.meta.stats.shopSpent += price;
      this._checkStats();
      // comprar un corazón extra también cuenta para "Corazón lleno" (se comprueba tras aplicarlo)
      setTimeout(() => { const w = game.activeWorld; if (w) this._check((c) => c.type === 'runMaxHp' && w.player.stats.get('maxHp') >= c.gte); }, 0);
    });
    ev.on('pickup:lucidity', ({ amount }) => {
      const run = game.activeRun;
      if (!run) return;
      run.counters.lucidityTotal = (run.counters.lucidityTotal ?? 0) + amount;
      this._check((c) => c.type === 'runCounter' && (run.counters[c.counter] ?? 0) >= c.gte);
    });
    ev.on('lamp:lit', () => {
      const run = game.activeRun;
      this.meta.stats.lampsLit++;
      if (run) { run.counters.lampsLit++; this._check((c) => c.type === 'runCounter' && run.counters[c.counter] >= c.gte); }
    });
    ev.on('enemy:killed', () => this._checkStats());
    ev.on('run:end', ({ result, run }) => {
      if (result === 'win' && run.isLastDream) { this.meta.stats.nights++; this._check((c) => c.type === 'nightComplete'); }
      this._checkStats();
      game.save.persist();
    });
    // Cualquier evento con nombre puede ser condición de un logro
    for (const a of this.list) {
      if (a.condition.type === 'event') ev.on(a.condition.event, () => this._unlock(a));
    }
    this.retroCheck();
  }

  get meta() { return this.game.save.data.meta; }

  /** ¿Se ha vencido alguna vez a este jefe? (registro propio o, en partidas antiguas, el bestiario) */
  bossBeaten(id) {
    return (this.meta.defeatedBosses ?? []).includes(id) || (this.meta.bestiary?.[id]?.kills ?? 0) > 0;
  }

  /** Logros de jefes: se cuentan en total, a lo largo de todas las noches (no hace falta en la misma run). */
  _checkBosses() {
    const dreams = this.game.content.dreams;
    const bossesOf = (d) => d.bosses ?? [d.boss];
    this._check((c) => c.type === 'dreamBoss' && bossesOf(dreams[c.dream]).some((id) => this.bossBeaten(id)));
    this._check((c) => c.type === 'allDreamBosses' && bossesOf(dreams[c.dream]).every((id) => this.bossBeaten(id)));
    // Haber vencido algún jefe de cada sueño normal (no final), sumando todas las noches
    this._check((c) => c.type === 'everyDreamBoss' && Object.values(dreams).filter((d) => !d.final)
      .every((d) => bossesOf(d).some((id) => this.bossBeaten(id))));
  }

  /**
   * Al arrancar: recupera logros y recompensas que deberían tenerse (partidas guardadas con versiones
   * anteriores, logros cuya recompensa se añadió después, jefes vencidos antes de existir el registro).
   */
  retroCheck() {
    const beaten = (this.meta.defeatedBosses ??= []);
    for (const def of Object.values(this.game.content.enemies)) {
      if (def.boss && (this.meta.bestiary?.[def.id]?.kills ?? 0) > 0 && !beaten.includes(def.id)) beaten.push(def.id);
    }
    this._checkBosses();
    this._checkStats();
    for (const a of this.list) if (this.isUnlocked(a.id)) this._applyReward(a);
    this.game.save.persist();
  }

  /** Aplica la recompensa de un logro si aún no se tenía. Devuelve los textos de lo nuevo. */
  _applyReward(a) {
    const lines = [], r = a.reward;
    if (r?.dream && !this.meta.unlocks.dreams.includes(r.dream)) {
      this.meta.unlocks.dreams.push(r.dream);
      lines.push(`Nuevo sueño: ${this.game.content.dreams[r.dream].name}`);
    }
    if (r?.item && !this.meta.unlocks.items.includes(r.item)) {
      this.meta.unlocks.items.push(r.item);
      lines.push(`Nuevo objeto: ${this.game.content.items[r.item].name}`);
    }
    for (const l of lines) this.game.toasts.show(l, 5);
    return lines;
  }

  isUnlocked(id) { return !!this.meta.achievements[id]; }

  _checkStats() {
    const s = this.meta.stats;
    this._check((c) => c.type === 'stat' && (s[c.stat] ?? 0) >= c.gte);
  }

  _check(pred) {
    for (const a of this.list) if (!this.isUnlocked(a.id) && pred(a.condition)) this._unlock(a);
  }

  _unlock(a) {
    if (this.isUnlocked(a.id)) return;
    this.meta.achievements[a.id] = Date.now();
    this.game.toasts.show(`Logro: ${a.name}`, 4);
    const lines = [`Logro: ${a.name}`, ...this._applyReward(a)];
    this.game.activeRun?.unlockedThisRun.push(...lines);
    this.game.audio.play('cleared', { pitch: 1.6 });
    this.game.save.persist();
  }
}
