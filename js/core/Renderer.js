import { UI_FONT } from './config.js';

/**
 * Dos capas:
 *  - world: búfer de baja resolución (pixel art), escalado con vecino más cercano.
 *  - ui:    el canvas real, con una transformación que permite usar coordenadas
 *           virtuales pero dibujar texto nítido a resolución completa.
 */
export class Renderer {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.ui = canvas.getContext('2d');
    this.width = width;
    this.height = height;

    this.buffer = document.createElement('canvas');
    this.buffer.width = width;
    this.buffer.height = height;
    this.world = this.buffer.getContext('2d');
    this.world.imageSmoothingEnabled = false;

    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.background = '#0e0a1c';

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const cw = Math.floor(window.innerWidth * dpr);
    const ch = Math.floor(window.innerHeight * dpr);
    this.canvas.width = cw;
    this.canvas.height = ch;
    const fit = Math.min(cw / this.width, ch / this.height);
    // Escala entera si cabe (píxeles perfectos); si la ventana es muy pequeña, escala libre.
    this.scale = fit >= 1 ? Math.floor(fit) : fit;
    this.offsetX = Math.floor((cw - this.width * this.scale) / 2);
    this.offsetY = Math.floor((ch - this.height * this.scale) / 2);
  }

  beginFrame() {
    this.world.setTransform(1, 0, 0, 1, 0, 0);
    this.world.globalAlpha = 1;
    this.world.fillStyle = this.background;
    this.world.fillRect(0, 0, this.width, this.height);
  }

  /** Copia el mundo escalado y prepara la capa UI en coordenadas virtuales. */
  present() {
    const ctx = this.ui;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#0a0716';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.buffer, this.offsetX, this.offsetY, this.width * this.scale, this.height * this.scale);
    ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
    ctx.globalAlpha = 1;
  }

  /** Texto nítido en la capa UI. Tamaño en píxeles virtuales. */
  text(str, x, y, { size = 10, color = '#e8e6dc', align = 'left', baseline = 'alphabetic', weight = 400, shadow = '#0a0716', alpha = 1 } = {}) {
    const ctx = this.ui;
    ctx.font = `${weight} ${size}px ${UI_FONT}`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.globalAlpha = alpha;
    if (shadow) {
      ctx.fillStyle = shadow;
      ctx.fillText(str, x + 1, y + 1);
    }
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
    ctx.globalAlpha = 1;
  }

  measure(str, size = 10, weight = 400) {
    this.ui.font = `${weight} ${size}px ${UI_FONT}`;
    return this.ui.measureText(str).width;
  }
}
