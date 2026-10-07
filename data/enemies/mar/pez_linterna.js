// Enemigo: Pez Linterna (su luz es un cebo)
import tachon from '../tachon.js';

export default {
  ...tachon,
  id: 'pez_linterna', name: 'Pez Linterna', dream: 'mar', role: 'perseguidor', tags: ['mar'],
  cost: 1.4, minDepth: 1,
  description: 'En la oscuridad solo ves su lucecita. Cuando estás cerca, se abalanza con la boca abierta.',
  theme: 'Lo que vive donde no llega el sol.',
  sprite: 'enemy_pez_linterna',
  light: 34,
  hp: 4, speed: 30,
  params: { ...tachon.params, wobble: 0.4, lungeRange: 75, windup: 0.5, lungeSpeed: 240, lungeTime: 0.35, inkType: null },
};
