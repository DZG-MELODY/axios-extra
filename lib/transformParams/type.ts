import { Method } from 'axios';

export type ParamsObject = { [name: string]: unknown } | Array<unknown>
export function isParamsObject(val: unknown): val is ParamsObject {
  return typeof val === 'object' && val !== null;
}

export type TransformMethod = Method | 'COMMON' | 'common'
export type TransformFunction = (url: string, params: ParamsObject) => [string, ParamsObject]
export type TransformFunctionMap = { [k in TransformMethod]?: TransformFunction | null }
export type TransformParamsConfig = { [k in TransformMethod]?: Array<TransformFunction> }
