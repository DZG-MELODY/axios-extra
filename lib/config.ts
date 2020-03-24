import { AxiosRequestConfig } from 'axios';
import { TransformParamsConfig, TransformFunction } from './transformParams/type';
import { InterceptorGlobalConfig, InterceptorInstanceConfig } from './interceptors/type';
import { HooksConfig } from './hooks/type';


export interface Response<T> {
  data: T;
}

export interface AxiosExtGlobalConfig extends AxiosRequestConfig {
  transformConfig?: TransformParamsConfig;
  interceptors?: InterceptorGlobalConfig;
  hooks?: HooksConfig;
}

// export interface AxiosExtInstanceConfig extends AxiosRequestConfig {
//   signature?: {};
//   isOriginResponse?: boolean;
//   transformParams?: Array<TransformFunction> | false;
//   interceptors?: InterceptorInstanceConfig;
//   hooks?: HooksConfig;
//   canCancel?: boolean;
// }

export interface AxiosExtInstanceStrictConfig extends AxiosRequestConfig {
  signature: { [k: string]: unknown };
  isOriginResponse: boolean;
  transformParams: Array<TransformFunction> | false;
  interceptors: InterceptorInstanceConfig;
  hooks: HooksConfig;
  canCancel: boolean;
}

export type AxiosExtInstanceConfig = Partial<AxiosExtInstanceStrictConfig>