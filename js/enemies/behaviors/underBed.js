import { toPlayer, shoot } from './helpers.js';

const PHASES = ['No mires debajo', 'Se oyen pasos', 'Apagón'];   // por defecto; params.phaseNames los cambia

/**
 * El Monstruo de Debajo de la Cama (jefe alternativo de la Casa).
 *  Escondido: no se le puede dañar; unas manos (sombras en el suelo con aviso) intentan agarrarte.
 *  Asomado: los ojos brillan, recibe más daño y escupe sombras en abanico.
 * Fase 2 trae polillas; fase 3 apaga más la casa y se esconde menos rato.
 */
export default {
  init(e) { e.setState('hide'); Object.assign(e.data, { phase: 0, grab: 1 }); },
  phaseOf(e) { const r = e.hp / e.maxHp; return r > 0.66 ? 0 : r > 0.33 ? 1 : 2; },

  update(e, world, dt) {
    const p = e.def.params, d = e.data;
    e.vx = 0; e.vy = 0;
    const ph = this.phaseOf(e);
    if (ph !== d.phase) {
      d.phase = ph; world.bossBanner((p.phaseNames ?? PHASES)[ph]); world.game.haptics.play('heavy');
      if (ph === 2) world.mods.lightMult = 0.7;
    }
    if (!world.player.alive) return;
    if (e.state === 'hide') {
      d.grab -= dt;
      if (d.grab <= 0) {
        d.grab = p.grabEvery[ph];
        const n = ph === 2 ? 2 : 1;
        for (let i = 0; i < n; i++) {
          world.hazards.spawn(p.grabHazard ?? 'grab', world.player.x + world.rngSpawn.range(-16, 16) * i, world.player.y + world.rngSpawn.range(-10, 10) * i, 15, p.grabDelay, e.def.id);
        }
      }
      if (e.stateTime > p.hideTime[ph]) {
        e.setState('peek');
        world.game.audio.play('hurt', { pitch: 0.5 });
        const t = toPlayer(e, world);
        for (let i = -3; i <= 3; i++) shoot(world, e, t.angle + i * 0.22, { speed: 85, range: 280, radius: 4, z: 6, color: p.shotColor ?? '#1a1428', trail: '#ffd65c' });
      }
    } else if (e.state === 'peek') {
      if (e.stateTime > p.peekTime) {
        e.setState('hide');
        d.grab = 0.6;
        if (ph >= 1 && world.enemies.list.filter((o) => !o.dead && o !== e).length < 4) {
          for (let i = 0; i < 2; i++) {
            const pt = world.room.randomFloorPoint(world.rngSpawn, world.player.x, world.player.y, 80);
            world.enemies.spawn(p.summon ?? 'polilla', pt.x, pt.y);
          }
        }
      }
    }
  },

  canBeHit(e) { return e.state === 'peek'; },
  damageMult() { return 1.3; },
  anim(e) { return e.state === 'peek' ? 'peek' : 'idle'; },
  light(e) { return e.state === 'peek' ? 60 : 22; },
  onDeath(e, world) { world.mods.lightMult = 1; world.bossBanner(e.def.params.deathText ?? 'Debajo no hay nada'); },
};
