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
      if (ctx.hasSynergy('acorde')) echo.pierce = (shot.pierce ?? 0) + 1;
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
    onShot(ctx, shot, p) { shot.hazardTrail = [...(shot.hazardTrail ?? []), p.hazard]; },
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
    // Sinergia Faro del Puerto (Brújula + Linterna): todavía más luz
    lightMult(ctx, p) { return p.mult * (ctx.hasSynergy('faro_puerto') ? 1.4 : 1); },
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
        if (ctx.hasSynergy('sol_medianoche')) { e.burn = Math.max(e.burn ?? 0, 2); e.burnDps = 1; }
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

  // ---------- Objetos de la Fase 7c ----------

  /** Púa de Guitarra: golpes críticos. Con Solo de Guitarra, el golpe del metrónomo siempre es crítico. */
  crit: {
    onShot(ctx, shot, p) {
      if (shot.isRing) return;
      const sure = shot.strong && ctx.hasSynergy('solo_guitarra');
      if (sure || ctx.rng.chance(p.chance)) { shot.damage *= p.mult; shot.crit = true; shot.color = '#ff9a3c'; shot.radius += 1; }
    },
  },

  /** Caracola: cada N disparos, una gran ola que lo atraviesa todo. Con Marejada, empuja muchísimo. */
  bigWave: {
    onShot(ctx, shot, p) {
      if (shot.isEcho || shot.isRing) return;
      const st = ctx.state('caracola');
      st.count = (st.count ?? 0) + 1;
      if (st.count % p.every) return;
      shot.radius += 3; shot.pierce = 99; shot.damage *= p.mult; shot.range *= 1.4;
      shot.knockback *= ctx.hasSynergy('marejada') ? 4 : 1.5;
      shot.color = '#8fd3ff'; shot.trailColor = '#25307a';
      ctx.world.game.audio.play('cleared', { pitch: 0.6, volume: 0.6 });
    },
  },

  /** Pedal de Distorsión: las notas se rompen en fragmentos al apagarse. */
  fragment: {
    onShot(ctx, shot, p) { if (!shot.isRing) shot.splitOnExpire = p.count; },
  },

  /** Cascos Rotos: la desviación se aplica en PlayerCombat (ctx.spread). */
  inaccuracy: {},

  /** Bombona de Oxígeno: ignora todo lo que frena (tinta, sirope, corrientes). */
  noSlow: {},

  /** Brújula: marca en el mapa las salas importantes de cada sueño. */
  compass: {
    onAdd(ctx) { ctx.world.run.flags.compass = true; },
    onDreamStart(ctx) { ctx.world.run.flags.compass = true; },
  },

  /** Triángulo: probabilidad de aturdir. Con Orquesta, más probable. */
  stunOnHit: {
    onHitEnemy(ctx, enemy, proj, p) {
      if (proj.isAura || enemy.def.boss) return;
      const chance = p.chance * (ctx.hasSynergy('orquesta') ? 2 : 1);
      if (ctx.rng.chance(chance)) enemy.stun = Math.max(enemy.stun, p.time);
    },
  },

  /** Gong: al recibir daño, onda expansiva que golpea a toda la sala. */
  gongOnHurt: {
    onHurt(ctx, p) {
      const w = ctx.world, pl = w.player;
      for (const e of w.enemies.list) {
        if (!e.canBeHit()) continue;
        w.damage.hitEnemy(e, p.damage, e.x - pl.x, e.y - pl.y, 160, { isAura: true });
        if (ctx.hasSynergy('orquesta') && !e.def.boss) e.stun = Math.max(e.stun, 0.8);
      }
      w.effects.burst(pl.x, pl.y - 8, 40, '#ffd65c', 200, 0.6, 2);
      w.shake(5, 0.3);
      w.game.audio.play('killEnemy', { pitch: 0.4 });
    },
  },

  /** Salvavidas: al bajar a un corazón o menos, una vez por sala, te protege y aparta a todos. */
  lifebuoy: {
    onHurt(ctx, p) {
      const w = ctx.world, pl = w.player, st = ctx.state('salvavidas');
      if (pl.hp > 2 || st.room === w.node) return;
      st.room = w.node;
      pl.invulnerable = Math.max(pl.invulnerable, p.time);
      for (const e of w.enemies.list) {
        const dx = e.x - pl.x, dy = e.y - pl.y, d = Math.hypot(dx, dy) || 1;
        if (d < 70 && (e.def.mass ?? 1) < 50) { e.kx += (dx / d) * 260; e.ky += (dy / d) * 260; }
      }
      w.projectiles.eraseInRadius(pl.x, pl.y, 60, 'enemy');
      w.effects.burst(pl.x, pl.y - 8, 24, '#eb2f2d', 120, 0.5, 2);
      w.toast('¡Salvavidas!');
    },
  },

  /** Vinilo de Oro: cada enemigo disipado suma daño hasta un máximo; recibir daño lo pierde todo. */
  killStack: {
    onKill(ctx, enemy, p) {
      const st = ctx.state('vinilo_oro');
      const max = ctx.hasSynergy('disco_platino') ? p.max * 2 : p.max;
      st.n = Math.min(max, (st.n ?? 0) + 1);
    },
    onHurt(ctx) { ctx.state('vinilo_oro').n = 0; },
    damageMult(ctx, enemy, proj, p) { return 1 + (ctx.state('vinilo_oro').n ?? 0) * p.per; },
  },

  /** Bis: al limpiar una sala, unos segundos de cadencia doble. */
  encore: {
    onRoomClear(ctx, p) { ctx.state('bis').t = p.time; },
    onUpdate(ctx, dt, p) {
      const st = ctx.state('bis'), stats = ctx.world.player.stats;
      const active = (st.t ?? 0) > 0;
      if (active) st.t -= dt;
      const has = stats.modifiers.some((m) => m.source === 'bis');
      if (active && !has) stats.addModifier({ stat: 'fireRate', mult: p.mult, source: 'bis' });
      if (!active && has) stats.removeBySource('bis');
    },
  },

  /** Batuta: quieto, disparas mucho más rápido. */
  stillFire: {
    onUpdate(ctx, dt, p) {
      const pl = ctx.world.player, stats = pl.stats;
      const still = pl.alive && !pl.moving && !pl.isDashing;
      const has = stats.modifiers.some((m) => m.source === 'batuta');
      if (still && !has) stats.addModifier({ stat: 'fireRate', mult: p.mult, source: 'batuta' });
      if (!still && has) stats.removeBySource('batuta');
    },
  },

  /** Marcapasos: cada X segundos sin recibir daño, recuperas medio corazón. */
  regen: {
    onUpdate(ctx, dt, p) {
      const st = ctx.state('marcapasos');
      const every = ctx.hasSynergy('ritmo_cardiaco') ? p.every * 0.66 : p.every;
      st.t = (st.t ?? 0) + dt;
      if (st.t >= every) {
        st.t = 0;
        if (ctx.world.damage.healPlayer(1)) { ctx.world.game.audio.play('heal'); ctx.world.floatText(ctx.world.player.x, ctx.world.player.y - 24, '♥'); }
      }
    },
    onHurt(ctx) { ctx.state('marcapasos').t = 0; },
  },

  /** Llama de Muspel: los enemigos golpeados arden. */
  burn: {
    onHitEnemy(ctx, enemy, proj, p) {
      if (proj.isBurn) return;
      enemy.burn = Math.max(enemy.burn ?? 0, p.time);
      enemy.burnDps = p.dps;
    },
  },

  /** Gjallarhorn: al empezar cada oleada, aturde y marca a los enemigos nuevos. */
  horn: {
    onUpdate(ctx, dt, p) {
      const w = ctx.world, enc = w.encounter, st = ctx.state('gjallarhorn');
      if (!enc || enc.finished) { st.wave = -1; st.enc = enc; return; }
      if (st.enc !== enc) { st.enc = enc; st.wave = -1; }
      if (enc.waveIndex === st.wave || enc.waveIndex < 0) return;
      st.wave = enc.waveIndex;
      for (const e of w.enemies.list) {
        if (!e.def.boss) e.stun = Math.max(e.stun, p.stun + 0.7);
        e.marked = Math.max(e.marked, p.mark);
      }
      w.floatText(w.player.x, w.player.y - 30, '¡Gjallarhorn!');
      w.game.audio.play('waveStart', { pitch: 0.5 });
      w.shake(2, 0.2);
    },
  },

  // ---------- Objetos del Bosque ----------

  /** Asta: el Silencio embiste y daña a los enemigos que atraviesas. */
  dashStrike: {
    onDash(ctx) { ctx.state('asta').hit = new Set(); },
    onDashing(ctx, p) {
      const w = ctx.world, pl = w.player, st = ctx.state('asta');
      for (const e of w.enemies.query(pl.x, pl.y, 20)) {
        if (!e.canBeHit() || st.hit?.has(e.uid) || (e.x - pl.x) ** 2 + (e.y - pl.y) ** 2 > 16 * 16) continue;
        st.hit?.add(e.uid);
        const dmg = p.damage * (ctx.hasSynergy('rey_bosque') ? 1.5 : 1);
        w.damage.hitEnemy(e, dmg, pl.dashX, pl.dashY, 200, { isAura: true });
        w.effects.burst(e.x, e.y - 6, 8, '#c88a3c', 70, 0.3);
      }
    },
  },

  /** Piel de Lobo: al recibir daño, los enemigos cercanos se llevan un zarpazo. */
  thorns: {
    onHurt(ctx, p) {
      const w = ctx.world, pl = w.player;
      for (const e of w.enemies.query(pl.x, pl.y, p.radius + 10)) {
        if (!e.canBeHit() || (e.x - pl.x) ** 2 + (e.y - pl.y) ** 2 > p.radius * p.radius) continue;
        w.damage.hitEnemy(e, p.damage, e.x - pl.x, e.y - pl.y, 160, { isAura: true });
      }
      w.effects.burst(pl.x, pl.y - 8, 16, '#9a8a7a', 100, 0.35);
    },
  },

  /** Trampa Rota: el Silencio deja un cepo que atrapa al primer enemigo que lo pisa. */
  dashTrap: {
    onDash(ctx, p) {
      const w = ctx.world, pl = w.player, st = ctx.state('trampa_rota');
      if (w.time - (st.last ?? -99) < p.cooldown) return;
      st.last = w.time;
      w.hazards.spawn('playerTrap', pl.x, pl.y, 10, p.life);
    },
  },

  /** Compañeros (Luciérnaga, Petirrojo): vuelan a tu alrededor y disparan al enemigo más cercano. */
  familiar: {
    onUpdate(ctx, dt, p) {
      const w = ctx.world, pl = w.player, st = ctx.state(`fam:${p.kind}`);
      st.a = (st.a ?? (p.kind === 'petirrojo' ? Math.PI : 0)) + dt * 2;
      st.x = pl.x + Math.cos(st.a) * 18; st.y = pl.y - 14 + Math.sin(st.a) * 8;
      if (!pl.alive) return;
      const every = p.every * (ctx.hasSynergy('manada') ? 0.6 : 1);
      st.t = (st.t ?? every) - dt;
      if (st.t > 0) return;
      let best = null, bd = 150 * 150;
      for (const e of w.enemies.list) {
        if (!e.canBeHit()) continue;
        const d = (e.x - st.x) ** 2 + (e.y - 6 - st.y) ** 2;
        if (d < bd) { bd = d; best = e; }
      }
      if (!best) return;
      st.t = every;
      const ang = Math.atan2(best.y - 6 - (st.y + 8), best.x - st.x);
      w.projectiles.spawn({ team: 'player', x: st.x, y: st.y + 8, z: 8, angle: ang, speed: 170, radius: 2, damage: p.damage * pl.stats.get('damage'), knockback: 20, range: 170, color: p.color, trailColor: p.trail });
    },
    render(ctx, g, p) {
      const st = ctx.state(`fam:${p.kind}`);
      if (st.x === undefined || !ctx.world.player.alive) return;
      const x = Math.round(st.x), y = Math.round(st.y);
      if (p.kind === 'luciernaga') {
        g.globalAlpha = 0.35 + 0.25 * Math.sin(ctx.world.time * 8);
        g.fillStyle = '#fff38a'; g.fillRect(x - 3, y - 3, 6, 6);
        g.globalAlpha = 1; g.fillStyle = '#ffd65c'; g.fillRect(x - 1, y - 1, 2, 2);
        g.fillStyle = '#3a2a1c'; g.fillRect(x - 1, y - 3, 2, 2);
      } else {
        const f = Math.floor(ctx.world.time * 10) % 2;
        g.fillStyle = '#6b4428'; g.fillRect(x - 3, y - 2, 6, 4);
        g.fillStyle = '#eb5a3a'; g.fillRect(x - 2, y, 3, 2);
        g.fillStyle = '#8a5a34'; g.fillRect(x - 5, y - 2 - f, 2, 2); g.fillRect(x + 3, y - 2 - f, 2, 2);
        g.fillStyle = '#191817'; g.fillRect(x + 1, y - 1, 1, 1);
      }
    },
  },

  /** Ceniza: los enemigos disipados dejan fuego que quema a otros enemigos. */
  killFire: {
    onKill(ctx, enemy, p) {
      const big = ctx.hasSynergy('incendio_controlado');
      ctx.world.hazards.spawn('playerFire', enemy.x, enemy.y, big ? p.radius * 1.6 : p.radius, p.life);
    },
  },

  /** Rocío: el primer golpe que recibes en cada sala no te hace daño. */
  roomShield: {
    onRoomEnter(ctx) { ctx.state('rocio').ready = true; },
    blockHit(ctx) {
      const st = ctx.state('rocio');
      if (!st.ready) return false;
      st.ready = false;
      ctx.world.floatText(ctx.world.player.x, ctx.world.player.y - 26, 'Rocío');
      return true;
    },
    onAdd(ctx) { ctx.state('rocio').ready = true; },
  },

  /** Semilla: cada sala limpia suma un poco de daño para el resto de la noche. */
  growth: {
    onRoomClear(ctx, p) {
      const st = ctx.state('semilla');
      const cap = p.max * (ctx.hasSynergy('bosque_vivo') ? 2 : 1);
      if ((st.n ?? 0) >= cap) return;
      st.n = (st.n ?? 0) + 1;
      ctx.world.player.stats.addModifier({ stat: 'damage', add: p.per, source: 'semilla' });
      ctx.world.floatText(ctx.world.player.x, ctx.world.player.y - 26, 'Crece');
    },
  },

  /** Musgo: al entrar por primera vez en una sala, a veces recuperas medio corazón. */
  newRoomHeal: {
    onRoomEnter(ctx, node, first, p) {
      if (!first || !ctx.rng.chance(p.chance)) return;
      if (ctx.world.damage.healPlayer(1)) ctx.world.game.audio.play('heal');
    },
  },

  /** Panal: los enemigos golpeados se quedan pegados y van a mitad de velocidad. */
  slowOnHit: {
    onHitEnemy(ctx, enemy, proj, p) { if (!enemy.def.boss) enemy.slow = Math.max(enemy.slow ?? 0, p.time); },
  },

  /** Huida: tras recibir daño, corres mucho más durante unos segundos. */
  fleeBoost: {
    onHurt(ctx, p) { ctx.state('huida').t = p.time; },
    onUpdate(ctx, dt, p) {
      const st = ctx.state('huida'), stats = ctx.world.player.stats;
      const active = (st.t ?? 0) > 0;
      if (active) st.t -= dt;
      const has = stats.modifiers.some((m) => m.source === 'huida');
      if (active && !has) stats.addModifier({ stat: 'speed', mult: p.mult, source: 'huida' });
      if (!active && has) stats.removeBySource('huida');
    },
  },

  /** Instinto: cada Silencio lanza un anillo de notas a tu alrededor. */
  dashRing: {
    onDash(ctx, p) {
      const w = ctx.world, pl = w.player;
      const n = ctx.hasSynergy('estampida') ? p.count + 4 : p.count;
      for (let i = 0; i < n; i++) {
        w.projectiles.spawn({ team: 'player', x: pl.x, y: pl.y - 1, z: 9, angle: (i / n) * Math.PI * 2, speed: 160, radius: 2, damage: pl.stats.get('damage') * p.damage, knockback: 40, range: 90, color: '#fff6d6', trailColor: '#c88a3c' });
      }
    },
  },

  /** Piña: cada N notas, una que estalla al impactar. */
  explosiveShot: {
    onShot(ctx, shot, p) {
      if (shot.isEcho || shot.isRing) return;
      const st = ctx.state('pina');
      st.n = (st.n ?? 0) + 1;
      if (st.n % p.every) return;
      shot.explode = p.radius; shot.radius += 1; shot.color = '#c88a3c';
    },
  },

  /** Corazón Salvaje: con media vida o menos, más daño y cadencia. */
  lowHpFury: {
    damageMult(ctx, enemy, proj, p) {
      const pl = ctx.world.player;
      return pl.hp <= pl.stats.get('maxHp') / 2 ? p.mult : 1;
    },
    onUpdate(ctx, dt, p) {
      const pl = ctx.world.player, stats = pl.stats;
      const active = pl.alive && pl.hp <= stats.get('maxHp') / 2;
      const has = stats.modifiers.some((m) => m.source === 'furia');
      if (active && !has) stats.addModifier({ stat: 'fireRate', mult: p.fireRate, source: 'furia' });
      if (!active && has) stats.removeBySource('furia');
    },
  },

  /** Trébol: más objetos raros y más botín de los enemigos (lo aplican ItemPool y Pickups). */
  luck: {},

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
