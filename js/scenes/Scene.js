/** Escena base. `overlay = true` deja ver (congelada) la escena de debajo. */
export class Scene {
  constructor(game) { this.game = game; this.overlay = false; this.time = 0; }
  enter() {}
  exit() {}
  update(dt) { this.time += dt; }
  renderWorld(g) {}
  renderUI(r) {}
}

/** Oscurece lo que hay debajo (para pausas y diálogos). */
export function dim(r, alpha = 0.7) {
  const ctx = r.ui;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#0e0a1c';
  ctx.fillRect(0, 0, r.width, r.height);
  ctx.globalAlpha = 1;
}
