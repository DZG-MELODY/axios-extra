import axios, { Canceler } from 'axios';
import { AxiosExtInstanceConfig } from '../config';

export default function setCancelConfig(config: AxiosExtInstanceConfig): Canceler {
  const { token, cancel } = axios.CancelToken.source();
  config.cancelToken = token;
  return cancel;
}
