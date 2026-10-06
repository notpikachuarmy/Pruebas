/**
 * Tipos de sala: qué ocurre al entrar y al limpiarla.
 * Cada tipo: { label, mapColor, onEnter(world, node, firstVisit), onClear?(world, node), renderUI?(r, world) }
 * Para añadir un tipo: crea el objeto aquí (o en un archivo propio), y úsalo en dream.floor.
 */
import { buildEncounter } from '../EncounterBuilder.js';
import { TILE } from '../../core/config.js';
import { promptText } from '../../ui/prompt.js';
import { drawItem, ITEM_PRICES } from '../../items/ItemPool.js';

/** Coloca un objeto en un pedestal. Devuelve false si el pool está agotado. */
function placeItem(world, x, y, pools, opts) {
  const it = drawItem(world, pools, opts);
  if (!it) return false;
  world.interactables.add({ kind: 'item', itemId: it.id, x, y, taken: false });
  return true;
}

// Iconos de 5×5 que se dibujan en la puerta que lleva a cada tipo de sala
const ICONS = {
  boss: ['.###.', '#.#.#', '#####', '.###.', '.#.#.'],
  miniboss: ['#.#.#', '#.#.#', '#####', '#####', '.....'],
  reward: ['..#..', '#####', '.###.', '.#.#.', '#...#'],
  shop: ['.###.', '#.#..', '.###.', '..#.#', '.###.'],
  healing: ['..#..', '..#..', '#####', '..#..', '..#..'],
  challenge: ['..#..', '..#..', '..#..', '.....', '..#..'],
  secret: ['.###.', '#...#', '..##.', '.....', '..#..'],
  event: ['#####', '#...#', '#####', '.#...', '#....'],
};

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

export { ICONS as DOOR_ICONS };

export const ROOM_TYPES = {
  start: {
    label: 'Inicio', mapColor: '#9b8fc7',
    onEnter(world, node, first) {
      node.state.cleared = true;
      // Estantería con el bestiario y la guía de objetos
      if (first) world.interactables.add({ kind: 'bookshelf', x: 6 * TILE + 8, y: 2 * TILE + 12 });
    },
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
    onClear(world) {
      if (world.run.flags.favor) {
        world.run.flags.favor = false;
        const c = center(world);
        world.pickups.spawn('heart', c.x, c.y);
        world.toast('El compañero te devuelve el favor');
      }
      clearDrop(world);
    },
  },

  miniboss: {
    label: 'Antesala', mapColor: '#ff6ad5',
    onEnter(world, node) {
      if (node.state.cleared) return;
      const id = world.run.dream.miniboss;
      world.bossIntro = { name: world.game.content.enemies[id].name, title: 'Antes del examen final', t: 0 };
      world.startEncounter({ waves: [[{ id, count: 1, at: [14, 4] }]], startDelay: 1.6, noBanner: true, noClock: true }, { music: 'combat' });
    },
    onClear(world) {
      const c = center(world);
      world.interactables.add({ kind: 'chest', x: c.x - 24, y: c.y + 30, lucidity: [4, 6], extra: [{ type: 'heart', chance: 1 }] });
      // Premio extra: un objeto de un pool pequeño y modesto
      placeItem(world, c.x + 24, c.y + 30, ['minijefe']);
    },
  },

  event: {
    label: 'Evento', mapColor: '#ffffff',
    onEnter(world, node, first) {
      node.state.cleared = true;
      if (!first) return;
      const run = world.run;
      const pool = run.dream.eventPool.filter((id) => !run.usedEvents.has(id));
      const id = world.rngLoot.pick(pool.length ? pool : run.dream.eventPool);
      run.usedEvents.add(id);
      const c = center(world);
      world.interactables.add({ kind: 'event', event: id, x: c.x, y: c.y, done: false });
    },
  },

  challenge: {
    label: 'Desafío', mapColor: '#ff9a3c',
    onEnter: (world, node) => combatEnter(world, node, true),
    onClear(world) {
      const c = center(world);
      world.interactables.add({ kind: 'chest', x: c.x - 24, y: c.y, lucidity: [5, 8], extra: [{ type: 'heart', chance: 0.6 }] });
      if (world.rngLoot.chance(0.45)) placeItem(world, c.x + 24, c.y, [world.run.dream.id, 'general'], { boostRare: true });
    },
  },

  reward: {
    label: 'Recompensa', mapColor: '#ffd65c',
    onEnter(world, node, first) {
      node.state.cleared = true;
      if (!first) return;
      const c = center(world);
      if (!placeItem(world, c.x, c.y, [world.run.dream.id, 'general'])) {
        // Si ya han salido todos los objetos, un cajón del profesor
        world.interactables.add({ kind: 'chest', x: c.x, y: c.y, lucidity: [5, 9], extra: [{ type: 'heart', chance: 0.7 }] });
      }
    },
  },

  shop: {
    label: 'Tienda', mapColor: '#8fd3ff',
    onEnter(world, node, first) {
      node.state.cleared = true;
      if (!first) return;
      const c = center(world);
      const slots = [...world.run.dream.shop];
      const it = drawItem(world, [world.run.dream.id, 'general']);
      if (it) slots.push({ product: 'item', itemId: it.id, price: ITEM_PRICES[it.rarity] });
      slots.forEach((s, i) => {
        world.interactables.add({ kind: 'shopItem', product: s.product, itemId: s.itemId, price: s.price, x: c.x + (i - (slots.length - 1) / 2) * 40, y: c.y });
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
      if (placeItem(world, c.x + 24, c.y, ['secret', 'general'], { boostRare: true })) {
        world.interactables.add({ kind: 'chest', x: c.x - 24, y: c.y, lucidity: [4, 6], extra: [{ type: 'heart', chance: 1 }] });
      } else {
        world.interactables.add({ kind: 'chest', x: c.x, y: c.y, lucidity: [8, 12], extra: [{ type: 'heart', chance: 1 }] });
      }
      world.game.events.emit('secret:found', { node });
    },
  },

  boss: {
    label: 'Jefe', mapColor: '#d6403a',
    onEnter(world, node) {
      if (node.state.cleared) return;
      const def = world.game.content.enemies[world.run.bossId];
      world.bossIntro = { name: def.name, title: def.title ?? '', t: 0 };
      world.startEncounter({ waves: [[{ id: def.id, count: 1, at: def.spawnAt ?? [14, 4] }]], startDelay: 2, noBanner: true, noClock: true }, { music: 'boss' });
    },
    onClear(world) {
      const c = center(world);
      world.interactables.add({ kind: 'exit', x: c.x, y: c.y + 30 });
      placeItem(world, c.x, c.y - 14, ['boss']);
      world.game.haptics.play('bossDown');
    },
    // La pizarra del aula: el nombre del soñador y, al final, la nota
    renderUI(r, world, ox, oy) {
      const { owner, text } = world.run.dream;
      const def = world.game.content.enemies[world.run.bossId];
      const cleared = world.node.state.cleared;
      // Cartel de la sala: propio del jefe o, si no tiene, el del sueño
      const board = (cleared ? def.boardCleared ?? text.bossBoardCleared : def.board ?? text.bossBoard) ?? '';
      r.text(board.replace('{owner}', owner.name), ox + 224, oy + 11,
        { size: cleared ? 10 : 8, weight: cleared ? 700 : 400, color: cleared ? '#7fd6a0' : '#e8e6dc', align: 'center', shadow: null, alpha: 0.9 });
    },
  },
};
