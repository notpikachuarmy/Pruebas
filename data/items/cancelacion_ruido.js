// Objeto: Cancelación de Ruido
export default {
  id: 'cancelacion_ruido',
  name: 'Cancelación de Ruido',
  rarity: 'rara',          // común | rara | legendaria
  pools: ['general'],
  tags: ['silencio'],
  description: 'El Silencio recarga antes y borra los proyectiles enemigos que tienes cerca.',
  modifiers: [{ stat: 'dashCooldown', mult: 0.8 }],
  effects: [{ effect: 'dashErase', radius: 40 }],
  icon: [
    '..kkkk..',
    '.k....k.',
    'k......k',
    'kd....dk',
    'kdd..ddk',
    'kdd..ddk',
    '.k....k.',
    '........',
  ],
};
