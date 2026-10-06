/** Registro de enemigos: vistos, disipados y cuántas veces te han expulsado. */
export class Bestiary {
  constructor(game) {
    this.game = game;
    const ev = game.events;
    ev.on('enemy:seen', ({ def }) => { this.entry(def.id).seen++; });
    ev.on('enemy:killed', ({ def }) => { this.entry(def.id).kills++; });
    ev.on('player:expelled', ({ by }) => {
      if (by && game.content.enemies[by]) this.entry(by).killedYou++;
      if (game.activeRun) game.activeRun.expelledBy = by;
      game.save.persist();
    });
  }

  entry(id) {
    const store = this.game.save.data.meta.bestiary;
    return (store[id] ??= { seen: 0, kills: 0, killedYou: 0 });
  }

  get(id) { return this.game.save.data.meta.bestiary[id] ?? null; }
}
