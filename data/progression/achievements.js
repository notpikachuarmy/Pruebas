/**
 * Logros. `condition` es declarativa; la interpreta js/progression/AchievementSystem.js:
 *   { type: 'bossDefeated', boss }                  vencer a un jefe concreto
 *   { type: 'dreamBoss', dream }                     vencer al jefe (cualquiera) de un sueño
 *   { type: 'allDreamBosses', dream }                haber vencido a todos los jefes de un sueño, sumando todas las noches
 *   { type: 'noHitBoss' }                            vencer a un jefe sin recibir daño en su sala
 *   { type: 'nightComplete' }                        terminar una noche entera
 *   { type: 'event', event }                         que ocurra un evento del juego
 *   { type: 'stat', stat, gte }                      estadística permanente >= valor
 *   { type: 'runItems' | 'runSynergies', gte }       objetos / sinergias en una misma run
 *   { type: 'runCounter', counter, gte }             contador de la run (p. ej. lámparas)
 *   { type: 'overtimeClear' }                        limpiar una sala en tiempo extra
 *   { type: 'runMaxHp', gte }                        vida máxima (medios corazones) en una run
 * `reward` (opcional): { dream } o { item } que se desbloquea.
 */
export default [
  { id: 'aprobado', name: 'Aprobado', description: 'Vence al jefe de El Examen Infinito.',
    condition: { type: 'dreamBoss', dream: 'examen' }, reward: { dream: 'casa' } },
  { id: 'mesa_para_dos', name: 'Ya no estás sola', description: 'Vence al jefe de La Casa a Oscuras.',
    condition: { type: 'dreamBoss', dream: 'casa' }, reward: { item: 'foto_familia', dream: 'dulce' } },
  { id: 'diente_dulce', name: 'Diente dulce', description: 'Vence al jefe de El País de las Chuches.',
    condition: { type: 'dreamBoss', dream: 'dulce' }, reward: { item: 'caramelo_explosivo' } },
  { id: 'empacho', name: 'Empacho', description: 'Reúne 60 de Lucidez en una misma noche.',
    condition: { type: 'runCounter', counter: 'lucidityTotal', gte: 60 }, reward: { item: 'bolsa_chuches' } },
  { id: 'toda_la_bolsa', name: 'Toda la bolsa', description: 'Vence a los tres jefes de El País de las Chuches.',
    condition: { type: 'allDreamBosses', dream: 'dulce' } },
  { id: 'corazon_lleno', name: 'Corazón lleno', description: 'Llega a 6 corazones de vida máxima en una noche.',
    condition: { type: 'runMaxHp', gte: 12 }, reward: { item: 'anillo_rosa' } },
  { id: 'todo_el_temario', name: 'Todo el temario', description: 'Vence a los tres jefes de El Examen Infinito.',
    condition: { type: 'allDreamBosses', dream: 'examen' } },
  { id: 'luz_encendida', name: 'Con la luz encendida', description: 'Vence a los tres jefes de La Casa a Oscuras.',
    condition: { type: 'allDreamBosses', dream: 'casa' } },
  { id: 'primera_noche', name: 'Una noche entera', description: 'Calma todos los sueños de una noche.',
    condition: { type: 'nightComplete' }, reward: { item: 'energia_pesadilla' } },
  { id: 'sin_rasgunos', name: 'Sin un rasguño', description: 'Vence a un jefe sin recibir daño en su sala.',
    condition: { type: 'noHitBoss' }, reward: { item: 'cinta_casete' } },
  { id: 'pillado', name: 'Pillado copiando', description: 'Atrapa una Chuleta con las manos.',
    condition: { type: 'event', event: 'enemy:caught' } },
  { id: 'rincon', name: 'Rincón escondido', description: 'Encuentra una sala secreta.',
    condition: { type: 'event', event: 'secret:found' }, reward: { item: 'disco_rayado' } },
  { id: 'coleccionista', name: 'Bolsillos llenos', description: 'Lleva 6 objetos en una misma run.',
    condition: { type: 'runItems', gte: 6 } },
  { id: 'primera_sinergia', name: 'Armonía', description: 'Activa tu primera sinergia.',
    condition: { type: 'runSynergies', gte: 1 }, reward: { item: 'megafono' } },
  { id: 'afinado', name: 'Perfectamente afinado', description: 'Activa 3 sinergias en una misma run.',
    condition: { type: 'runSynergies', gte: 3 } },
  { id: 'cien', name: 'Ruido de fondo', description: 'Disipa 100 enemigos en total.',
    condition: { type: 'stat', stat: 'kills', gte: 100 }, reward: { item: 'guia_pesadillas' } },
  { id: 'cinco_minutos', name: 'Cinco minutos más', description: 'Sé expulsado de un sueño 5 veces.',
    condition: { type: 'stat', stat: 'deaths', gte: 5 }, reward: { item: 'despertador_repuesto' } },
  { id: 'tiempo_extra', name: 'Sobre la campana', description: 'Limpia una sala en tiempo extra.',
    condition: { type: 'overtimeClear' }, reward: { item: 'polvo_luminoso' } },
  { id: 'luz_en_casa', name: 'Luz en casa', description: 'Enciende 5 lámparas en una misma run.',
    condition: { type: 'runCounter', counter: 'lampsLit', gte: 5 }, reward: { item: 'linterna' } },
  { id: 'buen_cliente', name: 'Buen cliente', description: 'Gasta 40 de Lucidez en tiendas (en total).',
    condition: { type: 'stat', stat: 'shopSpent', gte: 40 } },
];
