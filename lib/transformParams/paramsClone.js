import { isPrimitive } from '../utils/types';

/**
 * 深克隆
 * @param {Object|Array} obj
 */
export const deepClone = (obj) => {
  const clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    (key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        clone[key] = deepClone(obj[key]);
      } else {
        clone[key] = obj[key];
      }
    }
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};

/**
 * 用于拷贝params对象，防止更改原始对象引用
 * @param {*} url
 * @param {*} params
 */
export default function paramsClone(url, params) {
  // 如果为基础类型则直接返回
  // fix: 如果为表单数据，则不进行拷贝
  if (isPrimitive(params) || params instanceof FormData) return [url, params];
  return [url, deepClone(params)];
}
