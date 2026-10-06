import { TILE } from '../core/config.js';

/**
 * Oscuridad de los sueños con la regla "Penumbra": una capa negra con agujeros de luz
 * (jugador, lámparas encendidas, ondas del jugador y, tenue, los objetos con los que interactuar).
 */
export class Lighting {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.g = this.canvas.getContext('2d');
  }

  render(target, world) {
    const radius = world.mods.light * world.mods.lightMult * world.items.lightMult();
    if (!radius) return;
    const room = world.room, c = this.canvas, g = this.g;
    if (c.width !== room.width || c.height !== room.height) { c.width = room.width; c.height = room.height; }
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = 'rgba(6,4,14,0.9)';
    g.fillRect(0, 0, c.width, c.height);
    g.globalCompositeOperation = 'destination-out';

    const p = world.player;
    if (p.alive) this._hole(g, p.x, p.y - 8, radius);
    for (const o of world.interactables.list) {
      if (o.kind === 'lamp' && o.lit) this._hole(g, o.x, o.y - 18, 120);
      else this._hole(g, o.x, o.y - 8, 18, 0.6);   // pista: los objetos se intuyen
    }
    for (const pr of world.projectiles.pool.active) {
      // Las ondas iluminan; los proyectiles enemigos brillan lo justo para poder esquivarlos
      if (pr.team === 'player') this._hole(g, pr.x, pr.y - pr.z, 16, 0.8);
      else this._hole(g, pr.x, pr.y - pr.z, 10, 0.9);
    }
    for (const e of world.enemies.list) {
      // Siluetas tenues; los que llevan luz propia (la vela de la Mesa) iluminan de verdad
      if (e.def.light) this._hole(g, e.x, e.y - e.def.bodyHeight, e.def.light, 1);
      else this._hole(g, e.x, e.y - e.def.bodyHeight * 0.6, 13, 0.45);
    }
    for (const pk of world.pickups.pool.active) this._hole(g, pk.x, pk.y, 9, 0.5);
    // Las puertas siempre dejan pasar algo de luz para orientarse
    for (const dir of Object.keys(room.doors)) {
      const d = { N: [14, 0.5], S: [14, room.rows - 0.5], W: [0.5, 7.5], E: [room.cols - 0.5, 7.5] }[dir];
      this._hole(g, d[0] * TILE, d[1] * TILE, 26, 0.7);
    }
    g.globalCompositeOperation = 'source-over';
    target.drawImage(c, 0, 0);
  }

  _hole(g, x, y, r, strength = 1) {
    const grad = g.createRadialGradient(x, y, r * 0.35, x, y, r);
    grad.addColorStop(0, `rgba(0,0,0,${strength})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
}
