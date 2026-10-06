/**
 * Tipos de sala: qué ocurre al entrar y al limpiarla.
 * Cada tipo: { label, mapColor, onEnter(world, node, firstVisit), onClear?(world, node), renderUI?(r, world) }
 * Para añadir un tipo: crea el objeto aquí (o en un archivo propio), y úsalo en dream.floor.
 */
import { buildEncounter } from '../EncounterBuilder.js';
import { TILE } from '../../core/config.js';
import { promptText } from '../../ui/prompt.js';

const center = (world) => ({ x: (world.room.cols / 2) * TILE, y: (world.room.rows / 2) * TILE + 6 });

/** Recompensa aleatoria al limpiar una sala (tabla del sueño). */
function clearDrop(world, guaranteed = false) {
  const cfg = world.run.dream.floor.clearDrop;
  if (!cfg || (!guaranteed && !world.rngLoot.chance(cfg.chance))) return;
  const pick = world.rngLoot.weighted(cfg.table);
  const n = world.rngLoot.int(pick.amount[0], pick.amount[1]);
  const c = center(world);
  for (let i = 0; i < n; i++) world.pickups.spawn(pick.type, c.x, c.y);
}

function combatEnter(world, node, challenge) {
  if (node.state.cleared) return;
  if (!node.encounter) {
    const { dream } = world.run;
    node.encounter = buildEncounter(world.run.rng.fork(`enc:${node.key}`), dream, world.game.content.enemies, node.depth, { challenge });
  }
  world.startEncounter(node.encounter);
}

export const ROOM_TYPES = {
  start: {
    label: 'Inicio', mapColor: '#9b8fc7',
    onEnter(world, node) { node.state.cleared = true; },
    // Pistas de control escritas en el suelo con tiza (solo en la primera sala)
    renderUI(r, world, ox, oy) {
      const g = world.game, k = (a) => g.input.glyph(a);
      const hints = g.input.lastDevice === 'keyboard'
        ? [`${k('MOVE_UP')}${k('MOVE_LEFT')}${k('MOVE_DOWN')}${k('MOVE_RIGHT')} para moverte`,
          `${k('AIM_UP')}${k('AIM_LEFT')}${k('AIM_DOWN')}${k('AIM_RIGHT')} para lanzar ondas`,
          promptText(g, 'DASH', 'Silencio: esquiva'), promptText(g, 'MAP', 'mantén para ver el mapa')]
        : ['Stick izquierdo para moverte', 'Stick derecho para lanzar ondas',
          promptText(g, 'DASH', 'Silencio: esquiva'), promptText(g, 'MAP', 'mantén para ver el mapa')];
      hints.forEach((h, i) => r.text(h, ox + 224, oy + 44 + i * 14 + (i > 1 ? 112 : 0), { size: 8, color: '#8d94b8', align: 'center', shadow: null, alpha: 0.85 }));
    },
  },

  combat: {
    label: 'Combate', mapColor: '#c9bde6',
    onEnter: (world, node) => combatEnter(world, node, false),
    onClear: (world) => clearDrop(world),
  },

  challenge: {
    label: 'Desafío', mapColor: '#ff9a3c', doorKind: 'challenge',
    onEnter: (world, node) => combatEnter(world, node, true),
    onClear(world) {
      const c = center(world);
      world.interactables.add({ kind: 'chest', x: c.x, y: c.y, lucidity: [5, 8], extra: [{ type: 'heart', chance: 0.6 }] });
    },
  },

  reward: {
    label: 'Recompensa', mapColor: '#ffd65c',
    onEnter(world, node, first) {
      node.state.cleared = true;
      if (!first) return;
      const c = center(world);
      // Fase 5: aquí aparecerá un objeto. De momento, un cajón del profesor con Lucidez y vida.
      world.interactables.add({ kind: 'chest', x: c.x, y: c.y, lucidity: [5, 9], extra: [{ type: 'heart', chance: 0.7 }] });
    },
  },

  shop: {
    label: 'Tienda', mapColor: '#8fd3ff',
    onEnter(world, node, first) {
      node.state.cleared = true;
      if (!first) return;
      const c = center(world);
      const items = world.run.dream.shop;
      items.forEach((it, i) => {
        world.interactables.add({ kind: 'shopItem', product: it.product, price: it.price, x: c.x + (i - (items.length - 1) / 2) * 40, y: c.y });
      });
    },
  },

  healing: {
    label: 'Fuente', mapColor: '#7fd6a0',
    onEnter(world, node, first) {
      node.state.cleared = true;
      if (first) { const c = center(world); world.interactables.add({ kind: 'fountain', x: c.x, y: c.y }); }
    },
  },

  secret: {
    label: 'Secreta', mapColor: '#b36bd6',
    onEnter(world, node, first) {
      node.state.cleared = true;
      if (!first) return;
      const c = center(world);
      world.interactables.add({ kind: 'chest', x: c.x, y: c.y, lucidity: [8, 12], extra: [{ type: 'heart', chance: 1 }] });
      world.game.events.emit('secret:found', { node });
    },
  },

  boss: {
    label: 'Jefe', mapColor: '#d6403a', doorKind: 'boss',
    onEnter(world, node) {
      if (node.state.cleared) return;
      // Fase 4: La Profesora Sin Cara. Mientras tanto, oleadas finales definidas en el sueño.
      world.startEncounter(world.run.dream.encounters.final);
    },
    onClear(world) {
      const c = center(world);
      world.interactables.add({ kind: 'exit', x: c.x, y: c.y });
      world.game.haptics.play('bossDown');
    },
  },
};
