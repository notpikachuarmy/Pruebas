// Registro central de contenido. Para añadir contenido: crea el archivo y añade su import aquí.
import assets from './assets.js';
import sfx from './audio/sfx.js';
import music from './audio/music.js';

import examen from './dreams/examen.js';
import tachon from './enemies/tachon.js';
import aulaPrueba from './rooms/aula_prueba.js';

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

export const CONTENT = {
  assets,
  audio: { sfx, music },
  dreams: byId([examen]),
  enemies: byId([tachon]),
  rooms: byId([aulaPrueba]),
};
