/**
 * Reglas especiales de los sueños. Un sueño las activa por id en `dream.rules`.
 * Ganchos opcionales:
 *  apply(world)                    al empezar la run (modificadores permanentes)
 *  onEncounterStart(world, enc)    al empezar un combate
 *  onEncounterEnd(world)           al terminarlo
 *  update(world, dt)               cada paso
 *  renderUI(r, world)              información en pantalla
 */
import { VIEW_W } from '../core/config.js';

export const RULES = {
  /** Íñigo no consigue borrar nada: la tinta dura el doble. */
  tintaNoSeSeca: {
    name: 'La tinta no se seca',
    apply(world) { world.mods.inkLife = 2; },
  },

  /** El examen está en blanco: en el mapa solo aparece lo que ya has visitado. */
  folioEnBlanco: {
    name: 'Folio en blanco',
    apply(world) { world.mods.hideUnvisited = true; },
  },

  /** Cada combate tiene un tiempo orientativo; al superarlo llega el "tiempo extra". */
  relojDeExamen: {
    name: 'Reloj de examen',
    onEncounterStart(world, enc) {
      if (enc.def.noClock) { world.examClock = null; return; }
      const cfg = world.run.dream.ruleConfig.relojDeExamen;
      const enemies = enc.def.waves.reduce((n, w) => n + w.reduce((m, g) => m + g.count, 0), 0);
      world.examClock = { t: 0, limit: cfg.base + cfg.perEnemy * enemies, overtime: false };
    },
    update(world, dt) {
      const c = world.examClock;
      if (!c || !world.encounter || world.encounter.finished) return;
      c.t += dt;
      if (!c.overtime && c.t >= c.limit) {
        c.overtime = true;
        const cfg = world.run.dream.ruleConfig.relojDeExamen;
        world.mods.enemySpeed = cfg.overtimeSpeed;
        world.game.audio.setTempo(1.35);
        world.toast('¡Tiempo extra!');
        world.shake(2, 0.3);
        for (let i = 0; i < cfg.reinforcements; i++) {
          const pt = world.room.randomFloorPoint(world.rngSpawn, world.player.x, world.player.y, 90);
          world.enemies.spawn('tachon', pt.x, pt.y);
        }
      }
    },
    onEncounterEnd(world) {
      world.examClock = null;
      world.mods.enemySpeed = 1;
      world.game.audio.setTempo(1);
    },
    renderUI(r, world) {
      const c = world.examClock;
      if (!c || !world.encounter || world.encounter.finished) return;
      const left = Math.max(0, c.limit - c.t);
      const txt = c.overtime ? 'Tiempo extra' : `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`;
      r.text(txt, VIEW_W / 2, 23, { size: 7, color: c.overtime || left < 5 ? '#eb2f2d' : '#9b8fc7', align: 'center' });
    },
  },
};
