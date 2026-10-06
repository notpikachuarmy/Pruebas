import { toPlayer, shoot } from './helpers.js';

/**
 * Fotocopiadora (mini-jefe): imprime copias de enemigos. Tras varias impresiones se atasca y abre
 * la bandeja: ahí recibe mucho más daño. Al desatascarse escupe folios. Con poca vida imprime
 * copias del propio jugador, que repiten lo que él hizo hace un momento.
 */
export default {
  init(e) { e.data.prints = 0; e.data.t = 1.2; e.setState('print'); },

  update(e, world, dt) {
    const p = e.def.params;
    const t = toPlayer(e, world);
    e.vx = Math.sign(t.dx) * Math.min(Math.abs(t.dx), 14); e.vy = 0;

    if (e.state === 'print') {
      e.data.t -= dt;
      if (e.data.t <= 0) {
        e.data.t = p.printEvery;
        this._print(e, world);
        if (++e.data.prints >= p.jamEvery) { e.setState('jam'); world.game.audio.play('hurt', { pitch: 2 }); world.floatText(e.x, e.y - 34, '¡Atasco!'); }
      }
    } else if (e.state === 'jam') {
      e.vx = 0;
      if (e.stateTime >= p.jamTime) {
        e.data.prints = 0;
        // Escupe folios en abanico al desatascarse
        for (let i = 0; i < p.sheets; i++) {
          const a = t.angle + (i - (p.sheets - 1) / 2) * 0.28;
          shoot(world, e, a, { speed: 95, range: 220, radius: 3, color: '#f0ecd6', trail: '#25307a', glyph: '-' });
        }
        world.game.audio.play('shoot', { pitch: 0.5 });
        e.setState('print');
      }
    }
  },

  _print(e, world) {
    const p = e.def.params;
    const alive = world.enemies.list.filter((o) => o !== e && !o.dead).length;
    if (alive >= p.maxCopies) return;
    const lowHp = e.hp < e.maxHp * 0.5;
    const hasCopy = world.enemies.list.some((o) => o.def.id === 'copia' && !o.dead);
    const id = lowHp && !hasCopy ? 'copia' : world.rngSpawn.pick(p.prints);
    const x = e.x + world.rngSpawn.range(-20, 20), y = e.y + 26;
    world.enemies.spawn(id, x, Math.min(y, world.room.height - 24));
    world.effects.burst(e.x, e.y - 6, 8, '#78ffa0', 50, 0.3);
    world.game.audio.play('spawn');
  },

  damageMult(e) { return e.state === 'jam' ? e.def.params.jamDamageMult : 1; },
  anim(e) { return e.state === 'jam' ? 'jam' : 'idle'; },
};
