import { InterceptorCache, RequestInterceptor, ResponseInterceptor, isInterceptorFn, ResponseInterceptorFn, RequestInterceptorFn, InterceptorConfig } from "./type";
import { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";

// 拦截器缓存
const interceptorsCache: InterceptorCache = {
  request: [],
  response: []
};

/**
 * 注册拦截器
 * @param {*} interceptorManager
 * @param {*} interceptors
 */
function useRequestInterceptors(
  interceptorManager: AxiosInterceptorManager<AxiosRequestConfig>,
  interceptors: Array<RequestInterceptor> | RequestInterceptor = [],
  interceptorsCache: Array<number>): void {

  if (!interceptorManager || !interceptorManager.use) throw new Error('axios instance has no use method, it may be broken');

  interceptors = Array.isArray(interceptors) ? interceptors : [interceptors];

  interceptors.forEach(interceptor => {
    if (isInterceptorFn<RequestInterceptorFn>(interceptor)) {
      interceptorsCache.push(interceptorManager.use(interceptor));
    } else {
      interceptorsCache.push(interceptorManager.use(interceptor.resolve, interceptor.reject));
    }
  });
}

function useResponseInterceptors(
  interceptorManager: AxiosInterceptorManager<AxiosResponse>,
  interceptors: Array<ResponseInterceptor> | ResponseInterceptor = [],
  interceptorsCache: Array<number>): void {

  if (!interceptorManager || !interceptorManager.use) throw new Error('axios instance has no use method, it may be broken');

  interceptors = Array.isArray(interceptors) ? interceptors : [interceptors];

  interceptors.forEach(interceptor => {
    if (isInterceptorFn<ResponseInterceptorFn>(interceptor)) {
      interceptorsCache.push(interceptorManager.use(interceptor));
    } else {
      interceptorsCache.push(interceptorManager.use(interceptor.resolve, interceptor.reject));
    }
  });
}

/**
 * 设置拦截器
 * @param axiosInstance 
 * @param interceptorsConfig 
 */
export function setInterceptors(axiosInstance: AxiosInstance, interceptorsConfig: InterceptorConfig = {}, isCache = true): void {
  if (interceptorsConfig.request) {
    useRequestInterceptors(
      axiosInstance.interceptors.request,
      interceptorsConfig.request,
      isCache ? interceptorsCache.request : []
    );
  }
  if (interceptorsConfig.response) {
    useResponseInterceptors(
      axiosInstance.interceptors.response,
      interceptorsConfig.response,
      isCache ? interceptorsCache.response : []
    );
  }
}

/**
 * 重置拦截器
 * @param {Axios} axiosInstance
 */
export function resetInterceptors(axiosInstance: AxiosInstance): void {
  interceptorsCache.request.forEach((interceptor) => {
    axiosInstance.interceptors.request.eject(interceptor);
  });
  interceptorsCache.response.forEach((interceptor) => {
    axiosInstance.interceptors.response.eject(interceptor);
  });
}

/**
 * 拦截器合并
 * @param target 
 * @param source 
 */
export function mergeInterceptors(target: InterceptorConfig, source: InterceptorConfig): InterceptorConfig {
  const ret: InterceptorConfig = {
    request: [],
    response: []
  };
  ret.request = [...(target.request || []), ...(source.request || [])];
  ret.response = [...(target.response || []), ...(source.response || [])];
  return ret;
}
