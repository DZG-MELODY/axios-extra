/**
 * value is primitive
 * @param val 
 */
export const isPrimitive = (val: unknown): boolean => Object(val) !== val;

/**
 * value is a plain object
 * @param val 
 */
export const isPlainObject = (val: unknown): boolean =>
  !!val
  && typeof val === 'object'
  && (val as object).constructor === Object;


