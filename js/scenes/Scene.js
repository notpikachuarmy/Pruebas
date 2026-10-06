/** Escena base. `overlay = true` deja ver (congelada) la escena de debajo. */
export class Scene {
  constructor(game) { this.game = game; this.overlay = false; this.time = 0; }
  enter() {}
  exit() {}
  update(dt) { this.time += dt; }
  renderWorld(g) {}
  renderUI(r) {}
}

/** Aviso "[Esc] Cerrar" en la esquina, con el botón del dispositivo en uso. */
export function closeHint(r, game, label = 'Cerrar') {
  r.text(`[${game.input.glyph('UI_CANCEL')}] ${label}`, r.width - 10, 16, { size: 8, color: '#9b8fc7', align: 'right' });
}

/** ¿Se ha pedido cerrar? Volver/Cancelar ya lo hace el menú; Pausa también cierra. */
export function wantsClose(game) {
  return game.input.isPressed('PAUSE') || game.input.isPressed('MAP');
}

/** Oscurece lo que hay debajo (para pausas y diálogos). */
export function dim(r, alpha = 0.7) {
  const ctx = r.ui;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#0e0a1c';
  ctx.fillRect(0, 0, r.width, r.height);
  ctx.globalAlpha = 1;
}
