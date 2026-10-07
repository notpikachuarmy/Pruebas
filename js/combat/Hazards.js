import { Pool } from '../core/Pool.js';

/**
 * Zonas en el suelo que afectan al jugador. Cada tipo define:
 *  onPlayer(player, h, world)  mientras el jugador está dentro
 *  onExpire(h, world)          al terminar (opcional)
 *  ink: true                   su duración se multiplica por world.mods.inkLife (regla "La tinta no se seca")
 */
export const HAZARD_TYPES = {
  ink: {
    ink: true, color: '#25307a', edge: '#3d4ca8',
    onPlayer(player, h, world) { if (!world.items.hasEffect('noSlow')) player.slowFactor = Math.min(player.slowFactor, 0.55); },
  },
  redInk: {
    ink: true, color: '#b72025', edge: '#eb5a4a',
    onPlayer(player, h, world) {
      if (!world.items.hasEffect('noSlow')) player.slowFactor = Math.min(player.slowFactor, 0.75);
      world.damage.hurtPlayer(1, 0, 0, h.source);
    },
  },
  // Tipp-Ex: línea blanca del jugador que borra proyectiles enemigos
  whiteLine: {
    color: '#fff6d6', edge: '#ffffff',
    onUpdate(h, world, dt) {
      world.projectiles.eraseInRadius(h.x, h.y, h.r + 2, 'enemy');
      // Sinergia Corrector: también daña a los enemigos de tinta
      if (!world.items.hasSynergy('corrector')) return;
      for (const e of world.enemies.query(h.x, h.y, 12)) {
        if (!e.canBeHit() || !e.def.tags?.includes('tinta')) continue;
        if ((e.x - h.x) ** 2 + (e.y - h.y) ** 2 > 100) continue;
        e.hp -= 2.5 * dt; e.flash = 0.03;
        if (e.hp <= 0) world.damage.killEnemy(e);
      }
    },
  },
  // Saxofón: rastro de notas que daña a los enemigos que lo pisan
  soundTrail: {
    color: '#ffd65c', edge: '#fff6d6',
    onUpdate(h, world, dt) {
      const dmg = (world.items.hasSynergy('big_band') ? 3 : 1.5) * dt;
      for (const e of world.enemies.query(h.x, h.y, 14)) {
        if (!e.canBeHit() || (e.x - h.x) ** 2 + (e.y - h.y) ** 2 > 100) continue;
        e.hp -= dmg; e.flash = 0.03;
        if (e.hp <= 0) world.damage.killEnemy(e);
      }
    },
  },
  // Agua salada del sueño del mar: charcos de aguas oscuras (solo visual + frena un poco)
  seaFoam: {
    color: '#1d3a5a', edge: '#8fd3ff',
    onPlayer(player, h, world) { if (!world.items.hasEffect('noSlow')) player.slowFactor = Math.min(player.slowFactor, 0.7); },
  },
  // Sirope de los sueños dulces: frena pero no hace daño
  syrup: {
    color: '#ff8fc0', edge: '#ffd0e4',
    onPlayer(player, h, world) { if (!world.items.hasEffect('noSlow')) player.slowFactor = Math.min(player.slowFactor, 0.6); },
  },
  // Bomba de caramelo: aviso que cae y deja sirope
  caramelDrop: {
    render(g, h) {
      const k = 1 - h.life / h.max;
      g.globalAlpha = 0.3 + 0.4 * k;
      g.fillStyle = '#ff8fc0';
      g.beginPath(); g.ellipse(Math.round(h.x), Math.round(h.y), h.r * k, h.r * 0.6 * k, 0, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 1;
      // el caramelo cayendo
      const y = Math.round(h.y - (1 - k) * 60);
      g.fillStyle = '#eb2f2d'; g.fillRect(Math.round(h.x) - 2, y - 2, 4, 4);
      g.fillStyle = '#fff6d6'; g.fillRect(Math.round(h.x) - 1, y - 1, 1, 1);
    },
    onExpire(h, world) {
      const p = world.player;
      const dx = p.x - h.x, dy = (p.y - h.y) * 1.6;
      if (p.alive && dx * dx + dy * dy < h.r * h.r) world.damage.hurtPlayer(1, dx, dy, h.source);
      world.effects.burst(h.x, h.y - 2, 10, '#ff8fc0', 70, 0.35);
      world.hazards.spawn('syrup', h.x, h.y, h.r, 3, h.source);
    },
  },
  // Rayo de la tormenta: zigzag de aviso y descarga
  lightning: {
    render(g, h) {
      const k = 1 - h.life / h.max;
      const x = Math.round(h.x), y = Math.round(h.y);
      g.globalAlpha = 0.3 + 0.5 * k;
      g.fillStyle = '#ffe680';
      g.beginPath(); g.ellipse(x, y, h.r * k, h.r * 0.5 * k, 0, 0, Math.PI * 2); g.fill();
      if (h.life < 0.2) {
        g.globalAlpha = 1;
        for (let i = 0; i < 6; i++) g.fillRect(x + (i % 2 ? 2 : -2), y - 60 + i * 10, 2, 10);
      }
      g.globalAlpha = 1;
    },
    onExpire(h, world) {
      const p = world.player;
      const dx = p.x - h.x, dy = (p.y - h.y) * 1.6;
      if (p.alive && dx * dx + dy * dy < h.r * h.r) world.damage.hurtPlayer(1, dx, dy, h.source);
      world.effects.burst(h.x, h.y - 4, 14, '#ffe680', 110, 0.3);
      world.game.audio.play('wallHit', { pitch: 0.5 });
    },
  },
  // Mano de debajo de la cama: sombra en el suelo que agarra al terminar el aviso
  grab: {
    render(g, h) {
      const k = 1 - h.life / h.max;
      g.globalAlpha = 0.35 + k * 0.5;
      g.fillStyle = '#08060e';
      g.beginPath(); g.ellipse(Math.round(h.x), Math.round(h.y), h.r * (0.4 + k * 0.6), h.r * 0.5 * (0.4 + k * 0.6), 0, 0, Math.PI * 2); g.fill();
      g.globalAlpha = 1;
      if (h.life < 0.25) { g.fillStyle = '#ffd65c'; g.fillRect(Math.round(h.x) - 3, Math.round(h.y) - 1, 2, 1); g.fillRect(Math.round(h.x) + 2, Math.round(h.y) - 1, 2, 1); }
    },
    onExpire(h, world) {
      const p = world.player;
      const dx = p.x - h.x, dy = (p.y - h.y) * 1.6;
      if (p.alive && dx * dx + dy * dy < h.r * h.r) world.damage.hurtPlayer(1, dx, dy, h.source);
      world.effects.burst(h.x, h.y - 4, 10, '#28243e', 70, 0.4);
    },
  },
  // Cruz roja de corrección: aviso que explota al terminar
  mark: {
    render(g, h) {
      const k = 1 - h.life / h.max;
      const blink = h.life < 0.3 ? Math.floor(h.life * 30) % 2 : 1;
      if (!blink) return;
      const r = Math.round(h.r * (0.5 + k * 0.5));
      g.fillStyle = '#d6403a';
      for (let i = -r; i <= r; i++) {
        g.fillRect(Math.round(h.x) + i, Math.round(h.y) + Math.round(i * 0.6), 2, 2);
        g.fillRect(Math.round(h.x) + i, Math.round(h.y) - Math.round(i * 0.6), 2, 2);
      }
    },
    onExpire(h, world) {
      const p = world.player;
      const dx = p.x - h.x, dy = (p.y - h.y) * 1.6;
      if (p.alive && dx * dx + dy * dy < h.r * h.r) world.damage.hurtPlayer(1, dx, dy, h.source);
      world.effects.burst(h.x, h.y, 12, '#d6403a', 80, 0.4);
      world.hazards.spawn('redInk', h.x, h.y, h.r * 0.8, 2.2, h.source);
      world.game.audio.play('killEnemy', { pitch: 1.4, volume: 0.6 });
    },
  },
};

export class Hazards {
  constructor(world, capacity = 160) {
    this.world = world;
    this.pool = new Pool(() => ({ active: false, type: 'ink', x: 0, y: 0, r: 6, life: 0, max: 1, seed: 0, source: null }), capacity);
  }

  spawn(type, x, y, r, life, source = null) {
    let h = this.pool.spawn();
    if (!h) {
      // Pool lleno: reciclamos el charco más viejo en lugar de perder el nuevo
      h = this.pool.active.reduce((a, b) => (a.life < b.life ? a : b));
    }
    if (HAZARD_TYPES[type].ink) life *= this.world.mods.inkLife;
    h.type = type; h.x = x; h.y = y; h.r = r; h.life = life; h.max = life; h.seed = Math.random() * 10;
    h.source = source;
    return h;
  }

  update(dt) {
    const world = this.world, player = world.player;
    for (const h of this.pool.active) {
      if (!h.active) continue;
      const t = HAZARD_TYPES[h.type];
      h.life -= dt;
      if (h.life <= 0) { h.active = false; t.onExpire?.(h, world); continue; }
      t.onUpdate?.(h, world, dt);
      if (t.onPlayer && player.alive && !player.isDashing) {
        const dx = player.x - h.x, dy = (player.y - h.y) * 1.6; // elipse
        if (dx * dx + dy * dy < h.r * h.r) t.onPlayer(player, h, world);
      }
    }
    this.pool.sweep();
  }

  render(g) {
    for (const h of this.pool.active) {
      const t = HAZARD_TYPES[h.type];
      if (t.render) { t.render(g, h); continue; }
      const a = Math.min(1, h.life / 0.6, (h.max - h.life) / 0.1);
      const r = h.r * (0.7 + 0.3 * Math.min(1, (h.max - h.life) / 0.25));
      g.globalAlpha = a * 0.85;
      g.fillStyle = t.color;
      g.beginPath();
      g.ellipse(Math.round(h.x), Math.round(h.y), r, r * 0.6, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = t.edge;
      g.fillRect(Math.round(h.x - r * 0.4), Math.round(h.y - r * 0.3), 2, 1);
    }
    g.globalAlpha = 1;
  }

  clear() { this.pool.clear(); }

  /** Quita lo que hace daño (cruces, tinta roja) sin activar sus efectos de final. */
  clearDangerous() {
    for (const h of this.pool.active) if (h.type === 'mark' || h.type === 'redInk') h.active = false;
    this.pool.sweep();
  }
}
