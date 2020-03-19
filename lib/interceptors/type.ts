import { AxiosExtConfig } from "../config";
import { AxiosResponse } from "axios";

export type RequestInterceptorFn = (config: AxiosExtConfig) => AxiosExtConfig | Promise<AxiosExtConfig>
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


export interface InterceptorConfig {
  request?: Array<RequestInterceptor>;
  response?: Array<ResponseInterceptor>;
}

export interface InterceptorCache {
  request: Array<number>;
  response: Array<number>;
}