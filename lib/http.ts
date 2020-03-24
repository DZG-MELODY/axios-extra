import axios, { AxiosInstance, Canceler } from 'axios';
import setCancelConfig from './cancel/index';
import { setInterceptors, resetInterceptors, mergeInterceptors } from './interceptors';
import { setHooks } from './hooks';
import { setTransformParams, compileParamsHandlers } from './transformParams';
import { AxiosExtGlobalConfig, AxiosExtInstanceConfig } from './config';
import { HooksCache, AxiosExtResponse } from './hooks/type';
import { InterceptorGlobalConfig } from './interceptors/type';
import { TransformMethod, TransformFunctionMap, TransformFunction, ParamsObject } from './transformParams/type';

// 全局配置缓存
let globalConfig = {};

// 全局钩子回调
const globalHooks: HooksCache = {
  request: [],
  response: []
};

// 全局拦截器缓存
let globalInterceptors: InterceptorGlobalConfig = {};
// 编译后的方法
const transformParamsFn: TransformFunctionMap = {};

export function setConfig(options: AxiosExtGlobalConfig = {}): void {
  // 编译params transform 和common合并编译
  if (options.transformConfig) {
    setTransformParams(transformParamsFn, options.transformConfig);
    delete options.transformConfig;
  }
  // 注册拦截器
  if (options.interceptors) {
    setInterceptors(axios, options.interceptors);
    // 保留到全局配置中
    globalInterceptors = options.interceptors;
    delete options.interceptors;
  }
  // 检验钩子函数并注册钩子
  if (options.hooks) {
    setHooks(globalHooks, options.hooks);
    delete options.hooks;
  }
  // 缓存全局配置
  globalConfig = options;
}

export function resetConfig(): void {
  // 重置配置对象
  globalConfig = {};
  // 清除所有钩子函数
  globalHooks.request = [];
  globalHooks.response = [];
  if (globalHooks.beforeSend) delete globalHooks.beforeSend;
  if (globalHooks.requestCancel) delete globalHooks.requestCancel;
  // 清除所有转换方法
  (Object.keys(transformParamsFn) as Array<TransformMethod>).forEach((key) => {
    transformParamsFn[key] = null;
  });
  // 重置拦截器
  resetInterceptors(axios);
  globalInterceptors = {};
}

type AxiosExtMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

class AxiosExtPromise<T> extends Promise<T> {
  public cancel?: Canceler;
}

/**
 * 生成请求方法
 * @param {string} method
 */
function createHttpMethod(method: AxiosExtMethod) {
  return (url: string, params: ParamsObject = {}, options: AxiosExtInstanceConfig = {}): AxiosExtPromise<unknown> => {
    const config = Object.assign({}, globalConfig, options);
    // 参数转换,自定义直接覆盖，不做合并
    let transformFn: TransformFunction | null = null;
    // 判断是否存在转换器，如果有转换器则使用自定义转换器
    if (Object.prototype.hasOwnProperty.call(options, 'transformParams')) {
      if (options.transformParams === false) {
        transformFn = null;
      } else {
        if (Array.isArray(options.transformParams)) {
          transformFn = compileParamsHandlers(config.transformParams || []);
        } else {
          throw new Error('method transformParams must be Array');
        }
      }
    } else {
      transformFn = transformParamsFn[method] ?? null;
    }

    if (transformFn) {
      const [transUrl, transParams] = transformFn(url, params);
      url = transUrl;
      // 转换传入参数，并且合并传入参数
      if (method === 'get') {
        config.params = Object.assign(transParams, options.params || {});
      } else {
        config.data = Object.assign(transParams, options.data || {});
      }
    } else {
      if (method === 'get') {
        config.params = params;
      } else {
        config.data = params;
      }
    }

    let axiosInstance: AxiosInstance = axios;

    // 拦截器设置
    if (config.interceptors) {
      axiosInstance = axios.create();
      if (config.interceptors.merge) {
        setInterceptors(
          axiosInstance,
          mergeInterceptors(config.interceptors, globalInterceptors),
          false
        );
      } else {
        setInterceptors(axiosInstance, config.interceptors, false);
      }
    }

    // 设置取消触发器
    let cancelTrigger: Canceler | null = null;
    if (options.canCancel) {
      cancelTrigger = setCancelConfig(config);
    }
    // 触发钩子函数
    globalHooks.request.forEach((hook) => {
      if (hook.trigger(config)) hook.callback(config);
    });
    // 发送前触发钩子函数
    // ? 考虑是否深度拷贝
    if (globalHooks.beforeSend) { globalHooks.beforeSend(Object.assign({ url }, config)); }

    config.url = url;
    config.method = method;
    // 获取自定义参数，可以透传
    const signature = config.signature || {};
    // 是否返回原始response
    const isOriginResponse = !!config.isOriginResponse;
    // 初始化实例
    const promise = new AxiosExtPromise<unknown>((resolve, reject) => {
      axiosInstance(config)
        .then((response) => {
          (response as AxiosExtResponse<unknown>).signature = signature;
          // 执行钩子函数
          globalHooks.response.forEach((hook) => {
            if (hook.trigger(response as AxiosExtResponse<unknown>)) hook.callback(response as AxiosExtResponse<unknown>);
          });
          // 只将数据透传到下一层
          // ?是否应该全部透传
          resolve(isOriginResponse ? response : response.data);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            // 全局钩子，请求取消回调
            err.isCancel = true;
            if (globalHooks.requestCancel) globalHooks.requestCancel(err);
          }
          reject(err);
        });
    });
    // 如果设置取消，则挂载触发器
    if (cancelTrigger) promise.cancel = cancelTrigger;

    return promise;
  };
}

export const httpGet = createHttpMethod('get');

export const httpPost = createHttpMethod('post');

export const httpPut = createHttpMethod('put');

export const httpDelete = createHttpMethod('delete');

export const httpPatch = createHttpMethod('patch');

export default {
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  httpPatch,
  setConfig,
  resetConfig
};
