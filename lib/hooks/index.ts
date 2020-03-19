import { HooksConfig, isRequestHookFn, HooksCache, isResponseHookFn } from "./type";

/**
 * 设置Hooks
 * @param hookCache 
 * @param hooksConfig 
 */
export function setHooks(hookCache: HooksCache, hooksConfig: HooksConfig = {}): void {

  const { request, response, beforeSend, requestCancel } = hooksConfig;

  if (beforeSend) hookCache.beforeSend = beforeSend;
  if (requestCancel) hookCache.requestCancel = requestCancel;

  if (request) {
    Object.entries(request).forEach(([, hook]) => {
      if (isRequestHookFn(hook)) {
        hookCache.request.push({
          callback: hook,
          trigger: () => true
        });
      } else {
        hookCache.request.push(hook);
      }
    });
  }

  if (response) {
    Object.entries(response).forEach(([, hook]) => {
      if (isResponseHookFn(hook)) {
        hookCache.response.push({
          callback: hook,
          trigger: () => true
        });
      } else {
        hookCache.response.push(hook);
      }
    });
  }
}
