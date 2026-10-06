// Estadísticas permanentes entre runs. Escucha eventos del juego y guarda al terminar cada run.

export class MetaStats {
  constructor(game) {
    this.game = game;
    const ev = game.events;
    ev.on('enemy:killed', ({ def }) => {
      this.stats.kills++;
      this._discover('enemies', def.id);
    });
    ev.on('player:shot', () => { this.stats.shots++; });
    ev.on('player:hitEnemy', () => { this.stats.hits++; });
    ev.on('player:damaged', ({ amount }) => { this.stats.damageTaken += amount; });
    ev.on('pickup:lucidity', ({ amount }) => { this.stats.lucidity += amount; });
    ev.on('run:start', () => { this.stats.runs++; this.game.save.persist(); });
    ev.on('run:end', ({ result, time }) => {
      if (result === 'win') this.stats.wins++;
      else if (result === 'death') this.stats.deaths++;
      this.stats.playTime += time;
      this.game.save.persist();
    });
  }

  get stats() { return this.game.save.data.meta.stats; }

  _discover(kind, id) {
    const list = this.game.save.data.meta.discovered[kind];
    if (!list.includes(id)) list.push(id);
  }
}
