import { Pool } from '../core/Pool.js';

function makeParticle() {
  return { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, size: 1, color: '#fff', drag: 4, gravity: 0, kind: 0 };
}

/** Partículas, estelas y números flotantes. Todo con pools: cero objetos nuevos por frame. */
export class Effects {
  constructor(world, capacity = 700) {
    this.world = world;
    this.pool = new Pool(makeParticle, capacity);
    this.ghosts = new Pool(() => ({ active: false, x: 0, y: 0, flip: false, frame: 'idle', t: 0, life: 0, max: 1 }), 24);
  }

  particle(x, y, vx, vy, life, color, size = 1, drag = 4, gravity = 0) {
    const p = this.pool.spawn();
    if (!p) return;
    p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.life = life; p.max = life;
    p.color = color; p.size = size; p.drag = drag; p.gravity = gravity; p.kind = 0;
  }

  /** Explosión radial de partículas. */
  burst(x, y, count, color, speed = 60, life = 0.4, size = 1) {
    const rng = Math.random;
    for (let i = 0; i < count; i++) {
      const a = rng() * Math.PI * 2, s = speed * (0.4 + rng() * 0.8);
      this.particle(x, y, Math.cos(a) * s, Math.sin(a) * s, life * (0.6 + rng() * 0.6), color, size);
    }
  }

  /** Copia translúcida del jugador (estela del Silencio). */
  afterimage(x, y, flip, anim, t) {
    const g = this.ghosts.spawn();
    if (!g) return;
    g.x = x; g.y = y; g.flip = flip; g.frame = anim; g.t = t; g.life = 0.22; g.max = 0.22;
  }

  update(dt) {
    for (const p of this.pool.active) {
      p.life -= dt;
      if (p.life <= 0) { p.active = false; continue; }
      const d = 1 - Math.min(1, p.drag * dt);
      p.vx *= d; p.vy = p.vy * d + p.gravity * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
    this.pool.sweep();
    for (const g of this.ghosts.active) { g.life -= dt; if (g.life <= 0) g.active = false; }
    this.ghosts.sweep();
  }

  renderGhosts(g, sprite) {
    for (const gh of this.ghosts.active) {
      sprite.draw(g, gh.frame, gh.t, gh.x, gh.y, { flip: gh.flip, flash: true, alpha: (gh.life / gh.max) * 0.45 });
    }
  }

  render(g) {
    for (const p of this.pool.active) {
      g.globalAlpha = Math.min(1, (p.life / p.max) * 1.5);
      g.fillStyle = p.color;
      g.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    g.globalAlpha = 1;
  }

  clear() { this.pool.clear(); this.ghosts.clear(); }
}
