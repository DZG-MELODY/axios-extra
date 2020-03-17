import { warn } from '../utils/report';

/**
 * 为请求参数增加随机参数，用于防止IE下的缓存问题
 * @param {*} url
 * @param {*} params
 */
export default function addRandom(url, params) {
  if (!params.r) {
    params.r = Date.now();
  } else {
    warn('transformParams', 'random params r has exist in params object');
  }
  return [url, params];
}
