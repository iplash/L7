// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [116.3956, 39.9392],
        zoom: 10,
        style: 'amap://styles/wine',
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/0d2f0113-f48b-4db9-8adc-a3937243d5a3.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new LineLayer({})
            .source(data)
            .size(1.5)
            .shape('line')
            .color('标准名称', ['#5B8FF9', '#5CCEA1', '#F6BD16'])
            .active(true)
            .style({
              lineType: 'dash',
              dashArray: [5, 5],
            });
          scene.addLayer(layer);
        });
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
