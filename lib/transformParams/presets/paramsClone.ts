import { isPrimitive } from '../../utils';
import { TransformFunction, ParamsObject, isParamsObject } from '../type';


/**
 * 克隆对象
 * @param obj 
 */
export const paramsObjectClone = (obj: ParamsObject): ParamsObject => {
  if (Array.isArray(obj)) {
    const clone: ParamsObject = [];
    obj.forEach((prop, index) => {
      if (isParamsObject(prop)) {
        clone[index] = paramsObjectClone(prop);
      } else {
        clone[index] = prop;
      }
    });
    return clone;
  } else {
    const clone: ParamsObject = {};
    Object.keys(obj).forEach(
      (key) => {
        const prop = obj[key];
        if (isParamsObject(prop)) {
          clone[key] = paramsObjectClone(prop);
        } else {
          clone[key] = prop;
        }
      }
    );
    return clone;
  }
};

/**
 * 用于拷贝params对象，防止更改原始对象引用
 * @param {*} url
 * @param {*} params
 */
export const paramsClone: TransformFunction = (url: string, params: ParamsObject): [string, ParamsObject] => {
  // 如果为基础类型则直接返回
  // fix: 如果为表单数据，则不进行拷贝
  if (isPrimitive(params)) return [url, params];
  if (globalThis.FormData && params instanceof FormData) return [url, params];
  return [url, paramsObjectClone(params)];
};
