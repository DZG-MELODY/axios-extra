import { AxiosExtGlobalConfig } from "../config";
import { AxiosResponse } from "axios";

export type RequestInterceptorFn = (config: AxiosExtGlobalConfig) => AxiosExtGlobalConfig | Promise<AxiosExtGlobalConfig>
export type RequestInterceptorConfig = {
  resolve: RequestInterceptorFn;
  reject: (error: Error) => Promise<Error>;
}
export type RequestInterceptor = RequestInterceptorFn | RequestInterceptorConfig


export type ResponseInterceptorFn = (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
export type ResponseInterceptorConfig = {
  resolve: ResponseInterceptorFn;
  reject: (error: Error) => Promise<Error>;
}

export type ResponseInterceptor = ResponseInterceptorFn | ResponseInterceptorConfig


export function isInterceptorFn<T extends RequestInterceptorFn | ResponseInterceptorFn>(val: unknown): val is T {
  return typeof val === 'function';
}


export interface InterceptorGlobalConfig {
  request?: Array<RequestInterceptor>;
  response?: Array<ResponseInterceptor>;
}

export interface InterceptorInstanceConfig {
  merge?: boolean;
  request?: Array<RequestInterceptor>;
  response?: Array<ResponseInterceptor>;
}

export interface InterceptorCache {
  request: Array<number>;
  response: Array<number>;
}