import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
  ITexture2D,
} from '@antv/l7-core';
import { getMask, isMini } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import { IImageLayerStyleOptions } from '../../core/interface';
import { RasterImageTriangulation } from '../../core/triangulation';
import ImageFrag from '../shaders/image_frag.glsl';
import ImageVert from '../shaders/image_vert.glsl';

export default class ImageModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms(): IModelUniform {
    const { opacity } = this.layer.getLayerConfig() as IImageLayerStyleOptions;
    return {
      u_opacity: opacity || 1,
      u_texture: this.texture,
    };
  }

  public initModels(callbackModel: (models: IModel[]) => void) {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IImageLayerStyleOptions;

    const source = this.layer.getSource();
    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });

    if (isMini) {
      // @ts-ignore
      const canvas = this.layerService.sceneService.getSceneConfig().canvas;
      const img = canvas.createImage();
      img.crossOrigin = 'anonymous';
      img.src = source.data.originData;

      img.onload = () => {
        this.texture = createTexture2D({
          data: img,
          width: img.width,
          height: img.height,
        });
        this.layerService.reRender();
      };
    } else {
      source.data.images.then(
        (imageData: Array<HTMLImageElement | ImageBitmap>) => {
          this.texture = createTexture2D({
            data: imageData[0],
            width: imageData[0].width,
            height: imageData[0].height,
            mag: gl.LINEAR,
            min: gl.LINEAR,
          });
          this.layerService.reRender();
        },
      );
    }

    this.layer
      .buildLayerModel({
        moduleName: 'rasterImage',
        vertexShader: ImageVert,
        fragmentShader: ImageFrag,
        triangulation: RasterImageTriangulation,
        primitive: gl.TRIANGLES,
        blend: {
          // Tip: 优化显示效果
          enable: true,
        },
        depth: { enable: false },
        stencil: getMask(mask, maskInside),
        pick: false,
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  public clearModels(): void {
    this.texture?.destroy();
  }

  public buildModels(callbackModel: (models: IModel[]) => void) {
    this.initModels(callbackModel);
  }

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
