/**
 * Genera el plano de un sueño: un árbol de salas en una rejilla.
 * Es lógica pura (sin DOM): se puede probar con Node.
 *
 * Resultado: { nodes: Map<"x,y", Node>, start, boss, secret, width, height }
 * Node: { key, x, y, type, depth, doors: {N,S,E,W: 'normal'|'secret'|undefined}, templateId, encounter, state }
 */

export const DIRS = {
  N: { dx: 0, dy: -1, opposite: 'S' },
  S: { dx: 0, dy: 1, opposite: 'N' },
  E: { dx: 1, dy: 0, opposite: 'W' },
  W: { dx: -1, dy: 0, opposite: 'E' },
};
const DIR_KEYS = Object.keys(DIRS);
const key = (x, y) => `${x},${y}`;

const GRID = 11;
const MAX_ATTEMPTS = 200;

function makeNode(x, y) {
  return {
    key: key(x, y), x, y, type: 'combat', depth: 0,
    doors: {}, templateId: null, encounter: null,
    // Estado que cambia durante la run
    state: { visited: false, cleared: false, pickups: [], interactables: null, secretHits: {} },
  };
}

function neighborCount(nodes, x, y) {
  let n = 0;
  for (const d of DIR_KEYS) if (nodes.has(key(x + DIRS[d].dx, y + DIRS[d].dy))) n++;
  return n;
}

/** Crecimiento tipo árbol: cada sala nueva toca exactamente a una existente (sin bucles ni bloques). */
function growTree(rng, count) {
  const c = Math.floor(GRID / 2);
  const nodes = new Map();
  const start = makeNode(c, c);
  nodes.set(start.key, start);
  const list = [start];
  let guard = 0;
  while (list.length < count && guard++ < count * 60) {
    const from = rng.pick(list);
    const d = rng.pick(DIR_KEYS);
    const nx = from.x + DIRS[d].dx, ny = from.y + DIRS[d].dy;
    if (nx < 1 || ny < 1 || nx >= GRID - 1 || ny >= GRID - 1) continue;
    if (nodes.has(key(nx, ny)) || neighborCount(nodes, nx, ny) !== 1) continue;
    // Evita que el inicio tenga más de 3 salidas (deja aire alrededor)
    if (from === start && neighborCount(nodes, start.x, start.y) >= 3) continue;
    const n = makeNode(nx, ny);
    nodes.set(n.key, n);
    list.push(n);
    from.doors[d] = 'normal';
    n.doors[DIRS[d].opposite] = 'normal';
  }
  return list.length === count ? { nodes, start } : null;
}

function computeDepth(nodes, start) {
  start.depth = 0;
  const queue = [start];
  const seen = new Set([start.key]);
  while (queue.length) {
    const n = queue.shift();
    for (const d of Object.keys(n.doors)) {
      const m = nodes.get(key(n.x + DIRS[d].dx, n.y + DIRS[d].dy));
      if (m && !seen.has(m.key)) { seen.add(m.key); m.depth = n.depth + 1; queue.push(m); }
    }
  }
}

/** Celda vacía con 2+ vecinos (no jefe ni inicio): ahí se esconde la sala secreta. */
function placeSecret(rng, nodes) {
  const candidates = [];
  for (let y = 1; y < GRID - 1; y++) for (let x = 1; x < GRID - 1; x++) {
    if (nodes.has(key(x, y))) continue;
    const neigh = DIR_KEYS
      .map((d) => ({ d, n: nodes.get(key(x + DIRS[d].dx, y + DIRS[d].dy)) }))
      .filter((o) => o.n && o.n.type !== 'boss' && o.n.type !== 'start' && o.n.type !== 'secret');
    if (neigh.length >= 2) candidates.push({ x, y, neigh });
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.neigh.length - a.neigh.length);
  const best = candidates.filter((c) => c.neigh.length === candidates[0].neigh.length);
  const pick = rng.pick(best);
  const s = makeNode(pick.x, pick.y);
  s.type = 'secret';
  for (const { d, n } of pick.neigh) {
    // d es la dirección desde la secreta hacia el vecino
    s.doors[d] = 'normal';
    n.doors[DIRS[d].opposite] = 'secret';
  }
  nodes.set(s.key, s);
  return s;
}

/**
 * @param rng      Random (fork del mapa)
 * @param dream    definición del sueño (usa dream.floor)
 * @param rooms    mapa id → plantilla (data/rooms)
 */
export function generateFloor(rng, dream, rooms) {
  const cfg = dream.floor;
  const specials = cfg.specials;            // tipos que van en callejones sin salida
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const count = rng.int(cfg.rooms[0], cfg.rooms[1]);
    const tree = growTree(rng, count);
    if (!tree) continue;
    const { nodes, start } = tree;
    computeDepth(nodes, start);
    start.type = 'start';

    const deadEnds = [...nodes.values()]
      .filter((n) => n !== start && Object.keys(n.doors).length === 1)
      .sort((a, b) => b.depth - a.depth);
    // Jefe + especiales obligatorios necesitan su propio callejón
    const required = specials.filter((s) => s.required);
    if (deadEnds.length < 1 + required.length) continue;
    if (deadEnds[0].depth < cfg.minBossDepth) continue;

    const boss = deadEnds.shift();
    boss.type = 'boss';
    rng.shuffle(deadEnds);
    for (const s of specials) {
      if (!s.required && !rng.chance(s.chance ?? 1)) continue;
      const n = deadEnds.find((d) => d.type === 'combat' && d.depth >= (s.minDepth ?? 1));
      if (n) n.type = s.type;
      else if (s.required) break;
    }
    if (required.some((s) => ![...nodes.values()].some((n) => n.type === s.type))) continue;

    // Desafío opcional: una sala normal profunda se convierte en desafío
    if (cfg.challengeChance && rng.chance(cfg.challengeChance)) {
      const options = [...nodes.values()].filter((n) => n.type === 'combat' && n.depth >= 2);
      if (options.length) rng.pick(options).type = 'challenge';
    }

    const secret = cfg.secret ? placeSecret(rng, nodes) : null;
    if (secret) secret.depth = Math.min(...DIR_KEYS.map((d) => nodes.get(key(secret.x + DIRS[d].dx, secret.y + DIRS[d].dy))?.depth ?? 99)) + 1;

    // Plantillas
    for (const n of nodes.values()) {
      const pool = dream.roomPool.filter((id) => rooms[id]?.types.includes(n.type));
      if (!pool.length) throw new Error(`El sueño "${dream.id}" no tiene plantillas para salas de tipo "${n.type}"`);
      n.templateId = rng.pick(pool);
    }

    return { nodes, start, boss, secret, width: GRID, height: GRID };
  }
  throw new Error(`No se pudo generar un plano válido para "${dream.id}" (revisa dream.floor)`);
}

export function neighborOf(floor, node, dir) {
  return floor.nodes.get(key(node.x + DIRS[dir].dx, node.y + DIRS[dir].dy)) ?? null;
}
