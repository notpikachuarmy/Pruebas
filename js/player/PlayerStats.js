/**
 * Estadísticas con modificadores. Los objetos (Fase 5) añadirán modificadores
 * en lugar de tocar valores a mano:  stats.addModifier({ stat: 'fireRate', mult: 1.25, source: 'metronomo' })
 * Valor final = (base + suma de `add`) * producto de `mult`
 */
export const BASE_STATS = {
  maxHp: 6,                  // en medios corazones (6 = 3 corazones)
  speed: 92,                 // px/s
  damage: 1,
  fireRate: 3.2,             // disparos por segundo
  shotSpeed: 210,
  range: 165,                // px que recorre una onda
  shotSize: 3,
  knockback: 70,
  dashSpeed: 270,
  dashDuration: 0.16,
  dashCooldown: 0.55,        // tiempo de recarga de cada carga de Silencio
  dashCharges: 1,            // Silencios acumulables (objeto Doble Bombo)
  hurtInvulnerability: 1.0,  // s
};

export class PlayerStats {
  constructor(base = BASE_STATS) {
    this.base = { ...base };
    this.modifiers = [];
    this.cache = {};
    this.recalculate();
  }

  get(stat) { return this.cache[stat]; }

  addModifier(mod) { this.modifiers.push(mod); this.recalculate(); }

  removeBySource(source) {
    this.modifiers = this.modifiers.filter((m) => m.source !== source);
    this.recalculate();
  }

  recalculate() {
    for (const stat of Object.keys(this.base)) {
      let add = 0, mult = 1;
      for (const m of this.modifiers) {
        if (m.stat !== stat) continue;
        add += m.add ?? 0;
        mult *= m.mult ?? 1;
      }
      this.cache[stat] = (this.base[stat] + add) * mult;
    }
  }
}
