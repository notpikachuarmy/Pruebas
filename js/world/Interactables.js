import { PRODUCTS } from './Products.js';
import { promptText } from '../ui/prompt.js';
import { EventScene } from '../scenes/EventScene.js';
import { LibraryScene } from '../scenes/LibraryScene.js';
import { itemIcon, RARITY_COLOR } from '../items/ItemIcons.js';

const RADIUS = 15;

/**
 * Objetos de la sala con los que se interactúa (cofres, tienda, fuente, salida...).
 * Los datos de cada uno son objetos planos guardados en node.state.interactables,
 * así su estado (abierto, comprado) persiste al salir y volver a la sala.
 */
export const KINDS = {
  chest: {
    prompt: (o) => (o.opened ? null : 'Abrir el cajón'),
    interact(o, world) {
      o.opened = true;
      const { pickups, rngLoot, game, effects } = world;
      const [a, b] = o.lucidity ?? [4, 7];
      const n = rngLoot.int(a, b);
      for (let i = 0; i < n; i++) pickups.spawn('lucidity', o.x, o.y + 4);
      for (const item of o.extra ?? []) {
        if (rngLoot.chance(item.chance)) pickups.spawn(item.type, o.x, o.y + 4);
      }
      effects.burst(o.x, o.y - 6, 16, '#ffd65c', 70, 0.5);
      game.audio.play('cleared', { pitch: 1.3 });
      game.haptics.play('event');
    },
    render(g, o) {
      const x = Math.round(o.x), y = Math.round(o.y);
      g.fillStyle = 'rgba(20,14,40,0.3)'; g.fillRect(x - 11, y - 1, 22, 3);
      g.fillStyle = '#6b4428'; g.fillRect(x - 10, y - 12, 20, 12);
      g.fillStyle = '#a06e40'; g.fillRect(x - 10, y - 14, 20, 4);
      g.fillStyle = o.opened ? '#100c20' : '#8a5a34'; g.fillRect(x - 5, y - 8, 10, 5);
      g.fillStyle = '#ffd65c'; g.fillRect(x - 1, o.opened ? y - 3 : y - 6, 2, 1);
    },
  },

  item: {
    prompt: (o, world) => (o.taken ? null : `Coger: ${world.game.content.items[o.itemId].name}`),
    interact(o, world) { o.taken = true; world.takeItem(o.itemId); },
    render(g, o, world) {
      const x = Math.round(o.x), y = Math.round(o.y);
      // Pedestal: un atril de pupitre
      g.fillStyle = 'rgba(20,14,40,0.3)'; g.fillRect(x - 7, y - 1, 14, 3);
      g.fillStyle = '#6b4428'; g.fillRect(x - 6, y - 7, 12, 7);
      g.fillStyle = '#a06e40'; g.fillRect(x - 7, y - 8, 14, 2);
      if (o.taken) return;
      const it = world.game.content.items[o.itemId];
      const by = y - 26 + Math.round(Math.sin(world.time * 3) * 1.5);
      g.globalAlpha = 0.35; g.fillStyle = RARITY_COLOR[it.rarity];
      g.fillRect(x - 9, by - 2, 18, 20); g.globalAlpha = 1;
      g.drawImage(itemIcon(it), x - 8, by, 16, 16);
    },
  },

  shopItem: {
    prompt: (o, world) => {
      if (o.sold) return null;
      const p = PRODUCTS[o.product];
      const name = p.label ? p.label(world, o) : p.name;
      if (world.run.lucidity < o.price) return `${name}: te faltan ${o.price - world.run.lucidity} de Lucidez`;
      if (!p.canApply(world, o)) return `${name}: ahora no te sirve`;
      return `Comprar ${name.toLowerCase()} (${o.price})`;
    },
    available: (o, world) => world.run.lucidity >= o.price && PRODUCTS[o.product].canApply(world, o),
    interact(o, world) {
      const p = PRODUCTS[o.product];
      if (world.run.lucidity < o.price || !p.canApply(world, o)) { world.game.audio.play('menuBack'); return; }
      world.run.lucidity -= o.price;
      world.game.events.emit('shop:buy', { price: o.price, product: o.product });
      p.apply(world, o);
      o.sold = true;
      world.effects.burst(o.x, o.y - 8, 10, '#c9bde6', 50, 0.4);
      world.game.audio.play('heal');
    },
    render(g, o, world) {
      const x = Math.round(o.x), y = Math.round(o.y);
      g.fillStyle = '#4b3f75'; g.fillRect(x - 7, y - 4, 14, 5);
      g.fillStyle = '#6e62a0'; g.fillRect(x - 7, y - 5, 14, 2);
      if (!o.sold) PRODUCTS[o.product].render(g, x, y - 12 + Math.round(Math.sin(world.time * 3)), world.time, world, o);
    },
    renderUI(r, o, sx, sy) {
      if (!o.sold) r.text(String(o.price), sx, sy + 10, { size: 8, color: '#ffd65c', align: 'center' });
    },
  },

  fountain: {
    prompt: (o, world) => (o.used ? null : world.player.hp >= world.player.stats.get('maxHp') ? 'Ya estás bien' : 'Beber agua'),
    available: (o, world) => world.player.hp < world.player.stats.get('maxHp'),
    interact(o, world) {
      const p = world.player;
      if (p.hp >= p.stats.get('maxHp')) return;
      o.used = true;
      world.damage.healPlayer(p.stats.get('maxHp'));
      world.effects.burst(o.x, o.y - 10, 20, '#8fd3ff', 60, 0.6);
      world.game.audio.play('heal');
    },
    render(g, o, world) {
      const x = Math.round(o.x), y = Math.round(o.y);
      g.fillStyle = 'rgba(20,14,40,0.3)'; g.fillRect(x - 8, y - 1, 16, 3);
      g.fillStyle = '#9aa3b5'; g.fillRect(x - 7, y - 10, 14, 10);
      g.fillStyle = '#c6ccd8'; g.fillRect(x - 7, y - 11, 14, 2);
      g.fillStyle = '#5d6577'; g.fillRect(x - 1, y - 16, 2, 6);
      if (!o.used) {
        g.fillStyle = '#8fd3ff';
        const k = Math.floor(world.time * 8) % 3;
        g.fillRect(x + 1, y - 15 + k, 1, 1); g.fillRect(x + 2, y - 13 + k, 1, 2);
        g.fillRect(x - 5, y - 9, 10, 2);
      }
    },
  },

  event: {
    prompt: (o, world) => (o.done ? null : world.game.content.events[o.event].title),
    interact(o, world) { world.game.pushScene(new EventScene(world.game, world, o)); },
    render(g, o, world) {
      const x = Math.round(o.x), y = Math.round(o.y), def = world.game.content.events[o.event];
      g.fillStyle = 'rgba(20,14,40,0.3)'; g.fillRect(x - 9, y - 1, 18, 3);
      // Mesa común a todos los eventos
      g.fillStyle = '#6b4428'; g.fillRect(x - 8, y - 8, 16, 8);
      g.fillStyle = '#a06e40'; g.fillRect(x - 8, y - 10, 16, 3);
      if (def.prop === 'student') {
        g.fillStyle = '#2e3a6e'; g.fillRect(x - 4, y - 18, 8, 8);
        g.fillStyle = '#e1c4a4'; g.fillRect(x - 3, y - 24, 6, 6);
        g.fillStyle = '#4a3229'; g.fillRect(x - 3, y - 25, 6, 2);
      } else if (def.prop === 'phone') {
        g.fillStyle = '#b04034'; g.fillRect(x - 5, y - 15, 10, 5);
        g.fillStyle = Math.floor(world.time * 2) % 2 ? '#eb2f2d' : '#5a1a14'; g.fillRect(x + 2, y - 14, 2, 2);
      } else if (def.prop === 'radio') {
        g.fillStyle = '#3c4048'; g.fillRect(x - 6, y - 17, 12, 7);
        g.fillStyle = '#8fd3ff'; g.fillRect(x - 4, y - 15, 5, 3);
        g.fillStyle = Math.floor(world.time * 3) % 2 ? '#eb2f2d' : '#5a1a14'; g.fillRect(x + 3, y - 15, 2, 2);
        g.fillStyle = '#9aa3b5'; g.fillRect(x + 4, y - 23, 1, 6);
      } else if (def.prop === 'bottle') {
        g.fillStyle = '#5a9a6a'; g.fillRect(x - 2, y - 18, 5, 8); g.fillRect(x - 1, y - 21, 3, 3);
        g.fillStyle = '#f0ecd6'; g.fillRect(x - 1, y - 16, 3, 4);
      } else if (def.prop === 'stall') {
        g.fillStyle = '#ff6aa0'; g.fillRect(x - 8, y - 22, 16, 3);
        g.fillStyle = '#fff6d6'; g.fillRect(x - 8, y - 19, 4, 2); g.fillRect(x, y - 19, 4, 2);
        for (let i = 0; i < 3; i++) { g.fillStyle = ['#7fd6a0', '#ffd65c', '#8fd3ff'][i]; g.fillRect(x - 6 + i * 5, y - 14, 3, 4); }
      } else if (def.prop === 'house') {
        g.fillStyle = '#6e3e28'; g.fillRect(x - 6, y - 18, 12, 9);
        g.fillStyle = '#ffd6e2'; g.fillRect(x - 7, y - 21, 14, 3);
        g.fillStyle = '#ffd65c'; g.fillRect(x - 1, y - 14, 3, 5);
      } else if (def.prop === 'album') {
        g.fillStyle = '#4a749c'; g.fillRect(x - 6, y - 14, 12, 4);
        g.fillStyle = '#f0ecd6'; g.fillRect(x - 5, y - 15, 4, 3); g.fillRect(x + 1, y - 15, 4, 3);
      } else if (def.prop === 'stream') {
        // Arroyo: piedras y agua que corre
        g.fillStyle = '#3d6e8c'; g.fillRect(x - 8, y - 10, 16, 3);
        g.fillStyle = '#8fd3ff'; g.fillRect(x - 6 + (Math.floor(world.time * 6) % 4), y - 10, 3, 1);
        g.fillStyle = '#7a7a72'; g.fillRect(x - 7, y - 13, 4, 3); g.fillRect(x + 3, y - 12, 4, 2);
      } else if (def.prop === 'tracks') {
        // Huellas de botas y de perro en el barro
        g.fillStyle = '#3a2a1c';
        g.fillRect(x - 6, y - 10, 3, 2); g.fillRect(x - 1, y - 9, 3, 2); g.fillRect(x + 4, y - 10, 3, 2);
        g.fillStyle = '#5a4030'; g.fillRect(x - 4, y - 7, 1, 1); g.fillRect(x + 1, y - 7, 1, 1); g.fillRect(x + 5, y - 7, 1, 1);
      } else if (def.prop === 'papers') {
        g.fillStyle = '#f0ecd6'; g.fillRect(x - 6, y - 13, 9, 4); g.fillRect(x - 4, y - 15, 9, 3);
        g.fillStyle = '#d6403a'; g.fillRect(x - 2, y - 14, 3, 1);
      } else {
        g.fillStyle = '#4b2f1c'; g.fillRect(x - 3, y - 9, 6, 1); g.fillRect(x - 1, y - 10, 1, 3);
      }
      if (!o.done && Math.floor(world.time * 2) % 2) { g.fillStyle = '#ffd65c'; g.fillRect(x - 1, y - 32, 2, 4); g.fillRect(x - 1, y - 27, 2, 1); }
    },
  },

  // Estantería de la primera sala: abre la biblioteca (bestiario y guía)
  bookshelf: {
    prompt: () => 'Leer: bestiario y guía',
    interact(o, world) { world.game.pushScene(new LibraryScene(world.game, { overlay: true })); },
    render(g, o) {
      const x = Math.round(o.x), y = Math.round(o.y);
      g.fillStyle = 'rgba(20,14,40,0.3)'; g.fillRect(x - 13, y - 1, 26, 3);
      g.fillStyle = '#3a2a1c'; g.fillRect(x - 12, y - 26, 24, 26);
      g.fillStyle = '#6b4428'; g.fillRect(x - 11, y - 25, 22, 24);
      g.fillStyle = '#3a2a1c'; g.fillRect(x - 11, y - 13, 22, 2);
      const books = ['#eb2f2d', '#4a749c', '#ffd65c', '#7fd6a0', '#c9bde6', '#e896a0'];
      for (let i = 0; i < 6; i++) {
        g.fillStyle = books[i]; g.fillRect(x - 10 + i * 3, y - 23 + (i % 2), 2, 9 - (i % 2));
        g.fillStyle = books[5 - i]; g.fillRect(x - 10 + i * 3, y - 10 + (i % 3 === 0 ? 1 : 0), 2, 8);
      }
    },
  },

  // Lámpara de pie (regla Penumbra): ilumina la sala al encenderla
  lamp: {
    prompt: (o) => (o.lit ? null : 'Encender la lámpara'),
    interact(o, world) {
      o.lit = true;
      world.game.audio.play('pickup', { pitch: 0.6 });
      world.effects.burst(o.x, o.y - 18, 12, '#ffb347', 50, 0.5);
      world.game.events.emit('lamp:lit', { lamp: o });
    },
    render(g, o, world) {
      const x = Math.round(o.x), y = Math.round(o.y);
      g.fillStyle = 'rgba(20,14,40,0.3)'; g.fillRect(x - 5, y - 1, 10, 3);
      g.fillStyle = '#3a2a1c'; g.fillRect(x - 4, y - 2, 8, 2); g.fillRect(x - 1, y - 18, 2, 16);
      g.fillStyle = o.lit ? '#ffd38a' : '#8a7a62';
      g.fillRect(x - 6, y - 24, 12, 7);
      if (o.lit) { g.fillStyle = '#fff6d6'; g.fillRect(x - 2, y - 18, 4, 2); }
    },
  },

  exit: {
    prompt: (o, world) => world.run.dream.text.exitPrompt,
    interact(o, world) { world.onExit?.(); },
    render(g, o, world) {
      const t = world.time;
      const ring = Math.sin(t * 30) > 0 ? 1 : 0;
      const x = Math.round(o.x), y = Math.round(o.y);
      g.fillStyle = 'rgba(255,214,92,0.18)';
      const pr = 10 + Math.sin(t * 4) * 2;
      g.beginPath(); g.ellipse(x, y, pr, pr * 0.55, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#d6403a'; g.fillRect(x - 5 + ring, y - 14, 10, 9);
      g.fillStyle = '#fff6d6'; g.fillRect(x - 3 + ring, y - 12, 6, 5);
      g.fillStyle = '#17122b'; g.fillRect(x + ring, y - 11, 1, 3); g.fillRect(x + ring, y - 9, 2, 1);
      g.fillStyle = '#ffd65c'; g.fillRect(x - 6 + ring, y - 16, 3, 2); g.fillRect(x + 3 + ring, y - 16, 3, 2);
      g.fillStyle = '#17122b'; g.fillRect(x - 4, y - 5, 2, 2); g.fillRect(x + 2, y - 5, 2, 2);
    },
  },
};

export class Interactables {
  constructor(world) {
    this.world = world;
    this.list = [];
    this.focused = null;
  }

  /** Usa el array persistente del nodo (los cambios de estado se conservan). */
  bind(list) { this.list = list ?? []; this.focused = null; }

  add(obj) { this.list.push(obj); return obj; }

  update() {
    const { player, input } = this.world;
    this.focused = null;
    if (!player.alive) return;
    let best = RADIUS * RADIUS;
    for (const o of this.list) {
      const kind = KINDS[o.kind];
      if (!kind.prompt(o, this.world)) continue;
      const d2 = (o.x - player.x) ** 2 + (o.y - player.y) ** 2;
      if (d2 < best) { best = d2; this.focused = o; }
    }
    if (this.focused && input.isPressed('INTERACT')) KINDS[this.focused.kind].interact(this.focused, this.world);
  }

  collectDrawables(out) { for (const o of this.list) out.push(o); }

  draw(g, o) { KINDS[o.kind].render(g, o, this.world); }

  renderUI(r, ox, oy) {
    for (const o of this.list) KINDS[o.kind].renderUI?.(r, o, o.x + ox, o.y + oy);
    const f = this.focused;
    if (f) {
      const kind = KINDS[f.kind];
      const label = kind.prompt(f, this.world);
      const usable = kind.available?.(f, this.world) ?? true;
      r.text(usable ? promptText(this.world.game, 'INTERACT', label) : label, f.x + ox, f.y + oy - 22, { size: 8, color: usable ? '#fff6d6' : '#9b8fc7', align: 'center' });
    }
  }

  isInteractable(obj) { return obj && obj.kind && KINDS[obj.kind] !== undefined; }
}
