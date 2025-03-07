// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { PointLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class PointTest extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 2,
      }),
    });

    // let address = 'https://gw.alipayobjects.com/os/bmw-prod/e76d89f4-aa69-4974-90b7-b236904a43b1.json' // 100
    // let address = 'https://gw.alipayobjects.com/os/bmw-prod/edc8219a-b095-4451-98e9-3e387e290087.json' // 10000
    // let address = 'https://gw.alipayobjects.com/os/bmw-prod/2c37f08b-3fe6-4c68-a699-dc15cfc217f1.json' // 50000
    let address =
      'https://gw.alipayobjects.com/os/bmw-prod/8adff753-64e6-4ffa-9e7b-1f3dc6f4fd76.json'; // 100000
    // let address =
    //   'https://gw.alipayobjects.com/os/bmw-prod/577a70fb-fc19-4582-83ed-7cddb7b77645.json'; // 20 0000
    fetch(address)
      .then((res) => res.json())
      .then((data) => {
        const source = new Source(
          [
            {
              lng: 120,
              lat: 30,
            },
          ],
          {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          },
        );

        const layer = new PointLayer({ workerEnabled: true })
          .source(data, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          // .source(source)
          .size(10)
          .color('#f00')
          .shape('circle')
          .active(true);

        scene.on('loaded', () => {
          let t = new Date().getTime();
          scene.addLayer(layer);
          console.log(new Date().getTime() - t);

          // setTimeout(() => {
          //   layer.setData([{
          //     lng: 120, lat: 30
          //   }])
          // }, 2000)

          // layer.on('inited', () => {
          // console.log('inited ***')
          layer.setData([
            { lng: 120, lat: 30 },
            { lng: 130, lat: 30 },
          ]);
          // })
        });
      });
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>
    );
  }
}
