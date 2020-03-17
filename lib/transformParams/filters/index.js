import filterParams from './utils';

export function createFilter(filters = []) {
  return (url, params) => {
    filterParams(params, filters);
    return [url, params];
  };
}

export const filters = {
  filterFalsy: createFilter(['falsy']),
  filterEmptyAny: createFilter(['null', 'undefined', 'emptyString', 'emptyArray']),
  filterEmptyString: createFilter(['emptyString']),
  filterEmptyArray: createFilter(['emptyArray'])
};
