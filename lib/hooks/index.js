import interfaceNoExist from './responseTrigger/interfaceNoExist';
import tokenExpire from './responseTrigger/tokenExpire';

const requestTriggerMap = {};

const responseTriggerMap = {
  interfaceNoExist,
  tokenExpire
};

// 内置钩子，无法通过trigger主动触发
const inlineHooks = ['beforeSend', 'requestCancel'];

export default function setHooks(hookInstance, hooks = {}) {
  if (hooks.request) {
    const requestHooks = Object.keys(hooks.request);
    requestHooks.forEach((hookKey) => {
      const hook = hooks.request[hookKey];
      if (inlineHooks.indexOf(hookKey) >= 0) {
        if (typeof hook === 'function') hookInstance[hookKey] = hook;
      } else if (typeof hook === 'object' && hook.trigger && hook.callback) {
        if (typeof hook.trigger !== 'function') { throw new Error('trigger of hook is not a function'); }
        if (typeof hook.callback !== 'function') { throw new Error('callback of hook is not a function'); }
        hookInstance.request.push(hook);
      } else if (typeof hook === 'function') {
        hook.callback = hook;
        hook.trigger = requestTriggerMap[hookKey] || (() => true);
        hookInstance.request.push(hook);
      } else {
        throw new Error(`hook [${hookKey}] config is invalidate`);
      }
    });
  }
  if (hooks.response) {
    const responseHooks = Object.keys(hooks.response);
    responseHooks.forEach((hookKey) => {
      const hook = hooks.response[hookKey];
      if (inlineHooks.indexOf(hookKey) >= 0) {
        if (typeof hook === 'function') hookInstance[hookKey] = hook;
      } else if (typeof hook === 'object' && hook.trigger && hook.callback) {
        if (typeof hook.trigger !== 'function') { throw new Error('trigger of hook is not a function'); }
        if (typeof hook.callback !== 'function') { throw new Error('callback of hook is not a function'); }
        hookInstance.response.push(hook);
      } else if (typeof hook === 'function') {
        hook.callback = hook;
        hook.trigger = responseTriggerMap[hookKey] || (() => true);
        hookInstance.response.push(hook);
      } else {
        throw new Error(`hook [${hookKey}] config is invalidate`);
      }
    });
  }
}
