import { AxiosRequestConfig } from 'axios';
import { TransformParamsConfig } from './transformParams/type';


export interface Response<T> {
  data: T;
}

export interface AxiosExtConfig extends AxiosRequestConfig {
  signature?: {};
  isOriginResponse?: boolean;
  transformParams?: TransformParamsConfig | false;
  interceptors?: {};
  hooks?: {};
  canCancel?: boolean;
}
