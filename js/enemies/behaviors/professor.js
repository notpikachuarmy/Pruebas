import { toPlayer, shoot } from './helpers.js';

const PHASES = [
  { name: 'Dictado', from: 1 },
  { name: 'Corrección', from: 0.66 },
  { name: 'Suspenso', from: 0.33 },
];

/**
 * La Profesora Sin Cara (jefe del Examen Infinito).
 *  Fase 1 Dictado:    filas de letras que bajan con un hueco por el que pasar + ráfagas dirigidas.
 *  Fase 2 Corrección: cruces rojas en el suelo que explotan en tinta; llama a Gomas Gastadas.
 *  Fase 3 Suspenso:   el aula se arruga (los bordes se cierran) y todo va más rápido.
 */
export default {
  init(e) {
    e.data.phase = 0; e.data.row = 1.5; e.data.aim = 2.5; e.data.mark = 1.5;
    e.setState('teach');
  },

  phaseOf(e) {
    const r = e.hp / e.maxHp;
    return r > PHASES[1].from ? 0 : r > PHASES[2].from ? 1 : 2;
  },

  update(e, world, dt) {
    const p = e.def.params;
    const t = toPlayer(e, world);
    const phase = this.phaseOf(e);
    if (phase !== e.data.phase) this._enterPhase(e, world, phase);

    // Se desliza tras su mesa siguiendo al jugador
    e.vx = Math.sign(t.dx) * Math.min(Math.abs(t.dx), p.slide * (phase === 2 ? 1.6 : 1)); e.vy = 0;
    if (!world.player.alive) return;

    const fast = phase === 2 ? 0.7 : 1;
    e.data.row -= dt;
    if (e.data.row <= 0) { e.data.row = p.rowEvery[phase] * fast; this._dictate(e, world, phase); }
    e.data.aim -= dt;
    if (e.data.aim <= 0) {
      e.data.aim = p.aimEvery * fast;
      for (let i = -1; i <= 1; i++) shoot(world, e, t.angle + i * 0.2, { speed: 110, range: 260, radius: 3, glyph: 'a', z: 20 });
      world.game.audio.play('shoot', { pitch: 0.6 });
    }
    if (phase >= 1) {
      e.data.mark -= dt;
      if (e.data.mark <= 0) {
        e.data.mark = p.markEvery[phase];
        const rng = world.rngSpawn;
        for (let i = 0; i < p.marks; i++) {
          world.hazards.spawn('mark', world.player.x + rng.range(-34, 34), world.player.y + rng.range(-20, 20), 14, p.markDelay);
        }
      }
    }
  },

  /** Fila de letras que baja por toda el aula con un hueco de 3 letras. */
  _dictate(e, world, phase) {
    const p = e.def.params;
    const w = world.room.width;
    const count = Math.floor((w - 48) / 14);
    const gap = world.rngSpawn.int(1, count - 4);
    for (let i = 0; i < count; i++) {
      if (i >= gap && i < gap + 3) continue;
      world.projectiles.spawn({
        team: 'enemy', x: 24 + i * 14, y: 52, z: 4, vx: 0, vy: p.rowSpeed[phase],
        range: world.room.height, radius: 3, damage: 1, color: '#25307a', trail: '#c9bde6', glyph: 'a',
      });
    }
    world.game.audio.play('windup', { pitch: 1.4 });
  },

  _enterPhase(e, world, phase) {
    e.data.phase = phase;
    world.bossBanner(PHASES[phase].name);
    world.shake(4, 0.4);
    world.game.haptics.play('heavy');
    if (phase === 1) {
      for (let i = 0; i < 2; i++) {
        const pt = world.room.randomFloorPoint(world.rngSpawn, world.player.x, world.player.y, 70);
        world.enemies.spawn('goma', pt.x, pt.y);
      }
    }
    if (phase === 2) world.setArena(e.def.params.arenaMargin);
  },

  onDeath(e, world) { world.setArena(0); },
  canBeHit() { return true; },
};
