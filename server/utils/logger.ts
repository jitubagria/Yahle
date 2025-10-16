// server/utils/logger.ts
const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
};

// ✅ Export compatible with both require() and import forms
// Make CommonJS consumers receive an object with a `logger` property
// and default export available as .default
// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = { logger };
// ensure default points to the same logger
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(module.exports as any).default = logger;
export { logger };
export default logger;
