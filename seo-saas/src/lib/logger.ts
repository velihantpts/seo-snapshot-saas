// Structured logging for observability

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  event: string;
  timestamp: string;
  [key: string]: unknown;
}

function log(level: LogLevel, event: string, data?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };

  const output = JSON.stringify(entry);

  switch (level) {
    case 'error': console.error(output); break;
    case 'warn': console.warn(output); break;
    case 'debug': if (process.env.NODE_ENV !== 'production') console.debug(output); break;
    default: console.log(output);
  }
}

export const logger = {
  info: (event: string, data?: Record<string, unknown>) => log('info', event, data),
  warn: (event: string, data?: Record<string, unknown>) => log('warn', event, data),
  error: (event: string, data?: Record<string, unknown>) => log('error', event, data),
  debug: (event: string, data?: Record<string, unknown>) => log('debug', event, data),

  // Domain-specific helpers
  analysis: (url: string, duration: number, score: number, userId?: string) =>
    log('info', 'analysis.completed', { url, duration, score, userId, hasUser: !!userId }),

  analysisError: (url: string, error: string, userId?: string) =>
    log('error', 'analysis.failed', { url, error, userId }),

  rateLimit: (ip: string, endpoint: string) =>
    log('warn', 'rate_limit.exceeded', { ip, endpoint }),

  auth: (event: string, userId?: string, provider?: string) =>
    log('info', `auth.${event}`, { userId, provider }),

  stripe: (event: string, data?: Record<string, unknown>) =>
    log('info', `stripe.${event}`, data),

  ssrf: (url: string, ip: string) =>
    log('warn', 'ssrf.blocked', { url, ip }),
};
