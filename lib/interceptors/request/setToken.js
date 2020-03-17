import { warn } from '../../utils/report';

export default function setToken(config) {
  try {
    if (window.localStorage.getItem('token')) {
      config.headers.Authorization = `${window.localStorage.getItem('token')}`;
    }
  } catch (e) {
    /* istanbul ignore next */
    warn('interceptor', `token set error: ${e.message}`);
  }
  return config;
}
