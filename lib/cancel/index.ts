import axios, { Canceler } from 'axios';

export default function setCancelConfig(config): Canceler {
  const { token, cancel } = axios.CancelToken.source();
  config.cancelToken = token;
  return cancel;
}
