/**
 * Efectos reutilizables de los objetos. Un objeto de datos los usa por nombre con parámetros:
 *   effects: [{ effect: 'echo', delay: 0.25, damage: 0.6 }]
 * Ganchos disponibles (todos opcionales):
 *   onAdd(ctx, p)                     al conseguir el objeto
 *   onShot(ctx, shot, p)              modifica cada disparo antes de crearlo (puede añadir shot.extras)
 *   damageMult(ctx, enemy, proj, p)   multiplicador de daño contra un enemigo
 *   onHitEnemy(ctx, enemy, proj, p)   tras golpear
 *   onHurt(ctx, p)                    al recibir daño
 *   preventDeath(ctx, p)              devuelve true si evita la expulsión
 *   onDash(ctx, p)                    al usar el Silencio
 *   onRoomClear(ctx, p)               al limpiar una sala
 *   lightMult(ctx, p)                 multiplicador del radio de luz (sueños oscuros)
 *   onKill(ctx, enemy, p)             al disipar un enemigo
 *   onUpdate(ctx, dt, p)              cada paso (auras, temporizadores)
 * ctx = ItemManager (ctx.world, ctx.has(id), ctx.hasSynergy(id), ctx.state(itemId)).
 * Las sinergias se resuelven dentro del efecto al que afectan (ctx.hasSynergy).
 */
export const ITEM_EFFECTS = {
  echo: {
    onShot(ctx, shot, p) {
      if (shot.isEcho) return;
      const echo = { ...shot, extras: null, isEcho: true };
      const keepStrong = shot.strong && ctx.hasSynergy('polirritmia');
      echo.damage = keepStrong ? shot.damage : shot.damage * p.damage;
      echo.radius = Math.max(2, shot.radius - 1);
      if (ctx.hasSynergy('zigzag_doble') && shot.waveAmp) echo.wavePhase = (shot.wavePhase ?? 0) + Math.PI;
      ctx.schedule(echo, p.delay);
    },
  },

  metronome: {
    onShot(ctx, shot, p) {
      if (shot.isEcho || shot.isRing) return;
      const st = ctx.state('metronomo');
      const w = ctx.world;
      const gap = 1.7 / w.player.stats.get('fireRate');
      st.count = w.time - (st.last ?? -9) <= gap ? (st.count ?? 0) + 1 : 1;
      st.last = w.time;
      if (st.count % p.every === 0) {
        shot.strong = true;
        shot.damage *= p.mult;
        shot.radius += 1;
        shot.color = '#ffd65c';
        w.game.audio.play('hitEnemy', { pitch: 1.8 });
      }
    },
    onHitEnemy(ctx, enemy, proj) {
      if (!proj.strong || !ctx.hasSynergy('bajo_y_bateria')) return;
      const w = ctx.world;
      for (const o of w.enemies.query(enemy.x, enemy.y, 40)) {
        const dx = o.x - enemy.x, dy = o.y - enemy.y, d = Math.hypot(dx, dy) || 1;
        if (d < 40 && (o.def.mass ?? 1) < 50) { o.kx += (dx / d) * 160; o.ky += (dy / d) * 160; }
      }
      w.effects.burst(enemy.x, enemy.y - 6, 14, '#ffd65c', 110, 0.35);
      w.shake(2, 0.1);
    },
  },

  zigzag: {
    onShot(ctx, shot, p) { shot.waveAmp = p.amp; shot.waveFreq = p.freq; shot.wavePhase ??= 0; },
  },

  pierce: {
    onShot(ctx, shot, p) { shot.pierce = (shot.pierce ?? 0) + p.count; },
  },

  trail: {
    onShot(ctx, shot, p) { shot.hazardTrail = p.hazard; },
  },

  revealMap: {
    onAdd(ctx, p) {
      const run = ctx.world.run;
      run.flags.mapRevealed = true;
      if (p.secret && run.floor.secret) run.floor.secret.state.discovered = true;
    },
    // También en cada sueño nuevo de la noche
    onDreamStart(ctx, p) { this.onAdd(ctx, p); },
  },

  randomDamage: {
    onShot(ctx, shot, p) {
      const perfect = shot.strong && ctx.hasSynergy('nota_perfecta');
      const roll = perfect ? p.max : ctx.rng.range(p.min, p.max);
      shot.damage *= roll;
      if (roll > 2.2) shot.color = '#ffd65c';
      else if (roll < 0.8) shot.color = '#9b8fc7';
    },
  },

  damageVsTag: {
    damageMult(ctx, enemy, proj, p) { return enemy.def.tags?.includes(p.tag) ? p.mult : 1; },
  },

  revive: {
    preventDeath(ctx, p) {
      const st = ctx.state('despertador_repuesto');
      if (st.used) return false;
      st.used = true;
      const pl = ctx.world.player;
      pl.hp = p.hp;
      pl.invulnerable = 2;
      ctx.world.effects.burst(pl.x, pl.y - 10, 30, '#ffd65c', 100, 0.8, 2);
      ctx.world.game.audio.play('cleared', { pitch: 0.8 });
      ctx.world.toast('Cinco minutos más…');
      return true;
    },
  },

  bounce: {
    onShot(ctx, shot, p) {
      shot.bounces = (shot.bounces ?? 0) + p.count;
      shot.bounceShrink = p.shrink;
      if (ctx.hasSynergy('caleidoscopio')) shot.splitOnBounce = true;
    },
  },

  dashErase: {
    onDash(ctx, p) {
      const w = ctx.world, pl = w.player;
      const n = w.projectiles.eraseInRadius(pl.x, pl.y - 4, p.radius, 'enemy');
      if (n) w.effects.burst(pl.x, pl.y - 6, 10, '#8fd3ff', 70, 0.3);
      if (ctx.hasSynergy('silencio_absoluto')) w.freezeEnemies(0.6);
    },
  },

  boomerang: {
    onShot(ctx, shot, p) {
      if (ctx.rng.chance(p.chance)) { shot.boomerang = true; shot.color = '#c9bde6'; }
    },
  },

  homing: {
    onShot(ctx, shot, p) {
      const strong = ctx.hasSynergy('sintonia_fina');
      shot.homing = p.turn * (strong ? 2 : 1);
      shot.homingRange = p.range;
      if (strong) shot.pierce = (shot.pierce ?? 0) + 1;
    },
  },

  freezeOnHurt: {
    onHurt(ctx, p) { ctx.world.freezeEnemies(p.time); },
  },

  heal: {
    onAdd(ctx, p) { ctx.world.damage.healPlayer(p.amount); },
  },

  markOnHit: {
    onHitEnemy(ctx, enemy, proj, p) { enemy.marked = p.time; },
    damageMult(ctx, enemy, proj, p) { return enemy.marked > 0 ? p.mult : 1; },
  },

  light: {
    lightMult(ctx, p) { return p.mult; },
  },

  fullHpDamage: {
    damageMult(ctx, enemy, proj, p) {
      const pl = ctx.world.player;
      return pl.hp >= pl.stats.get('maxHp') ? p.mult : 1;
    },
  },

  clearHeal: {
    onRoomClear(ctx, p) {
      const w = ctx.world;
      if (!ctx.hasSynergy('hogar') && !ctx.rng.chance(p.chance)) return;
      if (w.damage.healPlayer(p.amount)) {
        w.game.audio.play('heal');
        w.effects.burst(w.player.x, w.player.y - 10, 8, '#eb2f2d', 50, 0.4);
      }
    },
  },

  /** Anillo Rosa: constructo que cae sobre el enemigo golpeado; el tipo depende de la vida máxima. */
  construct: {
    onHitEnemy(ctx, enemy, proj, p) {
      const st = ctx.state('anillo_rosa');
      const w = ctx.world;
      if (proj.isConstruct || proj.isAura || proj.isExplosion || w.time - (st.last ?? -99) < p.cooldown) return;
      st.last = w.time;
      const hearts = w.player.stats.get('maxHp') / 2;
      const kind = hearts >= 6 ? 'estrella' : hearts >= 4 ? 'martillo' : 'corazon';
      w.spawnConstruct(kind, enemy);
    },
  },

  /** Guía de Pesadillas: barras de vida (las dibuja EnemyManager si el efecto está activo). */
  healthBars: {},

  /** Polvo Luminoso: daño periódico a los enemigos dentro del radio. */
  aura: {
    onUpdate(ctx, dt, p) {
      const st = ctx.state('aura');
      st.t = (st.t ?? 0) - dt;
      if (st.t > 0) return;
      st.t = p.tick;
      const w = ctx.world, pl = w.player;
      if (!pl.alive) return;
      const r = ctx.auraRadius();
      for (const e of w.enemies.query(pl.x, pl.y, r + 8)) {
        if (!e.canBeHit()) continue;
        if ((e.x - pl.x) ** 2 + (e.y - pl.y) ** 2 > r * r) continue;
        w.damage.hitEnemy(e, p.damage, e.x - pl.x, e.y - pl.y, 10, { isAura: true });
      }
    },
  },

  /** Caramelo Explosivo: los enemigos disipados estallan. */
  killExplosion: {
    onKill(ctx, enemy, p) {
      const w = ctx.world;
      w.effects.burst(enemy.x, enemy.y - 6, 14, '#ff6aa0', 90, 0.4, 2);
      for (const o of w.enemies.query(enemy.x, enemy.y, p.radius + 8)) {
        if (o === enemy || !o.canBeHit()) continue;
        if ((o.x - enemy.x) ** 2 + (o.y - enemy.y) ** 2 > p.radius * p.radius) continue;
        w.damage.hitEnemy(o, p.damage, o.x - enemy.x, o.y - enemy.y, 60, { isExplosion: true });
      }
    },
  },

  /** Bolsa de Chuches: Lucidez extra al limpiar una sala. */
  clearLucidity: {
    onRoomClear(ctx, p) {
      const w = ctx.world, n = ctx.rng.int(p.amount[0], p.amount[1]);
      for (let i = 0; i < n; i++) w.pickups.spawn('lucidity', w.player.x, w.player.y - 6);
    },
  },

  ring: {
    onShot(ctx, shot, p) {
      if (shot.isEcho || shot.isRing) return;
      const st = ctx.state('megafono');
      st.count = (st.count ?? 0) + 1;
      if (st.count % p.every !== 0) return;
      const full = ctx.hasSynergy('acople');
      shot.extras ??= [];
      for (let i = 0; i < p.count; i++) {
        const a = (i / p.count) * Math.PI * 2;
        shot.extras.push({
          ...shot, extras: null, isRing: true, angle: a,
          damage: shot.damage * (full ? 1 : 0.5),
          radius: full ? shot.radius : Math.max(2, shot.radius - 1),
          range: shot.range * (full ? 0.8 : 0.45),
          pierce: (shot.pierce ?? 0) + (full ? 1 : 0),
          strong: false, color: '#fff6d6',
        });
      }
    },
  },
};
