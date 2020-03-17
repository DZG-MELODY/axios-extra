import { TransformFunction, TransformFunctionMap, TransformParamsConfig, TransformMethod, ParamsObject } from './type';

/**
 * 将参数转换处理序列合成编译为一个方法
 * @param fns
 */
export function compileParamsHandlers(fns: Array<TransformFunction> = []): null | TransformFunction {
  if (!Array.isArray(fns)) return null;
  if (fns.length === 0) return null;
  return (orgUrl: string, orgParams: ParamsObject): [string, ParamsObject] => fns.reduce(([url, params], handler) => handler(url, params), [
    orgUrl,
    orgParams
  ]);
}

/**
 * 合并指定方法的参数转换
 * @param spec 
 * @param orgArray
 */
function mergeTransformParamsFn(spec: TransformFunction | Array<TransformFunction>, orgArray: Array<TransformFunction> = []): null | TransformFunction {
  spec = Array.isArray(spec) ? spec : spec ? [spec] : [];
  return compileParamsHandlers(orgArray.concat(spec));
}

export function setTransformParams(transformFnMap: TransformFunctionMap, options: TransformParamsConfig = {}): void {
  let common: Array<TransformFunction> = [];
  if (options.common) {
    common = Array.isArray(options.common) ? options.common : [options.common];
  }

  // * use assertion to force the keyof options
  (Object.keys(options) as Array<TransformMethod>).forEach((method) => {
    const setMethod = method.toLowerCase() as TransformMethod;
    if (setMethod !== 'common') {
      transformFnMap[setMethod] = mergeTransformParamsFn(options[method] as Array<TransformFunction>, common);
    }
  });

}
