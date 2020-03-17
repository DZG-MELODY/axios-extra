import { isPlainObject } from '../../utils/types';

const VALIDATOR_MAP = {
  null: (v) => v === null,
  undefined: (v) => v === undefined,
  NaN: (v) => Number.isNaN(v),
  infinite: (v) => typeof v === 'number' && !Number.isFinite(v),
  emptyString: (v) => v === '',
  emptyContent: (v) => typeof v === 'string' && v.trim() === '',
  emptyArray: (v) => Array.isArray(v) && v.length === 0,
  falsy: (v) => !v
};

function createValidateFn(validators = []) {
  const len = validators.length;
  return (value) => {
    let i = 0;
    let ret = false;
    while (i < len) {
      const validate = validators[i];
      const validateFn = typeof validate === 'function' ? validate : VALIDATOR_MAP[validate];
      if (validateFn && validateFn(value)) {
        ret = true;
        break;
      }
      i += 1;
    }
    return ret;
  };
}


export default function filterParams(params = {}, validators = []) {
  const validateFn = createValidateFn(validators);
  function traverse(obj) {
    if (isPlainObject(obj)) {
      Object.keys(obj).forEach((key) => {
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
