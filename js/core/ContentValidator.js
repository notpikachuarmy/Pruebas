import { BEHAVIORS } from '../enemies/behaviors/index.js';
import { ROOM_TYPES } from '../rooms/roomTypes/index.js';
import { ROOM_COLS, ROOM_ROWS } from './config.js';
import { RULES } from '../dreams/rules.js';
import { EVENT_EFFECTS } from '../world/EventEffects.js';
import { ITEM_EFFECTS } from '../items/ItemEffects.js';

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
    const types = d.floor?.arena ? new Set(['boss']) : new Set(['start', 'combat', 'boss', ...(d.floor?.specials ?? []).map((s) => s.type)]);
    if (d.floor?.challengeChance) types.add('challenge');
    if (d.floor?.secret) types.add('secret');
    if (d.floor?.miniboss) types.add('miniboss');
    for (const k of ['boss', 'miniboss']) if (d[k] && !c.enemies[d[k]]?.boss) out.push(`Sueño "${d.id}": ${k} "${d[k]}" no existe o no tiene boss: true`);
    for (const b of d.bosses ?? []) if (!c.enemies[b]?.boss) out.push(`Sueño "${d.id}": jefe "${b}" de "bosses" no existe o no tiene boss: true`);
    if (!d.boss && !d.bosses?.length) out.push(`Sueño "${d.id}": no tiene jefe (bosses)`);
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
  const STATS = ['maxHp', 'speed', 'damage', 'fireRate', 'shotSpeed', 'range', 'shotSize', 'knockback', 'dashSpeed', 'dashDuration', 'dashCooldown', 'dashCharges', 'hurtInvulnerability'];
  for (const it of Object.values(c.items ?? {})) {
    for (const k of ['id', 'name', 'rarity', 'pools', 'description']) if (it[k] === undefined) out.push(`Objeto "${it.id}": falta "${k}"`);
    if (!['común', 'rara', 'legendaria'].includes(it.rarity)) out.push(`Objeto "${it.id}": rareza "${it.rarity}" desconocida`);
    // El icono oficial es assets/items/<id>.png (16×16); `icon` (texto 8×8) es solo un respaldo opcional
    if (it.icon && (it.icon.length !== 8 || it.icon.some((row) => row.length !== 8))) out.push(`Objeto "${it.id}": el icono de texto debe ser de 8×8`);
    for (const e of it.effects ?? []) if (!ITEM_EFFECTS[e.effect]) out.push(`Objeto "${it.id}": efecto "${e.effect}" no existe`);
    for (const m of it.modifiers ?? []) if (!STATS.includes(m.stat)) out.push(`Objeto "${it.id}": estadística "${m.stat}" no existe`);
  }
  // Progresión
  const FRAG = /^(visit|miniboss|boss|secret|event:.+)$/;
  for (const d of Object.values(c.dreams)) {
    if (typeof d.tier !== 'number') out.push(`Sueño "${d.id}": falta "tier" (orden en la noche)`);
    for (const f of d.fragments ?? []) {
      if (!FRAG.test(f.unlock)) out.push(`Sueño "${d.id}": fragmento "${f.id}" con unlock "${f.unlock}" no válido`);
      if (f.unlock.startsWith('event:') && !c.events[f.unlock.slice(6)]) out.push(`Sueño "${d.id}": fragmento "${f.id}" usa un evento que no existe`);
    }
  }
  const rewards = { dream: new Set(), item: new Set() };
  for (const a of c.achievements ?? []) {
    if (a.reward?.dream) { rewards.dream.add(a.reward.dream); if (!c.dreams[a.reward.dream]) out.push(`Logro "${a.id}": sueño "${a.reward.dream}" no existe`); }
    if (a.reward?.item) { rewards.item.add(a.reward.item); if (!c.items[a.reward.item]) out.push(`Logro "${a.id}": objeto "${a.reward.item}" no existe`); }
    if (a.condition.type === 'bossDefeated' && !c.enemies[a.condition.boss]) out.push(`Logro "${a.id}": jefe "${a.condition.boss}" no existe`);
    if (['dreamBoss', 'allDreamBosses'].includes(a.condition.type) && !c.dreams[a.condition.dream]) out.push(`Logro "${a.id}": sueño "${a.condition.dream}" no existe`);
  }
  const fromEvents = new Set(Object.values(c.events).flatMap((e) => e.choices.filter((ch) => ch.effect === 'giveItem').map((ch) => ch.item)));
  for (const it of Object.values(c.items)) if (it.locked && !rewards.item.has(it.id) && !fromEvents.has(it.id)) out.push(`Objeto "${it.id}": está bloqueado pero nada lo desbloquea`);
  for (const d of Object.values(c.dreams)) if (d.locked && !rewards.dream.has(d.id)) out.push(`Sueño "${d.id}": está bloqueado pero ningún logro lo desbloquea`);

  for (const s of Object.values(c.synergies ?? {})) {
    for (const r of s.requires) if (!c.items[r]) out.push(`Sinergia "${s.id}": requiere "${r}", que no existe`);
  }
  for (const r of Object.values(c.rooms)) {
    const w = r.layout[0].length;
    r.layout.forEach((row, i) => { if (row.length !== w) out.push(`Sala "${r.id}": la fila ${i} mide ${row.length} (esperado ${w})`); });
    if (r.layout.length !== ROOM_ROWS || w !== ROOM_COLS) out.push(`Sala "${r.id}": mide ${w}×${r.layout.length}, debe medir ${ROOM_COLS}×${ROOM_ROWS}`);
    for (const [row, col] of r.noDoors ? [] : DOOR_CLEARANCE) {
      const ch = r.layout[row]?.[col];
      if (ch && ch !== '.' && ch !== 'P' && ch !== 'S') out.push(`Sala "${r.id}": la celda (${row},${col}) bloquea una puerta`);
    }
    if (!Array.isArray(r.types) || !r.types.length) out.push(`Sala "${r.id}": falta "types"`);
  }
  return out;
}
