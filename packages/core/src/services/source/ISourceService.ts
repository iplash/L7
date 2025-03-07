import { TilesetManager } from '@antv/l7-utils';
import { BBox } from '@turf/helpers';
export type DataType = string | object[] | object;
export interface IParserCfg {
  type: string;
  x?: string;
  y?: string;
  x1?: string;
  y1?: string;
  coordinates?: string;
  geometry?: string;
  [key: string]: any;
}
type CallBack = (...args: any[]) => any;
export interface ITransform {
  type: string;
  [key: string]: any;
  callback?: CallBack;
}

export interface ISourceCFG {
  cluster?: boolean;
  clusterOptions?: Partial<IClusterOptions>;
  parser?: IParserCfg;
  transforms?: ITransform[];
}
export interface IClusterOptions {
  enable: false;
  radius: number;
  maxZoom: number;
  minZoom: number;
  zoom: number;
  bbox: [number, number, number, number];
  field: string;
  method: 'max' | 'sum' | 'min' | 'mean' | 'count' | CallBack;
}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface IFeatureKey {
  [key: string]: {
    index: number;
    idField: any;
  };
}
// 解析后返回数据类型
export interface IParseDataItem {
  coordinates: any[];
  _id: number;
  [key: string]: any;
}
export interface IParserData {
  [key: string]: any;
  dataArray: IParseDataItem[];
  // 瓦片地图数据字典
  featureKeys?: IFeatureKey;
}
export interface IJsonItem {
  [key: string]: any;
}
export type IJsonData = IJsonItem[];

export interface ISource {
  inited: boolean;
  data: IParserData;
  center: [number, number];
  parser: IParserCfg;
  transforms: ITransform[];
  cluster: boolean;
  clusterOptions: Partial<IClusterOptions>;
  extent: BBox;
  tileset: TilesetManager | undefined;
  setData(data: any, options?: ISourceCFG): void;
  updateClusterData(zoom: number): void;
  getFeatureById(id: number): unknown;
  getFeatureId(field: string, value: any): number | undefined;
  getParserType(): string;
  getClusters(zoom: number): any;
  getClustersLeaves(id: number): any;
  updateFeaturePropertiesById(
    id: number,
    properties: Record<string, any>,
  ): void;
  destroy(): void;
  // Event
  on(type: string, handler: (...args: any[]) => void): void;
  off(type: string, handler: (...args: any[]) => void): void;
  once(type: string, handler: (...args: any[]) => void): void;
}
export interface IRasterCfg {
  extent: [number, number, number, number];
  width: number;
  height: number;
  max: number;
  min: number;
}

export interface IRasterParserDataItem extends IParseDataItem {
  data: number[];
  width: number;
  height: number;
}
