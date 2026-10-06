// Carga de imágenes y hojas de sprites a partir de un manifiesto de datos.
// Si un archivo falta, el juego sigue funcionando con un placeholder generado.

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src; // ruta relativa al index.html → compatible con GitHub Pages
  });
}

/** Versión blanca de la imagen, para el destello al recibir daño. */
function makeFlash(img) {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, c.width, c.height);
  return c;
}

export class SpriteSheet {
  constructor(def, image) {
    this.def = def;
    this.image = image;
    this.flash = image ? makeFlash(image) : null;
    this.fw = def.frameWidth;
    this.fh = def.frameHeight;
    this.ax = def.anchor?.x ?? this.fw / 2;
    this.ay = def.anchor?.y ?? this.fh;
    this.cols = image ? Math.max(1, Math.floor(image.width / this.fw)) : 1;
  }

  frameAt(anim, time) {
    const a = this.def.animations[anim] ?? this.def.animations.idle;
    const i = Math.floor(time * a.fps) % a.frames.length;
    return a.frames[i];
  }

  /** Dibuja el frame con el ancla (normalmente los pies) en (x, y). */
  draw(g, anim, time, x, y, { flip = false, flash = false, alpha = 1, scale = 1 } = {}) {
    const dx = Math.round(x), dy = Math.round(y);
    if (!this.image) { this._placeholder(g, dx, dy, scale, flash); return; }
    const frame = this.frameAt(anim, time);
    const sx = (frame % this.cols) * this.fw;
    const sy = Math.floor(frame / this.cols) * this.fh;
    const src = flash ? this.flash : this.image;
    g.save();
    g.globalAlpha = alpha;
    g.translate(dx, dy);
    if (flip) g.scale(-1, 1);
    g.drawImage(src, sx, sy, this.fw, this.fh, -this.ax * scale, -this.ay * scale, this.fw * scale, this.fh * scale);
    g.restore();
  }

  _placeholder(g, x, y, scale, flash) {
    const p = this.def.placeholder ?? { color: '#ff00ff', w: 10, h: 14 };
    g.fillStyle = flash ? '#ffffff' : p.color;
    g.fillRect(x - (p.w * scale) / 2, y - p.h * scale, p.w * scale, p.h * scale);
  }
}

export class Assets {
  constructor() {
    this.images = new Map();
    this.sprites = new Map();
    this.missing = [];
  }

  async load(manifest) {
    const jobs = Object.entries(manifest.images).map(async ([key, src]) => {
      try { this.images.set(key, await loadImage(src)); }
      catch (err) { this.missing.push(src); console.warn('[Assets]', err.message); }
    });
    await Promise.all(jobs);
    for (const [key, def] of Object.entries(manifest.sprites)) {
      this.sprites.set(key, new SpriteSheet(def, this.images.get(def.image) ?? null));
    }
  }

  image(key) { return this.images.get(key) ?? null; }

  sprite(key) {
    let s = this.sprites.get(key);
    if (!s) {
      s = new SpriteSheet({ frameWidth: 16, frameHeight: 16, animations: { idle: { frames: [0], fps: 1 } } }, null);
      this.sprites.set(key, s);
    }
    return s;
  }
}
