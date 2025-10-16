import pino from 'pino';

const transport =
  process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } } as any
    : undefined;

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  transport ? pino.transport(transport) : undefined,
);

// Silence logs in tests
if (process.env.NODE_ENV === 'test') {
  logger.level = 'silent';
}

export default logger;
