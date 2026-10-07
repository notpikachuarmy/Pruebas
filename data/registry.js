// Registro central de contenido. Para añadir contenido: crea el archivo y añade su import aquí.
import assets from './assets.js';
import sfx from './audio/sfx.js';
import music from './audio/music.js';
import casaMusic from './audio/casa_music.js';
import dulceMusic from './audio/dulce_music.js';
import achievements from './progression/achievements.js';

import examen from './dreams/examen.js';
import casa from './dreams/casa.js';
import dulce from './dreams/dulce.js';

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
import polilla from './enemies/casa/polilla.js';
import sombra from './enemies/casa/sombra.js';
import telefono from './enemies/casa/telefono.js';
import mecedora from './enemies/casa/mecedora.js';
import polvo from './enemies/casa/polvo.js';
import polvoMini from './enemies/casa/polvo_mini.js';
import armario from './bosses/armario.js';
import mesaPuesta from './bosses/mesa_puesta.js';
import regla from './enemies/regla.js';
import borron from './enemies/borron.js';
import interroganteDoble from './enemies/interrogante_doble.js';
import peluche from './enemies/casa/peluche.js';
import polillaGigante from './enemies/casa/polilla_gigante.js';
import relojGigante from './bosses/reloj_gigante.js';
import companeroPerfecto from './bosses/companero_perfecto.js';
import monstruoCama from './bosses/monstruo_cama.js';
import vocesPasillo from './bosses/voces_pasillo.js';
import item_dobleBombo from './items/doble_bombo.js';
import item_anilloRosa from './items/anillo_rosa.js';
import item_energiaPesadilla from './items/energia_pesadilla.js';
import item_guiaPesadillas from './items/guia_pesadillas.js';
import item_polvoLuminoso from './items/polvo_luminoso.js';
import item_carameloExplosivo from './items/caramelo_explosivo.js';
import item_pompasChicle from './items/pompas_chicle.js';
import item_bolsaChuches from './items/bolsa_chuches.js';
import syn_faro from './synergies/faro.js';
import gominola from './enemies/dulce/gominola.js';
import gominolaMini from './enemies/dulce/gominola_mini.js';
import piruleta from './enemies/dulce/piruleta.js';
import algodon from './enemies/dulce/algodon.js';
import osito from './enemies/dulce/osito.js';
import bombon from './enemies/dulce/bombon.js';
import tarta from './bosses/tarta.js';
import reyCaramelo from './bosses/rey_caramelo.js';
import fuenteChocolate from './bosses/fuente_chocolate.js';
import pinata from './bosses/pinata.js';
import puestoChuches from './events/dulce/puesto_chuches.js';
import casitaChocolate from './events/dulce/casita_chocolate.js';
import dulceEntrada from './rooms/dulce/entrada.js';
import dulcePasteleria from './rooms/dulce/pasteleria.js';
import dulceTabletas from './rooms/dulce/tabletas.js';
import dulceBosque from './rooms/dulce/bosque_piruletas.js';
import dulceGominolas from './rooms/dulce/gominolas.js';
import dulceFabrica from './rooms/dulce/fabrica.js';
import dulceTienda from './rooms/dulce/tienda_chuches.js';
import dulceSalon from './rooms/dulce/salon_trono.js';

import aulaInicio from './rooms/aula_inicio.js';
import aulaFilas from './rooms/aula_filas.js';
import aulaVacia from './rooms/aula_vacia.js';
import aulaCirculo from './rooms/aula_circulo.js';
import pasilloTaquillas from './rooms/pasillo_taquillas.js';
import aulaTrincheras from './rooms/aula_trincheras.js';
import despacho from './rooms/despacho.js';
import examenFinal from './rooms/examen_final.js';
import casaRecibidor from './rooms/casa/recibidor.js';
import casaSalon from './rooms/casa/salon.js';
import casaComedor from './rooms/casa/comedor.js';
import casaPasillo from './rooms/casa/pasillo_largo.js';
import casaDormitorio from './rooms/casa/dormitorio.js';
import casaCocina from './rooms/casa/cocina.js';
import casaTrastero from './rooms/casa/trastero.js';
import casaComedorGrande from './rooms/casa/comedor_grande.js';

import companeroSinGoma from './events/companero_sin_goma.js';
import pupitreGrabado from './events/pupitre_grabado.js';
import revisionExamen from './events/revision_examen.js';
import llamadaPerdida from './events/casa/llamada_perdida.js';
import albumFotos from './events/casa/album_fotos.js';
import item_linterna from './items/linterna.js';
import item_fotoFamilia from './items/foto_familia.js';
import item_galletas from './items/galletas.js';
import item_mantita from './items/mantita.js';
import syn_hogar from './synergies/hogar.js';

import item_eco from './items/eco.js';
import item_metronomo from './items/metronomo.js';
import item_cableEnredado from './items/cable_enredado.js';
import item_tippEx from './items/tipp_ex.js';
import item_chuletaArrugada from './items/chuleta_arrugada.js';
import item_calculadora from './items/calculadora.js';
import item_boligrafoPapa from './items/boligrafo_papa.js';
import item_despertadorRepuesto from './items/despertador_repuesto.js';
import item_espejoRoto from './items/espejo_roto.js';
import item_altavoz from './items/altavoz.js';
import item_subwoofer from './items/subwoofer.js';
import item_silbato from './items/silbato.js';
import item_cancelacionRuido from './items/cancelacion_ruido.js';
import item_discoRayado from './items/disco_rayado.js';
import item_diapason from './items/diapason.js';
import item_cintaCasete from './items/cinta_casete.js';
import item_estuche from './items/estuche.js';
import item_cafe from './items/cafe.js';
import item_postIt from './items/post_it.js';
import item_megafono from './items/megafono.js';

import syn_polirritmia from './synergies/polirritmia.js';
import syn_acople from './synergies/acople.js';
import syn_caleidoscopio from './synergies/caleidoscopio.js';
import syn_corrector from './synergies/corrector.js';
import syn_zigzagDoble from './synergies/zigzag_doble.js';
import syn_notaPerfecta from './synergies/nota_perfecta.js';
import syn_bajoYBateria from './synergies/bajo_y_bateria.js';
import syn_sintoniaFina from './synergies/sintonia_fina.js';
import syn_silencioAbsoluto from './synergies/silencio_absoluto.js';

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

export const CONTENT = {
  assets,
  audio: { sfx, music: { ...music, ...casaMusic, ...dulceMusic } },
  dreams: byId([examen, casa, dulce]),
  // Jefes y mini-jefes son enemigos con `boss: true` (comparten motor)
  enemies: byId([tachon, tachonRojo, interrogante, goma, chuleta, compas, reloj, copia, fotocopiadora, profesora,
    polilla, sombra, telefono, mecedora, polvo, polvoMini, armario, mesaPuesta,
    regla, borron, interroganteDoble, peluche, polillaGigante, relojGigante, companeroPerfecto, monstruoCama, vocesPasillo,
    gominola, gominolaMini, piruleta, algodon, osito, bombon, tarta, reyCaramelo, fuenteChocolate, pinata]),
  rooms: byId([aulaInicio, aulaFilas, aulaVacia, aulaCirculo, pasilloTaquillas, aulaTrincheras, despacho, examenFinal,
    casaRecibidor, casaSalon, casaComedor, casaPasillo, casaDormitorio, casaCocina, casaTrastero, casaComedorGrande,
    dulceEntrada, dulcePasteleria, dulceTabletas, dulceBosque, dulceGominolas, dulceFabrica, dulceTienda, dulceSalon]),
  events: byId([companeroSinGoma, pupitreGrabado, revisionExamen, llamadaPerdida, albumFotos, puestoChuches, casitaChocolate]),
  items: byId([
    item_eco, item_metronomo, item_cableEnredado, item_tippEx, item_chuletaArrugada, item_calculadora, item_boligrafoPapa, item_despertadorRepuesto, item_espejoRoto, item_altavoz, item_subwoofer, item_silbato, item_cancelacionRuido, item_discoRayado, item_diapason, item_cintaCasete, item_estuche, item_cafe, item_postIt, item_megafono,
    item_linterna, item_fotoFamilia, item_galletas, item_mantita, item_dobleBombo,
    item_anilloRosa, item_energiaPesadilla, item_guiaPesadillas, item_polvoLuminoso, item_carameloExplosivo, item_pompasChicle, item_bolsaChuches,
  ]),
  synergies: byId([
    syn_polirritmia, syn_acople, syn_caleidoscopio, syn_corrector, syn_zigzagDoble, syn_notaPerfecta, syn_bajoYBateria, syn_sintoniaFina, syn_silencioAbsoluto, syn_hogar, syn_faro,
  ]),
  achievements,
};
