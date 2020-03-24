import { AxiosExtInstanceConfig } from "../config";
import { AxiosResponse } from "axios";

export type RequestHookFn = (config: AxiosExtInstanceConfig) => void
export type RequestHookConfig = {
  trigger: (config: AxiosExtInstanceConfig) => boolean;
  callback: (config: AxiosExtInstanceConfig) => void;
}
export type RequestHook = RequestHookFn | RequestHookConfig

export function isRequestHookFn(val: RequestHook): val is RequestHookFn {
  return typeof val === 'function';
}

export interface AxiosExtResponse<T> extends AxiosResponse<T> {
  signature: { [k: string]: unknown };
}

export type ResponseHookFn = (config: AxiosExtResponse<unknown>) => void
export type ResponseHookConfig = {
  trigger: (config: AxiosExtResponse<unknown>) => boolean;
  callback: (config: AxiosExtResponse<unknown>) => void;
}
export type ResponseHook = ResponseHookFn | ResponseHookConfig

export function isResponseHookFn(val: ResponseHook): val is ResponseHookFn {
  return typeof val === 'function';
}

export interface HooksConfig {
  request?: { [k: string]: RequestHook };
  response?: { [k: string]: ResponseHook };
  beforeSend?: RequestHookFn;
  requestCancel?: (error: Error) => void;
}

export interface HooksCache {
  request: Array<RequestHookConfig>;
  response: Array<ResponseHookConfig>;
  beforeSend?: RequestHookFn;
  requestCancel?: (error: Error) => void;
}