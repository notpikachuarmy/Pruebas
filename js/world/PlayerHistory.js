/** Historial circular del jugador (velocidad, apuntado, disparo) para las Copias. Sin crear objetos. */
export class PlayerHistory {
  constructor(size) {
    this.size = size;
    this.items = Array.from({ length: size }, () => ({ vx: 0, vy: 0, ax: 1, ay: 0, shot: false }));
    this.head = 0;
    this.count = 0;
  }

  record(p, time) {
    const it = this.items[this.head];
    it.vx = p.alive ? p.vx : 0; it.vy = p.alive ? p.vy : 0;
    it.ax = p.aimX; it.ay = p.aimY;
    it.shot = p.alive && Math.abs(p.lastShotTime - time) < 1e-6;
    this.head = (this.head + 1) % this.size;
    this.count = Math.min(this.size, this.count + 1);
  }

  /** Estado de hace `steps` pasos (null si aún no hay tanto historial). */
  get(steps) {
    if (steps >= this.count) return null;
    return this.items[(this.head - 1 - steps + this.size * 2) % this.size];
  }
}
