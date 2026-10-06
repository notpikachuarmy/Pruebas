/**
 * Pool de objetos reutilizables (proyectiles, partículas, charcos...).
 * Nunca crea objetos durante el juego: todo se reserva al inicio.
 * Uso: const o = pool.spawn(); ...; o.active = false; pool.sweep();
 */
export class Pool {
  constructor(factory, size) {
    this.capacity = size;
    this.free = [];
    this.active = [];
    for (let i = 0; i < size; i++) { const o = factory(); o.active = false; this.free.push(o); }
  }

  /** Devuelve un objeto libre o null si el pool está lleno (se descarta el efecto). */
  spawn() {
    const o = this.free.pop();
    if (!o) return null;
    o.active = true;
    this.active.push(o);
    return o;
  }

  /** Mueve a la lista libre los objetos marcados como inactivos. */
  sweep() {
    const list = this.active;
    let w = 0;
    for (let r = 0; r < list.length; r++) {
      const o = list[r];
      if (o.active) list[w++] = o; else this.free.push(o);
    }
    list.length = w;
  }

  clear() {
    for (const o of this.active) { o.active = false; this.free.push(o); }
    this.active.length = 0;
  }

  get count() { return this.active.length; }
}
