// Registro central de contenido. Para añadir contenido: crea el archivo y añade su import aquí.
import assets from './assets.js';
import sfx from './audio/sfx.js';
import music from './audio/music.js';

import examen from './dreams/examen.js';

import tachon from './enemies/tachon.js';

import aulaInicio from './rooms/aula_inicio.js';
import aulaFilas from './rooms/aula_filas.js';
import aulaVacia from './rooms/aula_vacia.js';
import aulaCirculo from './rooms/aula_circulo.js';
import pasilloTaquillas from './rooms/pasillo_taquillas.js';
import aulaTrincheras from './rooms/aula_trincheras.js';
import despacho from './rooms/despacho.js';
import examenFinal from './rooms/examen_final.js';

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

export const CONTENT = {
  assets,
  audio: { sfx, music },
  dreams: byId([examen]),
  enemies: byId([tachon]),
  rooms: byId([aulaInicio, aulaFilas, aulaVacia, aulaCirculo, pasilloTaquillas, aulaTrincheras, despacho, examenFinal]),
};
