import { AxiosExtConfig } from "../config";
import { AxiosResponse } from "axios";

export type RequestHookFn = (config: AxiosExtConfig) => void
export type RequestHookConfig = {
  trigger: (config: AxiosExtConfig) => boolean;
  callback: (config: AxiosExtConfig) => void;
}
export type RequestHook = RequestHookFn | RequestHookConfig

export function isRequestHookFn(val: RequestHook): val is RequestHookFn {
  return typeof val === 'function';
}


export type ResponseHookFn = (config: AxiosResponse) => void
export type ResponseHookConfig = {
  trigger: (config: AxiosResponse) => boolean;
  callback: (config: AxiosResponse) => void;
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