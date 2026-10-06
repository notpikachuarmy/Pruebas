import { BEHAVIORS } from '../enemies/behaviors/index.js';
import { ROOM_TYPES } from '../rooms/roomTypes/index.js';
import { ROOM_COLS, ROOM_ROWS } from './config.js';
import { RULES } from '../dreams/rules.js';
import { EVENT_EFFECTS } from '../world/EventEffects.js';

// Celdas que deben quedar libres delante de cada puerta (fila, columna)
const DOOR_CLEARANCE = [];
for (const r of [1, 2, 12, 13]) for (let c = 12; c <= 15; c++) DOOR_CLEARANCE.push([r, c]);
for (let r = 5; r <= 9; r++) for (const c of [1, 2, 25, 26]) DOOR_CLEARANCE.push([r, c]);

/**
 * Comprueba referencias entre datos al arrancar (ids que no existen, sprites sin definir...).
 * No detiene el juego: avisa en consola para detectar errores al añadir contenido.
 */
export function validateContent(c) {
  const out = [];
  const sprites = c.assets.sprites;
  for (const e of Object.values(c.enemies)) {
    for (const k of ['id', 'name', 'cost', 'role', 'hp', 'speed', 'radius', 'bodyRadius', 'bodyHeight', 'behavior', 'sprite']) {
      if (e[k] === undefined) out.push(`Enemigo "${e.id}": falta "${k}"`);
    }
    if (!BEHAVIORS[e.behavior]) out.push(`Enemigo "${e.id}": comportamiento "${e.behavior}" no registrado`);
    if (!sprites[e.sprite]) out.push(`Enemigo "${e.id}": sprite "${e.sprite}" no está en data/assets.js`);
  }
  for (const d of Object.values(c.dreams)) {
    if (!c.assets.tilesets[d.tileset]) out.push(`Sueño "${d.id}": tileset "${d.tileset}" no existe`);
    for (const p of d.enemyPool) if (!c.enemies[p.id]) out.push(`Sueño "${d.id}": enemyPool usa "${p.id}", que no existe`);
    for (const r of d.roomPool) if (!c.rooms[r]) out.push(`Sueño "${d.id}": roomPool usa "${r}", que no existe`);
    const types = new Set(['start', 'combat', 'boss', ...(d.floor?.specials ?? []).map((s) => s.type)]);
    if (d.floor?.challengeChance) types.add('challenge');
    if (d.floor?.secret) types.add('secret');
    if (d.floor?.miniboss) types.add('miniboss');
    for (const k of ['boss', 'miniboss']) if (d[k] && !c.enemies[d[k]]?.boss) out.push(`Sueño "${d.id}": ${k} "${d[k]}" no existe o no tiene boss: true`);
    for (const r of d.rules ?? []) if (!RULES[r]) out.push(`Sueño "${d.id}": regla "${r}" no existe en js/dreams/rules.js`);
    for (const ev of d.eventPool ?? []) if (!c.events?.[ev]) out.push(`Sueño "${d.id}": evento "${ev}" no está registrado`);
    for (const t of types) {
      if (!ROOM_TYPES[t]) out.push(`Sueño "${d.id}": tipo de sala "${t}" no existe en roomTypes`);
      if (!d.roomPool.some((id) => c.rooms[id]?.types.includes(t))) out.push(`Sueño "${d.id}": ninguna plantilla admite el tipo "${t}"`);
    }
    for (const it of d.shop ?? []) if (!it.price) out.push(`Sueño "${d.id}": producto de tienda sin precio`);
    for (const [encId, enc] of Object.entries(d.encounters ?? {})) {
      enc.waves.forEach((w, i) => w.forEach((g) => {
        if (!c.enemies[g.id]) out.push(`Sueño "${d.id}", encuentro "${encId}", oleada ${i + 1}: "${g.id}" no existe`);
      }));
    }
    for (const m of Object.values(d.music ?? {})) if (!c.audio.music[m]) out.push(`Sueño "${d.id}": música "${m}" no definida`);
  }
  for (const ev of Object.values(c.events ?? {})) {
    for (const ch of ev.choices) if (ch.effect && !EVENT_EFFECTS[ch.effect]) out.push(`Evento "${ev.id}": efecto "${ch.effect}" no existe`);
  }
  for (const r of Object.values(c.rooms)) {
    const w = r.layout[0].length;
    r.layout.forEach((row, i) => { if (row.length !== w) out.push(`Sala "${r.id}": la fila ${i} mide ${row.length} (esperado ${w})`); });
    if (r.layout.length !== ROOM_ROWS || w !== ROOM_COLS) out.push(`Sala "${r.id}": mide ${w}×${r.layout.length}, debe medir ${ROOM_COLS}×${ROOM_ROWS}`);
    for (const [row, col] of DOOR_CLEARANCE) {
      const ch = r.layout[row]?.[col];
      if (ch && ch !== '.' && ch !== 'P' && ch !== 'S') out.push(`Sala "${r.id}": la celda (${row},${col}) bloquea una puerta`);
    }
    if (!Array.isArray(r.types) || !r.types.length) out.push(`Sala "${r.id}": falta "types"`);
  }
  return out;
}
