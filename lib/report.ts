export type reportType = 'log' | 'warn' | 'error'


/* istanbul ignore next */
export function report(type: reportType = 'log', label = 'unknown', message = ''): void {
  console[type](`[axios-extra] (${label}) ${message}`);
}

/* istanbul ignore next */
export function info(label: string, message: string): void {
  report('log', label, message);
}

/* istanbul ignore next */
export function warn(label: string, message: string): void {
  report('warn', label, message);
}

/* istanbul ignore next */
export function error(label: string, message: string): void {
  report('error', label, message);
}

export default {
  report,
  info,
  warn,
  error
};
