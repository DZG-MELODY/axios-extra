import filterParams, { ValidateFn, ValidateFnTypes } from './utils';
import { TransformFunction, ParamsObject } from '../type';

export function createFilter(filters: Array<ValidateFn | ValidateFnTypes> = []): TransformFunction {
  return (url: string, params: ParamsObject): [string, ParamsObject] => {
    filterParams(params, filters);
    return [url, params];
  };
}
export const filterFalsy = createFilter(['falsy']);
export const filterEmptyAny = createFilter(['null', 'undefined', 'emptyString', 'emptyArray']);
export const filterEmptyString = createFilter(['emptyString']);
export const filterEmptyArray = createFilter(['emptyArray']);
