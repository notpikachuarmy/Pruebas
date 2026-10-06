/**
 * Registro de soñadores: fragmentos de la historia de cada soñador que se descubren jugando.
 * Cada sueño define `fragments: [{ id, unlock, text }]` con unlock:
 *   'visit' | 'miniboss' | 'boss' | 'secret' | 'event:<idEvento>'
 */
export class DreamerRegistry {
  constructor(game) {
    this.game = game;
    const ev = game.events;
    ev.on('dream:start', () => this._trigger('visit'));
    ev.on('boss:defeated', ({ def }) => this._trigger(def.role === 'minijefe' ? 'miniboss' : 'boss'));
    ev.on('secret:found', () => this._trigger('secret'));
    ev.on('event:choice', ({ event }) => this._trigger(`event:${event}`));
  }

  found(dreamId) { return this.game.save.data.meta.dreamers[dreamId] ?? []; }

  _trigger(kind) {
    const dream = this.game.activeRun?.dream;
    if (!dream?.fragments) return;
    const store = this.game.save.data.meta.dreamers;
    const list = (store[dream.id] ??= []);
    for (const f of dream.fragments) {
      if (f.unlock !== kind || list.includes(f.id)) continue;
      list.push(f.id);
      this.game.toasts.show(`Nuevo recuerdo de ${dream.owner.name}`, 3.5);
      this.game.save.persist();
    }
  }
}
