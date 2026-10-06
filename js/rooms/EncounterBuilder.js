/**
 * Construye las oleadas de una sala a partir de un presupuesto de amenaza.
 * Cada enemigo declara `cost`, `role` y `minDepth`; el sueño define el presupuesto y los límites por rol.
 * Lógica pura (sin DOM).
 */
export function buildEncounter(rng, dream, enemyDefs, depth, { challenge = false } = {}) {
  const b = dream.floor.budget;
  const caps = dream.floor.roleCaps ?? {};
  let budget = b.base + depth * b.perDepth;
  let waves = Math.min(b.maxWaves, 1 + Math.floor(depth / b.wavesEvery));
  if (challenge) { budget *= 1.5; waves = Math.min(b.maxWaves + 1, waves + 1); }

  const pool = dream.enemyPool
    .map((e) => ({ ...e, def: enemyDefs[e.id] }))
    .filter((e) => e.def && (e.def.minDepth ?? 0) <= depth);
  if (!pool.length) throw new Error(`El sueño "${dream.id}" no tiene enemigos válidos para profundidad ${depth}`);

  const result = [];
  for (let w = 0; w < waves; w++) {
    let left = budget * (0.75 + 0.3 * w);
    const counts = new Map();
    const roles = {};
    let total = 0;
    while (total < b.maxPerWave) {
      const options = pool.filter((e) => e.def.cost <= left + 0.001 &&
        (caps[e.def.role] === undefined || (roles[e.def.role] ?? 0) < caps[e.def.role]));
      if (!options.length) break;
      const pick = rng.weighted(options);
      left -= pick.def.cost;
      roles[pick.def.role] = (roles[pick.def.role] ?? 0) + 1;
      counts.set(pick.id, (counts.get(pick.id) ?? 0) + 1);
      total++;
    }
    if (total === 0) { // garantiza al menos un enemigo
      const cheapest = pool.reduce((a, c) => (c.def.cost < a.def.cost ? c : a));
      counts.set(cheapest.id, 1);
    }
    result.push([...counts].map(([id, count]) => ({ id, count })));
  }
  return { waves: result, delayBetweenWaves: b.delayBetweenWaves ?? 1.1 };
}
