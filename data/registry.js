// Registro central de contenido. Para añadir contenido: crea el archivo y añade su import aquí.
import assets from './assets.js';
import sfx from './audio/sfx.js';
import music from './audio/music.js';

import examen from './dreams/examen.js';

import tachon from './enemies/tachon.js';
import tachonRojo from './enemies/tachon_rojo.js';
import interrogante from './enemies/interrogante.js';
import goma from './enemies/goma.js';
import chuleta from './enemies/chuleta.js';
import compas from './enemies/compas.js';
import reloj from './enemies/reloj.js';
import copia from './enemies/copia.js';
import fotocopiadora from './bosses/fotocopiadora.js';
import profesora from './bosses/profesora.js';

import aulaInicio from './rooms/aula_inicio.js';
import aulaFilas from './rooms/aula_filas.js';
import aulaVacia from './rooms/aula_vacia.js';
import aulaCirculo from './rooms/aula_circulo.js';
import pasilloTaquillas from './rooms/pasillo_taquillas.js';
import aulaTrincheras from './rooms/aula_trincheras.js';
import despacho from './rooms/despacho.js';
import examenFinal from './rooms/examen_final.js';

import companeroSinGoma from './events/companero_sin_goma.js';
import pupitreGrabado from './events/pupitre_grabado.js';
import revisionExamen from './events/revision_examen.js';

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

export const CONTENT = {
  assets,
  audio: { sfx, music },
  dreams: byId([examen]),
  // Jefes y mini-jefes son enemigos con `boss: true` (comparten motor)
  enemies: byId([tachon, tachonRojo, interrogante, goma, chuleta, compas, reloj, copia, fotocopiadora, profesora]),
  rooms: byId([aulaInicio, aulaFilas, aulaVacia, aulaCirculo, pasilloTaquillas, aulaTrincheras, despacho, examenFinal]),
  events: byId([companeroSinGoma, pupitreGrabado, revisionExamen]),
};
