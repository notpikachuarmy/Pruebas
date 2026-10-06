const PHASES = ['Otra vez gritos', 'Portazos', 'Los dos a la vez'];

/**
 * Las Voces del Pasillo (jefe alternativo de la Casa): siluetas que discuten tras las puertas.
 * Cambian de puerta (lado) cada pocos segundos; al gritar sueltan anillos de ondas con hueco y la luz
 * tiembla. En la última fase gritan desde los dos lados a la vez.
 */
export default {
  init(e) { Object.assign(e.data, { phase: 0, shout: 1.5, move: 4, side: 0, flicker: 0, ox: e.x }); },
  phaseOf(e) { const r = e.hp / e.maxHp; return r > 0.66 ? 0 : r > 0.33 ? 1 : 2; },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    e.vx = 0; e.vy = 0;
    const ph = this.phaseOf(e);
    if (ph !== d.phase) { d.phase = ph; world.bossBanner(PHASES[ph]); world.game.haptics.play('heavy'); }

    // La luz tiembla tras cada grito
    if (d.flicker > 0) {
      d.flicker -= dt;
      world.mods.lightMult = Math.floor(d.flicker * 20) % 2 ? 0.55 : 0.9;
      if (d.flicker <= 0) world.mods.lightMult = 1;
    }
    if (!world.player.alive) return;

    if (e.state === 'fade') {
      if (e.stateTime > 0.5) {
        d.side = 1 - d.side;
        const w = world.room.width;
        e.x = d.side ? w - p.sideX : p.sideX;
        e.setState('idle');
      }
      return;
    }
    d.move -= dt;
    if (d.move <= 0) { d.move = p.moveEvery; e.setState('fade'); world.game.audio.play('wallHit', { pitch: 0.4 }); return; }

    d.shout -= dt;
    if (d.shout <= 0) {
      d.shout = p.shoutEvery[ph];
      this._ring(e, world, e.x, e.y - 14);
      if (ph === 2) this._ring(e, world, world.room.width - e.x, e.y - 14);
      if (ph >= 1) {
        // Portazo: ráfaga dirigida
        const a = Math.atan2(world.player.y - e.y, world.player.x - e.x);
        for (let i = -1; i <= 1; i++) world.projectiles.spawn({ team: 'enemy', x: e.x, y: e.y - 4, angle: a + i * 0.15, speed: 120, range: 280, radius: 3, color: '#3a5a9a', trail: '#c9d8ff', source: e.def.id });
      }
      d.flicker = 0.4;
      world.shake(2, 0.15);
      world.game.audio.play('hurt', { pitch: 0.4, volume: 0.7 });
    }
  },

  _ring(e, world, x, y) {
    const n = e.def.params.ringCount, gap = world.rngSpawn.int(0, n - 1);
    for (let i = 0; i < n; i++) {
      if (i === gap || i === (gap + 1) % n || i === (gap + 2) % n) continue;
      world.projectiles.spawn({ team: 'enemy', x, y, z: 12, angle: (i / n) * Math.PI * 2, speed: 70, range: 320, radius: 3, color: '#28243e', trail: '#c9d8ff', source: e.def.id });
    }
  },

  canBeHit(e) { return e.state !== 'fade'; },
  alpha(e) { return e.state === 'fade' ? Math.max(0.1, 1 - e.stateTime * 2) : 1; },
  light() { return 40; },
  onDeath(e, world) { world.mods.lightMult = 1; },
};
