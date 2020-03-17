import setClientAppId from './request/setClientAppId';
import setToken from './request/setToken';

export default {
  request: {
    setClientAppId,
    setToken
  },
  response: {}
};

// 拦截器缓存队列
const interceptorsRequestCache = [];
const interceptorsResponseCache = [];

/**
 * 注册拦截器
 * @param {*} managerInstance
 * @param {*} interceptors
 */
function useInterceptors(managerInstance, interceptors = [], interceptorsCache = []) {
  if (!managerInstance || !managerInstance.use) throw new Error('axios instance has no use method, it may be broken');
  interceptors = Array.isArray(interceptors) ? interceptors : [interceptors];
  const len = interceptors.length;
  let i = 0;
  while (i < len) {
    if (typeof interceptors[i] === 'function') { interceptors[i].resolve = interceptors[i]; }
    interceptorsCache.push(managerInstance.use(interceptors[i].resolve, interceptors[i].reject));
    i += 1;
  }
}

/**
 * 设置拦截器
 * @param {Axios} axiosInstance
 * @param {*} interceptorsConfig
 */
export function setInterceptors(axiosInstance, interceptorsConfig = {}) {
  if (interceptorsConfig.request) {
    useInterceptors(
      axiosInstance.interceptors.request,
      interceptorsConfig.request,
      interceptorsRequestCache
    );
  }
  if (interceptorsConfig.response) {
    useInterceptors(
      axiosInstance.interceptors.response,
      interceptorsConfig.response,
      interceptorsResponseCache
    );
  }
}

/**
 * 重置拦截器
 * @param {Axios} axiosInstance
 */
export function resetInterceptors(axiosInstance) {
  interceptorsRequestCache.forEach((interceptor) => {
    axiosInstance.interceptors.request.eject(interceptor);
  });
  interceptorsResponseCache.forEach((interceptor) => {
    axiosInstance.interceptors.response.eject(interceptor);
  });
}

/**
 * 拦截器合并
 * @param {*} target
 * @param {*} source
 */
export function mergeInterceptors(target, source) {
  const ret = {
    request: [],
    response: []
  };
  ret.request = [...(target.request || []), ...(source.request || [])];
  ret.response = [...(target.response || []), ...(source.response || [])];
  return ret;
}
