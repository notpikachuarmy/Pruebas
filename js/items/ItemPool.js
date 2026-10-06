/**
 * Elige objetos para una sala respetando pools, rareza y lo que ya ha salido en la run.
 * Ningún objeto aparece dos veces en la misma run.
 */
const RARITY_WEIGHT = { común: 10, rara: 4, legendaria: 1 };

export function drawItem(world, pools, { rng = world.rngLoot, boostRare = false } = {}) {
  const { run, game } = world;
  const unlocked = game.save.data.meta.unlocks.items;
  const candidates = Object.values(game.content.items).filter((it) =>
    it.pools.some((p) => pools.includes(p)) &&
    !run.offeredItems.has(it.id) &&
    (!it.locked || unlocked.includes(it.id)));
  if (!candidates.length) return null;
  const weighted = candidates.map((it) => ({
    it, weight: RARITY_WEIGHT[it.rarity] * (boostRare && it.rarity !== 'común' ? 2.5 : 1),
  }));
  const pick = rng.weighted(weighted).it;
  run.offeredItems.add(pick.id);
  return pick;
}

export const ITEM_PRICES = { común: 12, rara: 18, legendaria: 25 };
