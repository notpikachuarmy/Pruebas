import { toPlayer, shoot } from './helpers.js';

const PHASES = ['Poner la mesa', 'Esperar', 'Recoger'];

/**
 * La Mesa Puesta (jefe de La Casa que se Vacía): una mesa para una familia que no viene.
 *  Fase 1: lanza la vajilla en anillos con huecos.
 *  Fase 2: la casa se oscurece y llegan Sombras de Visita.
 *  Fase 3: platos en espiral y polvo que se acumula.
 */
export default {
  init(e) { e.data.phase = 0; e.data.ring = 1.5; e.data.aim = 3; e.data.spiral = 0; e.data.ang = 0; e.data.dust = 4; },

  phaseOf(e) { const r = e.hp / e.maxHp; return r > 0.66 ? 0 : r > 0.33 ? 1 : 2; },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    e.vx = 0; e.vy = 0;
    const ph = this.phaseOf(e);
    if (ph !== d.phase) this._enter(e, world, ph);
    if (!world.player.alive) return;
    const t = toPlayer(e, world);

    d.ring -= dt;
    if (d.ring <= 0) {
      d.ring = p.ringEvery[ph];
      const n = p.ringCount, gapAt = world.rngSpawn.int(0, n - 1);
      for (let i = 0; i < n; i++) {
        if (i === gapAt || i === (gapAt + 1) % n) continue;   // hueco para escapar
        shoot(world, e, (i / n) * Math.PI * 2 + d.ang, { speed: p.ringSpeed, range: 300, radius: 4, color: '#f6f6fa', trail: '#9aa3b5', z: 14 });
      }
      d.ang += 0.25;
      world.game.audio.play('wallHit', { pitch: 1.5 });
    }
    d.aim -= dt;
    if (d.aim <= 0) {
      d.aim = p.aimEvery;
      for (let i = -1; i <= 1; i++) shoot(world, e, t.angle + i * 0.18, { speed: 115, range: 260, radius: 3, color: '#f6f6fa', trail: '#9aa3b5', z: 14 });
    }
    if (ph === 2) {
      d.spiral -= dt;
      if (d.spiral <= 0) {
        d.spiral = p.spiralEvery;
        d.ang += 0.37;
        shoot(world, e, d.ang, { speed: 80, range: 300, radius: 3, color: '#f6f6fa', trail: '#d6403a', z: 14 });
        shoot(world, e, d.ang + Math.PI, { speed: 80, range: 300, radius: 3, color: '#f6f6fa', trail: '#d6403a', z: 14 });
      }
      d.dust -= dt;
      if (d.dust <= 0) {
        d.dust = 6;
        if (world.enemies.list.filter((o) => !o.dead && o !== e).length < 4) {
          const pt = world.room.randomFloorPoint(world.rngSpawn, world.player.x, world.player.y, 80);
          world.enemies.spawn('polvo', pt.x, pt.y);
        }
      }
    }
  },

  _enter(e, world, ph) {
    e.data.phase = ph;
    world.bossBanner(PHASES[ph]);
    world.shake(4, 0.4);
    world.game.haptics.play('heavy');
    if (ph === 1) {
      world.mods.lightMult = 0.6;
      for (let i = 0; i < 2; i++) {
        const pt = world.room.randomFloorPoint(world.rngSpawn, world.player.x, world.player.y, 90);
        world.enemies.spawn('sombra', pt.x, pt.y);
      }
    }
  },

  onDeath(e, world) {
    world.mods.lightMult = 1;
    world.bossBanner('Alguien ha venido');
  },
};
