import axios from 'axios';
import setCancelConfig from './cancel/index';
import { setInterceptors, resetInterceptors, mergeInterceptors } from './interceptors';
import setHooks from './hooks';
import {
  setTransformParams,
  compileParamsHandlers
} from './transformParams';
import { AxiosExtConfig } from './config';
import { HooksCache } from './hooks/type';

// 全局配置缓存
let globalConfig = {};

// 全局钩子回调
const globalHooks: HooksCache = {
  request: [],
  response: []
};

// 全局拦截器缓存
let globalInterceptors = {};

// 编译后的方法
const transformParamsFn = {
  get: null,
  post: null,
  put: null,
  delete: null,
  patch: null
};

export function set(options: AxiosExtConfig = {}): void {
  // 编译params transform 和common合并编译
  if (options.transformParams) {
    setTransformParams(transformParamsFn, options.transformParams);
    delete options.transformParams;
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

export function reset(): void {
  // 重置配置对象
  globalConfig = {};
  // 清除所有钩子函数
  globalHooks.request = [];
  globalHooks.response = [];
  if (globalHooks.beforeSend) delete globalHooks.beforeSend;
  if (globalHooks.requestCancel) delete globalHooks.requestCancel;
  // 清除所有转换方法
  Object.keys(transformParamsFn).forEach((key) => {
    transformParamsFn[key] = null;
  });
  // 重置拦截器
  resetInterceptors(axios);
  globalInterceptors = {};
}

/**
 * 生成请求方法
 * @param {string} method
 */
function createHttpMethod(method) {
  return (url, params = {}, options = {}) => {
    const config = Object.assign({}, globalConfig, options);

    // 参数转换,自定义直接覆盖，不做合并
    let transformFn = null;
    if (Object.prototype.hasOwnProperty.call(options, 'transformParams')) {
      if (options.transformParams === false) {
        transformFn = null;
      } else if (Array.isArray(options.transformParams)) {
        transformFn = compileParamsHandlers(config.transformParams);
      } else {
        throw new Error('method transformParams must be Array');
      }
    } else {
      transformFn = transformParamsFn[method];
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
      delete config.transformParams;
    } else {
      if (method === 'get') {
        config.params = params;
      } else {
        config.data = params;
      }
      delete config.transformParams;
    }

    // 拦截器设置
    const isNewInstance = Object.prototype.hasOwnProperty.call(
      config,
      'interceptors'
    );
    const axiosInstance = isNewInstance ? axios.create() : axios;
    if (isNewInstance) {
      if (config.interceptors.merge) {
        setInterceptors(
          axiosInstance,
          mergeInterceptors(config.interceptors, globalInterceptors)
        );
      } else {
        setInterceptors(axiosInstance, config.interceptors);
      }
      delete config.interceptors;
    }

    // 设置取消触发器
    let cancelTrigger = null;
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
    const promise = new Promise((resolve, reject) => {
      axiosInstance(config)
        .then((response) => {
          response.signature = signature;
          // 执行钩子函数
          globalHooks.response.forEach((hook) => {
            if (hook.trigger(response)) hook.callback(response);
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
  set,
  reset
};
