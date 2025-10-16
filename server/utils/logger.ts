// server/utils/logger.ts
// Lightweight compatibility shim used during migration. Prefer importing
// the production pino logger at `server/lib/logger.ts`.

function tryLoadLibLogger() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any
    const lib = require('../lib/logger');
    // lib may export default or named logger
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candidate: any = lib?.default ?? lib?.logger ?? lib;
    if (candidate && (typeof candidate.info === 'function' || typeof candidate.log === 'function')) {
      return candidate;
    }
  } catch (_) {
    // ignore — fallback to process streams below
  }
  return null;
}

const _libLogger = tryLoadLibLogger();

function formatArgs(args: any[]) {
  return args.map(a => {
    if (typeof a === 'string') return a;
    try { return JSON.stringify(a); } catch (_) { return String(a); }
  }).join(' ');
}

const logger = {
  info: (...args: any[]) => {
    if (_libLogger && typeof _libLogger.info === 'function') return _libLogger.info(...args);
    process.stdout.write('[INFO] ' + formatArgs(args) + '\n');
  },
  warn: (...args: any[]) => {
    if (_libLogger && typeof _libLogger.warn === 'function') return _libLogger.warn(...args);
    process.stderr.write('[WARN] ' + formatArgs(args) + '\n');
  },
  error: (...args: any[]) => {
    if (_libLogger && typeof _libLogger.error === 'function') return _libLogger.error(...args);
    process.stderr.write('[ERROR] ' + formatArgs(args) + '\n');
  },
};

// Export compatible with both require() and import forms
// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = { logger };
// ensure default points to the same logger
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(module.exports as any).default = logger;
export { logger };
export default logger;
