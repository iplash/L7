import BaseLayer from '../core/BaseLayer';
import { IGeometryLayerStyleOptions } from '../core/interface';
import GeometryModels, { GeometryModelType } from './models';

export default class GeometryLayer extends BaseLayer<
  IGeometryLayerStyleOptions
> {
  public type: string = 'GeometryLayer';
  public defaultSourceConfig = {
    data: [{ x: 0, y: 0 }],
    options: {
      parser: {
        type: 'json',
        x: 'x',
        y: 'y',
      },
    },
  };
  public buildModels() {
    const modelType = this.getModelType();
    this.layerModel = new GeometryModels[modelType](this);
    this.layerModel.initModels((models) => {
      this.dispatchModelLoad(models);
    });
  }
  public rebuildModels() {
    this.layerModel.buildModels((models) => {
      this.dispatchModelLoad(models);
    });
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
  protected getDefaultConfig() {
    const type = this.getModelType();
    const defaultConfig = {
      plane: {},
      sprite: {},
      billboard: {},
    };
    return defaultConfig[type];
  }

  protected getModelType(): GeometryModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shape = shapeAttribute?.scale?.field as GeometryModelType;
    if (shape === 'plane') {
      return 'plane';
    } else if (shape === 'sprite') {
      return 'sprite';
    } else if (shape === 'billboard') {
      return 'billboard';
    } else {
      return 'plane';
    }
  }
}
