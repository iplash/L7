import { Scene, PolygonLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 105, 35 ],
    style: 'dark',
    zoom: 2.5
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new PolygonLayer({ blend: 'normal' })
        .source(data)
        .size('name', [ 0, 10000, 50000, 30000, 100000 ])
        .color('name', [
          '#2E8AE6',
          '#69D1AB',
          '#DAF291',
          '#FFD591',
          '#FF7A45',
          '#CF1D49'
        ])
        .shape('fill')
        .active(true)
        .style({
          opacity: 0.8,
          opacityLinear: {
            enable: true,
            dir: 'in' // in - out
          }
        });
      scene.addLayer(layer);

      const layer2 = new PolygonLayer({ blend: 'normal' })
        .source(data)
        .size(0.5)
        .color('name', [
          '#2E8AE6',
          '#69D1AB',
          '#DAF291',
          '#FFD591',
          '#FF7A45',
          '#CF1D49'
        ])
        .shape('line')
        .select(true);
      scene.addLayer(layer2);
    });
});
// {
//   "filename": "china_linear_in.js",
//   "title": "中国地图-径向渐变",
//   "screenshot": "https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*SgKRRKJ1w-EAAAAAAAAAAAAAARQnAQ"
// },