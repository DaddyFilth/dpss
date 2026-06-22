import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
  formatters: {
    level: (label) => ({ level: label }),
  },
  mixin() {
    return {
      requestId: crypto.randomUUID(),
    };
  },
});

export function createRequestLogger(requestId?: string) {
  return logger.child({
    requestId: requestId || crypto.randomUUID(),
  });
}

export default logger;
