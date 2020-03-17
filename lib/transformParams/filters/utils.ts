import { isPlainObject } from '../../utils';

export type ValidateFn = (v: unknown) => boolean
export type ValidateFnTypes = 'null' | 'undefined' | 'NaN' | 'infinite' | 'emptyString' | 'emptyContent' | 'emptyArray' | 'falsy'

const VALIDATOR_MAP: Record<ValidateFnTypes, ValidateFn> = {
  null: (v: unknown): boolean => v === null,
  undefined: (v: unknown): boolean => v === undefined,
  NaN: (v: unknown): boolean => typeof v === 'number' && Number.isNaN(v),
  infinite: (v: unknown): boolean => typeof v === 'number' && !Number.isFinite(v),
  emptyString: (v: unknown): boolean => v === '',
  emptyContent: (v: unknown): boolean => typeof v === 'string' && v.trim() === '',
  emptyArray: (v: unknown): boolean => Array.isArray(v) && v.length === 0,
  falsy: (v: unknown): boolean => !v
};

function createValidateFn(validators: Array<ValidateFn | ValidateFnTypes> = []): ValidateFn {
  const len = validators.length;
  return (value: unknown): boolean => {
    let i = 0;
    let ret = false;
    while (i < len) {
      const validate = validators[i];
      const validateFn: ValidateFn = typeof validate === 'function' ? validate : VALIDATOR_MAP[validate];
      if (validateFn && validateFn(value)) {
        ret = true;
        break;
      }
      i += 1;
    }
    return ret;
  };
}

/**
 * 过滤参数
 * @param params 
 * @param validators 
 */
export default function filterParams(params: object = {}, validators: Array<ValidateFn | ValidateFnTypes> = []): void {
  const validateFn = createValidateFn(validators);
  function traverse(obj: object): void {
    if (isPlainObject(obj)) {
      (Object.keys(obj) as Array<keyof object>).forEach((key) => {
        if (validateFn(obj[key])) {
          delete obj[key];
        } else if (isPlainObject(obj[key])) {
          traverse(obj[key]);
        }
      });
    }
  }
  traverse(params);
}
