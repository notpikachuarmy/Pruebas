/** Efectos de las elecciones de eventos (data/events). Las elecciones los nombran con `effect`. */
export const EVENT_EFFECTS = {
  /** La próxima sala de combate que limpies soltará un corazón seguro. */
  favor(world) { world.run.flags.favor = true; },

  healFull(world) { world.damage.healPlayer(99); },

  lucidity(world, choice) { world.run.lucidity += choice.amount ?? 5; },

  /** Da un objeto concreto (choice.item), aunque esté bloqueado: es la forma de conseguirlo. */
  giveItem(world, choice) {
    world.takeItem(choice.item);
    const unlocked = world.game.save.data.meta.unlocks.items;
    if (!unlocked.includes(choice.item)) unlocked.push(choice.item);
  },

  /** Muestra en el mapa todas las salas no secretas (anula "Folio en blanco"). */
  revealMap(world) { world.run.flags.mapRevealed = true; },

  review(world) {
    const p = world.player;
    p.stats.addModifier({ stat: 'maxHp', add: -2, source: 'revision' });
    p.hp = Math.min(p.hp, p.stats.get('maxHp'));
    world.run.lucidity += 12;
  },
};

/** ¿Puede elegirse? Devuelve null si sí, o el motivo si no. */
export function choiceBlocked(world, choice) {
  if (choice.cost?.lucidity && world.run.lucidity < choice.cost.lucidity) return `Necesitas ${choice.cost.lucidity} de Lucidez`;
  if (choice.requires?.maxHp && world.player.stats.get('maxHp') < choice.requires.maxHp) return 'No te quedan corazones suficientes';
  return null;
}

export function applyChoice(world, choice) {
  if (choice.cost?.lucidity) world.run.lucidity -= choice.cost.lucidity;
  if (choice.effect) EVENT_EFFECTS[choice.effect](world, choice);
}
