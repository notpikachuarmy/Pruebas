import { Game } from './core/Game.js';
import { TitleScene } from './scenes/TitleScene.js';
import { validateContent } from './core/ContentValidator.js';

const canvas = document.getElementById('screen');

function showFatal(err) {
  console.error(err);
  const box = document.getElementById('boot-message');
  box.hidden = false;
  box.innerHTML = `<h1>No se pudo iniciar Sueños</h1><p>${String(err?.message ?? err)}</p><p>Abre la consola del navegador (F12) para ver más detalles.</p>`;
}

try {
  const game = new Game(canvas);
  const problems = validateContent(game.content);
  if (problems.length) console.warn('[Contenido] Revisar:\n- ' + problems.join('\n- '));
  if (game.debug) window.SUENOS = game; // acceso desde la consola con ?debug
  game.boot().then(() => game.start(new TitleScene(game))).catch(showFatal);
} catch (err) {
  showFatal(err);
}
