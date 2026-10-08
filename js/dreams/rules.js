/**
 * Reglas especiales de los sueños. Un sueño las activa por id en `dream.rules`.
 * Ganchos opcionales:
 *  apply(world)                    al empezar la run (modificadores permanentes)
 *  onEncounterStart(world, enc)    al empezar un combate
 *  onEncounterEnd(world)           al terminarlo
 *  update(world, dt)               cada paso
 *  renderUI(r, world)              información en pantalla
 *  onRoomEnter(world, node, first) al entrar en una sala
 *  onRoomExit(world, node)         al salir de una sala
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

  /** Sueño dulce: todo va acelerado por el azúcar (tú también). */
  subidonAzucar: {
    name: 'Subidón de azúcar',
    apply(world) {
      const cfg = world.run.dream.ruleConfig.subidonAzucar;
      world.mods.enemySpeed = cfg.enemySpeed;
      world.player.stats.addModifier({ stat: 'speed', mult: cfg.playerSpeed, source: 'rule:subidon' });
      world.player.stats.addModifier({ stat: 'fireRate', mult: cfg.fireRate, source: 'rule:subidon' });
    },
    // El reloj del examen pone enemySpeed a 1 al terminar un combate; aquí lo mantenemos
    onEncounterEnd(world) { world.mods.enemySpeed = world.run.dream.ruleConfig.subidonAzucar.enemySpeed; },
  },

  /** Todo es de golosina: los enemigos a veces sueltan un caramelo (Lucidez) extra. */
  todoEsGolosina: {
    name: 'Todo es golosina',
    onEnemyKilled(world, enemy) {
      if (world.rngLoot.chance(world.run.dream.ruleConfig.todoEsGolosina.chance)) world.pickups.spawn('lucidity', enemy.x, enemy.y - 2);
    },
  },

  /** Mar adentro: cuanto más lejos del inicio, más oscura está el agua. */
  abismo: {
    name: 'El abismo',
    onRoomEnter(world, node) {
      const cfg = world.run.dream.ruleConfig.abismo;
      world.mods.light = Math.max(cfg.min, cfg.base - node.depth * cfg.perDepth);
    },
  },

  /** Corrientes: en algunas salas el agua te arrastra en una dirección (la Bombona de Oxígeno las anula). */
  corrientes: {
    name: 'Corrientes',
    onRoomEnter(world, node, first) {
      const cfg = world.run.dream.ruleConfig.corrientes;
      const st = node.state;
      if (st.current === undefined) {
        const rng = world.run.rng.fork(`corriente:${node.key}`);
        st.current = node.type !== 'start' && node.type !== 'boss' && rng.chance(cfg.chance)
          ? { a: rng.int(0, 7) * Math.PI / 4, s: rng.range(cfg.strength[0], cfg.strength[1]) } : null;
      }
      world.current = st.current;
      if (st.current && world.items.hasEffect('noSlow')) world.game.events.emit('current:resisted');
    },
    update(world, dt) {
      const c = world.current, p = world.player;
      if (!c || !p.alive) return;
      if (!world.items.hasEffect('noSlow')) world.room.move(p, Math.cos(c.a) * c.s * dt, Math.sin(c.a) * c.s * dt);
      // burbujas que muestran hacia dónde va el agua
      if (Math.random() < 0.5) {
        const x = Math.random() * world.room.width, y = Math.random() * world.room.height;
        world.effects.particle(x, y, Math.cos(c.a) * c.s * 2.5, Math.sin(c.a) * c.s * 2.5, 0.8, '#8fd3ff', 1, 0, 0);
      }
    },
  },

  /** Ragnarök: ceniza y chispas suben desde la lava (ambiente; el peligro lo pone Surtur). */
  cenizas: {
    name: 'Cenizas',
    update(world) {
      if (Math.random() > 0.6) return;
      const x = Math.random() * world.room.width, y = world.room.height * (0.2 + Math.random() * 0.8);
      const c = Math.random() < 0.3 ? '#fff0a0' : Math.random() < 0.5 ? '#ff6a1e' : '#6a5a5a';
      world.effects.particle(x, y, (Math.random() - 0.5) * 10, -20 - Math.random() * 25, 1.4, c, 1, 0.3, 0);
    },
  },

  /** La casa está a oscuras: solo ves alrededor tuyo, y las lámparas encendidas iluminan la sala. */
  penumbra: {
    name: 'Penumbra',
    apply(world) { world.mods.light = world.run.dream.ruleConfig.penumbra.radius; },
    onRoomEnter(world, node, first) {
      if (!first || node.type === 'boss') return;
      const [a, b] = world.run.dream.ruleConfig.penumbra.lamps;
      const n = world.rngLoot.int(a, b);
      for (let i = 0; i < n; i++) {
        const pt = world.room.randomFloorPoint(world.rngLoot, world.player.x, world.player.y, 70);
        world.interactables.add({ kind: 'lamp', x: pt.x, y: pt.y, lit: false });
      }
    },
  },

  /** En esta casa nada te espera: lo que dejes en el suelo desaparece al salir de la sala. */
  nadieEspera: {
    name: 'Nadie espera',
    onRoomExit(world, node) {
      if (!node.state.pickups.length) return;
      node.state.pickups = [];
      if (!world.run.flags.nadieEsperaAviso) {
        world.run.flags.nadieEsperaAviso = true;
        world.toast('Lo que dejaste atrás se ha desvanecido');
      }
    },
  },
};
