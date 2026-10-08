// La plataforma del fin del mundo. V lava (no se pisa, los proyectiles pasan) · T pilar · L roca
export default {
  id: 'ragnarok_plataforma',
  name: 'La última plataforma',
  dream: 'ragnarok',
  types: ['boss'],
  noDoors: true,       // sala única: no necesita huecos para puertas
  layout: [
    '############################',
    '#VVVVVVVVVVVVVVVVVVVVVVVVVV#',
    '#VVVVVVVVVVVVVVVVVVVVVVVVVV#',
    '#VVVVVVVVVVVVVVVVVVVVVVVVVV#',
    '#VVVVVVVVVVVVVVVVVVVVVVVVVV#',
    '#VVVVVVV............VVVVVVV#',
    '#VVVV..................VVVV#',
    '#VVVT..................TVVV#',
    '#VV......................VV#',
    '#V........L......L........V#',
    '#VV......................VV#',
    '#VV....T......P.....T....VV#',
    '#VVV....................VVV#',
    '#VVVVVV..............VVVVVV#',
    '############################',
  ],
};
