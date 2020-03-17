import { warn } from '../../utils/report';

export default function setClientAppId(config) {
  if (
    window.config
    && window.config.globalConfig
    && Object.prototype.hasOwnProperty.call(window.config.globalConfig, 'clientAppId')
  ) {
    config.headers['Client-App-Id'] = window.config.globalConfig.clientAppId;
  } else {
    warn('interceptor', 'no globalConfig to get client-app-id');
  }
  return config;
}
