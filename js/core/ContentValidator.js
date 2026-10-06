import { BEHAVIORS } from '../enemies/behaviors/index.js';

/**
 * Comprueba referencias entre datos al arrancar (ids que no existen, sprites sin definir...).
 * No detiene el juego: avisa en consola para detectar errores al añadir contenido.
 */
export function validateContent(c) {
  const out = [];
  const sprites = c.assets.sprites;
  for (const e of Object.values(c.enemies)) {
    for (const k of ['id', 'name', 'hp', 'speed', 'radius', 'bodyRadius', 'bodyHeight', 'behavior', 'sprite']) {
      if (e[k] === undefined) out.push(`Enemigo "${e.id}": falta "${k}"`);
    }
    if (!BEHAVIORS[e.behavior]) out.push(`Enemigo "${e.id}": comportamiento "${e.behavior}" no registrado`);
    if (!sprites[e.sprite]) out.push(`Enemigo "${e.id}": sprite "${e.sprite}" no está en data/assets.js`);
  }
  for (const d of Object.values(c.dreams)) {
    if (!c.assets.tilesets[d.tileset]) out.push(`Sueño "${d.id}": tileset "${d.tileset}" no existe`);
    for (const p of d.enemyPool) if (!c.enemies[p.id]) out.push(`Sueño "${d.id}": enemyPool usa "${p.id}", que no existe`);
    for (const r of d.roomPool) if (!c.rooms[r]) out.push(`Sueño "${d.id}": roomPool usa "${r}", que no existe`);
    for (const [encId, enc] of Object.entries(d.encounters ?? {})) {
      enc.waves.forEach((w, i) => w.forEach((g) => {
        if (!c.enemies[g.id]) out.push(`Sueño "${d.id}", encuentro "${encId}", oleada ${i + 1}: "${g.id}" no existe`);
      }));
    }
    for (const m of Object.values(d.music ?? {})) if (!c.audio.music[m]) out.push(`Sueño "${d.id}": música "${m}" no definida`);
  }
  for (const r of Object.values(c.rooms)) {
    const w = r.layout[0].length;
    r.layout.forEach((row, i) => { if (row.length !== w) out.push(`Sala "${r.id}": la fila ${i} mide ${row.length} (esperado ${w})`); });
    if (!r.layout.some((row) => row.includes('P'))) out.push(`Sala "${r.id}": no tiene punto de aparición 'P'`);
  }
  return out;
}
