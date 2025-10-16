export const logger = {
  error: (...args: any[]) => {
    try {
      // Keep using console.error for now, but centralize here for future remote logging
      // eslint-disable-next-line no-console
      console.error(...args);
    } catch (_) {
      // swallow
    }
  },
  info: (..._args: any[]) => {},
  warn: (..._args: any[]) => {},
};
export default logger;
