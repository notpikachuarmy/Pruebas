// Enemigo: Tachón (sueño: El Examen Infinito)
export default {
  id: 'tachon',
  name: 'Tachón',
  dream: 'examen',
  role: 'perseguidor',
  description:
    'Un error tachado con tanta rabia que cobró vida. Avanza a trompicones, se encoge antes de ' +
    'abalanzarse y deja manchas de tinta que pegan los pies al suelo.',
  theme: 'Los fallos que Íñigo no puede borrar: no persiguen con lógica, persiguen con nervios.',

  sprite: 'enemy_tachon',
  radius: 5,          // caja de pies (colisión con paredes)
  bodyRadius: 6,      // zona de impacto
  bodyHeight: 6,      // altura del centro del cuerpo sobre los pies
  hp: 4,
  speed: 38,
  contactDamage: 1,   // en medios corazones
  mass: 0.8,          // menos masa = más retroceso al recibir impactos (su debilidad)

  behavior: 'scribbleChaser',
  params: {
    wobble: 1.1,       // cuánto zigzaguea al perseguir (radianes)
    wobbleSpeed: 7,
    lungeRange: 60,    // distancia a la que prepara la embestida
    windup: 0.45,      // aviso visible antes de embestir (justo para el jugador)
    lungeSpeed: 190,
    lungeTime: 0.34,
    recover: 0.7,
    inkEvery: 0.04,    // deja un charco de tinta cada X segundos mientras embiste
    inkLife: 3.2,
    inkRadius: 7,
  },

  drops: [
    { type: 'lucidity', chance: 0.65, amount: [1, 2] },
    { type: 'heart', chance: 0.07 },
  ],
};
