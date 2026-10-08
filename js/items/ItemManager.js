import { ITEM_EFFECTS } from './ItemEffects.js';

/**
 * Objetos y sinergias del jugador durante una run.
 * Aplica modificadores de estadísticas, reparte los ganchos de efectos y detecta sinergias.
 */
export class ItemManager {
  constructor(world) {
    this.world = world;
    this.rng = world.run.rng.fork('items');
    this.owned = [];               // definiciones de objeto, en orden de obtención
    this.synergies = [];           // definiciones de sinergia activas
    this._effects = [];            // [{ fx, params, item }]
    this._state = {};              // memoria por objeto (contadores, usos...)
    this._scheduled = [];          // disparos diferidos (Eco)
  }

  has(id) { return this.owned.some((it) => it.id === id); }
  hasSynergy(id) { return this.synergies.some((s) => s.id === id); }
  state(id) { return (this._state[id] ??= {}); }

  add(id) {
    const item = this.world.game.content.items[id];
    if (!item || this.has(id)) return null;
    this.owned.push(item);
    for (const m of item.modifiers ?? []) this.world.player.stats.addModifier({ ...m, source: id });
    for (const e of item.effects ?? []) {
      const fx = ITEM_EFFECTS[e.effect];
      if (!fx) { console.warn(`[Items] efecto desconocido "${e.effect}" en ${id}`); continue; }
      this._effects.push({ fx, params: e, item });
    }
    // El onAdd va después de los modificadores (p. ej. curar tras subir la vida máxima)
    for (const e of this._effects) if (e.item === item) e.fx.onAdd?.(this, e.params);

    const newSyn = this._checkSynergies();
    const p = this.world.player;
    p.hp = Math.min(p.hp, p.stats.get('maxHp'));
    this.world.game.events.emit('item:taken', { item, synergies: newSyn });
    return { item, synergies: newSyn };
  }

  _checkSynergies() {
    const found = [];
    for (const s of Object.values(this.world.game.content.synergies)) {
      if (this.hasSynergy(s.id)) continue;
      if (s.requires.every((r) => this.has(r))) {
        this.synergies.push(s); found.push(s);
        // Una sinergia puede traer modificadores de estadísticas propios (sin programar nada)
        for (const m of s.modifiers ?? []) this.world.player.stats.addModifier({ ...m, source: `syn:${s.id}` });
      }
    }
    return found;
  }

  // ---------- Ganchos ----------

  modifyShot(shot) { for (const e of this._effects) e.fx.onShot?.(this, shot, e.params); }

  damageMult(enemy, proj) {
    let m = 1;
    for (const e of this._effects) if (e.fx.damageMult) m *= e.fx.damageMult(this, enemy, proj, e.params);
    return m;
  }

  onHitEnemy(enemy, proj) { for (const e of this._effects) e.fx.onHitEnemy?.(this, enemy, proj, e.params); }
  onHurt() { for (const e of this._effects) e.fx.onHurt?.(this, e.params); }
  onDash() { for (const e of this._effects) e.fx.onDash?.(this, e.params); }
  onKill(enemy) { for (const e of this._effects) e.fx.onKill?.(this, enemy, e.params); }

  /** Desviación aleatoria de los disparos (Cascos Rotos); la sinergia Sordina la anula. */
  get spread() {
    if (this.hasSynergy('sordina')) return 0;
    const e = this._effects.find((x) => x.params.effect === 'inaccuracy');
    return e ? e.params.spread : 0;
  }

  /** ¿Tiene algún objeto este efecto? (p. ej. 'healthBars') */
  hasEffect(name) { return this._effects.some((e) => e.params.effect === name); }

  /** Radio del aura del Polvo Luminoso (0 si no hay aura). Sinergia Faro: ×1,6. */
  auraRadius() {
    const a = this._effects.find((e) => e.params.effect === 'aura');
    if (!a) return 0;
    return a.params.radius * (this.hasSynergy('faro') ? 1.6 : 1);
  }

  onRoomEnter(node, first) { for (const e of this._effects) e.fx.onRoomEnter?.(this, node, first, e.params); }

  /** ¿Algún objeto anula este golpe? (Rocío) */
  blockHit() {
    for (const e of this._effects) if (e.fx.blockHit?.(this, e.params)) return true;
    return false;
  }

  onDashing() { for (const e of this._effects) e.fx.onDashing?.(this, e.params); }

  /** Dibujo propio de los objetos (compañeros que vuelan junto al jugador). */
  render(g) { for (const e of this._effects) e.fx.render?.(this, g, e.params); }

  onDreamStart() { for (const e of this._effects) e.fx.onDreamStart?.(this, e.params); }
  onRoomClear() { for (const e of this._effects) e.fx.onRoomClear?.(this, e.params); }

  lightMult() {
    let m = 1;
    for (const e of this._effects) if (e.fx.lightMult) m *= e.fx.lightMult(this, e.params);
    return m;
  }

  preventDeath() {
    for (const e of this._effects) if (e.fx.preventDeath?.(this, e.params)) return true;
    return false;
  }

  /** Programa un disparo para dentro de `delay` segundos (lo lanza PlayerCombat). */
  schedule(shot, delay) { this._scheduled.push({ shot, t: delay }); }

  update(dt, spawnShot) {
    for (const e of this._effects) e.fx.onUpdate?.(this, dt, e.params);
    if (!this._scheduled.length) return;
    for (const s of this._scheduled) {
      s.t -= dt;
      if (s.t <= 0) {
        // El eco sale desde donde está el jugador ahora, hacia donde apuntaba entonces
        const p = this.world.player;
        s.shot.x = p.x + Math.cos(s.shot.angle) * 6;
        s.shot.y = p.y - 1 + Math.sin(s.shot.angle) * 4;
        if (p.alive) spawnShot(s.shot);
      }
    }
    this._scheduled = this._scheduled.filter((s) => s.t > 0);
  }

  clearScheduled() { this._scheduled.length = 0; }
}
