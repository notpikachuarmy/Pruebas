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

import item_salvavidas from './items/salvavidas.js';
import item_ancla from './items/ancla.js';
import item_brujula from './items/brujula.js';
import item_bombonaOxigeno from './items/bombona_oxigeno.js';
import item_caracola from './items/caracola.js';
import item_partitura from './items/partitura.js';
import item_bis from './items/bis.js';
import item_pua from './items/pua.js';
import item_batuta from './items/batuta.js';
import item_pedalDistorsion from './items/pedal_distorsion.js';
import item_viniloOro from './items/vinilo_oro.js';
import item_cascosRotos from './items/cascos_rotos.js';
import item_marcapasos from './items/marcapasos.js';
import item_saxofon from './items/saxofon.js';
import item_triangulo from './items/triangulo.js';
import item_gong from './items/gong.js';
import syn_marejada from './synergies/marejada.js';
import syn_faroPuerto from './synergies/faro_puerto.js';
import syn_buzo from './synergies/buzo.js';
import syn_soloGuitarra from './synergies/solo_guitarra.js';
import syn_acorde from './synergies/acorde.js';
import syn_feedback from './synergies/feedback.js';
import syn_granFinal from './synergies/gran_final.js';
import syn_discoPlatino from './synergies/disco_platino.js';
import syn_sordina from './synergies/sordina.js';
import syn_ritmoCardiaco from './synergies/ritmo_cardiaco.js';
import syn_orquesta from './synergies/orquesta.js';
import syn_bigBand from './synergies/big_band.js';
import syn_jamSession from './synergies/jam_session.js';
import syn_lastre from './synergies/lastre.js';
import syn_director from './synergies/director.js';
import syn_rosaVientos from './synergies/rosa_vientos.js';
import marMusic from './audio/mar_music.js';
import mar from './dreams/mar.js';
import medusa from './enemies/mar/medusa.js';
import medusaGigante from './enemies/mar/medusa_gigante.js';
import pezLinterna from './enemies/mar/pez_linterna.js';
import anguila from './enemies/mar/anguila.js';
import pecesillo from './enemies/mar/pecesillo.js';
import tentaculo from './enemies/mar/tentaculo.js';
import mina from './enemies/mar/mina.js';
import pulpo from './bosses/pulpo.js';
import tormenta from './bosses/tormenta.js';
import leviatan from './bosses/leviatan.js';
import barcoHundido from './bosses/barco_hundido.js';
import radioSos from './events/mar/radio_sos.js';
import botellaMensaje from './events/mar/botella_mensaje.js';
import mar_cubierta from './rooms/mar/cubierta.js';
import mar_arrecife from './rooms/mar/arrecife.js';
import mar_rocas from './rooms/mar/rocas.js';
import mar_pecio from './rooms/mar/pecio.js';
import mar_fosa from './rooms/mar/fosa.js';
import mar_corales from './rooms/mar/corales.js';
import mar_bodega from './rooms/mar/bodega.js';
import mar_marAbierto from './rooms/mar/mar_abierto.js';

import ragnarokMusic from './audio/ragnarok_music.js';
import ragnarok from './dreams/ragnarok.js';
import chispa from './enemies/ragnarok/chispa.js';
import brasa from './enemies/ragnarok/brasa.js';
import surtur from './bosses/surtur.js';
import ragnarokPlataforma from './rooms/ragnarok/plataforma.js';
import item_llamaMuspel from './items/llama_muspel.js';
import item_gjallarhorn from './items/gjallarhorn.js';
import syn_solMedianoche from './synergies/sol_medianoche.js';
import syn_finDelMundo from './synergies/fin_del_mundo.js';

import bosqueMusic from './audio/bosque_music.js';
import bosque from './dreams/bosque.js';
import b_lobo from './enemies/bosque/lobo.js';
import b_perro from './enemies/bosque/perro.js';
import b_cazador from './enemies/bosque/cazador.js';
import b_cepo from './enemies/bosque/cepo.js';
import b_pavesa from './enemies/bosque/pavesa.js';
import b_oso from './enemies/bosque/oso.js';
import b_aguila from './enemies/bosque/aguila.js';
import b_trampero from './bosses/trampero.js';
import b_elCazador from './bosses/el_cazador.js';
import b_elIncendio from './bosses/el_incendio.js';
import b_loboGris from './bosses/lobo_gris.js';
import ev_arroyo from './events/bosque/arroyo.js';
import ev_huellas from './events/bosque/huellas.js';
import room_claroInicio from './rooms/bosque/claro_inicio.js';
import room_espesura from './rooms/bosque/espesura.js';
import room_arroyo from './rooms/bosque/arroyo.js';
import room_zarzas from './rooms/bosque/zarzas.js';
import room_rocas from './rooms/bosque/rocas.js';
import room_campamento from './rooms/bosque/campamento.js';
import room_madriguera from './rooms/bosque/madriguera.js';
import room_granClaro from './rooms/bosque/gran_claro.js';
import item_asta from './items/asta.js';
import item_pezuna from './items/pezuna.js';
import item_musgo from './items/musgo.js';
import item_bellota from './items/bellota.js';
import item_pielLobo from './items/piel_lobo.js';
import item_ojoBuho from './items/ojo_buho.js';
import item_colmillo from './items/colmillo.js';
import item_trampaRota from './items/trampa_rota.js';
import item_luciernaga from './items/luciernaga.js';
import item_petirrojo from './items/petirrojo.js';
import item_cuernoCaza from './items/cuerno_caza.js';
import item_ceniza from './items/ceniza.js';
import item_rocio from './items/rocio.js';
import item_semilla from './items/semilla.js';
import item_panal from './items/panal.js';
import item_huida from './items/huida.js';
import item_instinto from './items/instinto.js';
import item_pina from './items/pina.js';
import item_trebol from './items/trebol.js';
import item_corazonSalvaje from './items/corazon_salvaje.js';
import syn_manada from './synergies/manada.js';
import syn_reyBosque from './synergies/rey_bosque.js';
import syn_dobleColmillo from './synergies/doble_colmillo.js';
import syn_incendioControlado from './synergies/incendio_controlado.js';
import syn_despensa from './synergies/despensa.js';
import syn_presaEsquiva from './synergies/presa_esquiva.js';
import syn_cazadorCazado from './synergies/cazador_cazado.js';
import syn_bosqueVivo from './synergies/bosque_vivo.js';
import syn_luzDeLuna from './synergies/luz_de_luna.js';
import syn_estampida from './synergies/estampida.js';

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

export const CONTENT = {
  assets,
  audio: { sfx, music: { ...music, ...casaMusic, ...dulceMusic, ...marMusic, ...ragnarokMusic, ...bosqueMusic } },
  dreams: byId([examen, casa, dulce, mar, ragnarok, bosque]),
  // Jefes y mini-jefes son enemigos con `boss: true` (comparten motor)
  enemies: byId([tachon, tachonRojo, interrogante, goma, chuleta, compas, reloj, copia, fotocopiadora, profesora,
    polilla, sombra, telefono, mecedora, polvo, polvoMini, armario, mesaPuesta,
    regla, borron, interroganteDoble, peluche, polillaGigante, relojGigante, companeroPerfecto, monstruoCama, vocesPasillo,
    gominola, gominolaMini, piruleta, algodon, osito, bombon, tarta, reyCaramelo, fuenteChocolate, pinata,
    medusa, medusaGigante, pezLinterna, anguila, pecesillo, tentaculo, mina, pulpo, tormenta, leviatan, barcoHundido,
    chispa, brasa, surtur,
    b_lobo, b_perro, b_cazador, b_cepo, b_pavesa, b_oso, b_aguila, b_trampero, b_elCazador, b_elIncendio, b_loboGris]),
  rooms: byId([aulaInicio, aulaFilas, aulaVacia, aulaCirculo, pasilloTaquillas, aulaTrincheras, despacho, examenFinal,
    casaRecibidor, casaSalon, casaComedor, casaPasillo, casaDormitorio, casaCocina, casaTrastero, casaComedorGrande,
    dulceEntrada, dulcePasteleria, dulceTabletas, dulceBosque, dulceGominolas, dulceFabrica, dulceTienda, dulceSalon,
    mar_cubierta, mar_arrecife, mar_rocas, mar_pecio, mar_fosa, mar_corales, mar_bodega, mar_marAbierto, ragnarokPlataforma,
    room_claroInicio, room_espesura, room_arroyo, room_zarzas, room_rocas, room_campamento, room_madriguera, room_granClaro]),
  events: byId([companeroSinGoma, pupitreGrabado, revisionExamen, llamadaPerdida, albumFotos, puestoChuches, casitaChocolate, radioSos, botellaMensaje, ev_arroyo, ev_huellas]),
  items: byId([
    item_eco, item_metronomo, item_cableEnredado, item_tippEx, item_chuletaArrugada, item_calculadora, item_boligrafoPapa, item_despertadorRepuesto, item_espejoRoto, item_altavoz, item_subwoofer, item_silbato, item_cancelacionRuido, item_discoRayado, item_diapason, item_cintaCasete, item_estuche, item_cafe, item_postIt, item_megafono,
    item_linterna, item_fotoFamilia, item_galletas, item_mantita, item_dobleBombo,
    item_anilloRosa, item_energiaPesadilla, item_guiaPesadillas, item_polvoLuminoso, item_carameloExplosivo, item_pompasChicle, item_bolsaChuches,
    item_salvavidas, item_ancla, item_brujula, item_bombonaOxigeno, item_caracola, item_partitura, item_bis, item_pua, item_batuta, item_pedalDistorsion, item_viniloOro, item_cascosRotos, item_marcapasos, item_saxofon, item_triangulo, item_gong, item_llamaMuspel, item_gjallarhorn,
    item_asta, item_pezuna, item_musgo, item_bellota, item_pielLobo, item_ojoBuho, item_colmillo, item_trampaRota, item_luciernaga, item_petirrojo, item_cuernoCaza, item_ceniza, item_rocio, item_semilla, item_panal, item_huida, item_instinto, item_pina, item_trebol, item_corazonSalvaje,
  ]),
  synergies: byId([
    syn_polirritmia, syn_acople, syn_caleidoscopio, syn_corrector, syn_zigzagDoble, syn_notaPerfecta, syn_bajoYBateria, syn_sintoniaFina, syn_silencioAbsoluto, syn_hogar, syn_faro,
    syn_marejada, syn_faroPuerto, syn_buzo, syn_soloGuitarra, syn_acorde, syn_feedback, syn_granFinal, syn_discoPlatino, syn_sordina, syn_ritmoCardiaco, syn_orquesta, syn_bigBand, syn_jamSession, syn_lastre, syn_director, syn_rosaVientos, syn_solMedianoche, syn_finDelMundo,
    syn_manada, syn_reyBosque, syn_dobleColmillo, syn_incendioControlado, syn_despensa, syn_presaEsquiva, syn_cazadorCazado, syn_bosqueVivo, syn_luzDeLuna, syn_estampida,
  ]),
  achievements,
};
