type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors
    if (this.isProduction) {
      return level === 'error';
    }
    // In development, log everything
    return true;
  }

  info(message: string, data?: unknown): void {
    if (!this.shouldLog('info')) return;
    
    if (this.isDevelopment) {
      console.log(`ℹ️ [INFO] ${message}`, data ?? '');
    }
  }

  warn(message: string, data?: unknown): void {
    if (!this.shouldLog('warn')) return;
    
    if (this.isDevelopment) {
      console.warn(`⚠️ [WARN] ${message}`, data ?? '');
    }
  }

  error(message: string, data?: unknown): void {
    if (!this.shouldLog('error')) return;
    
    if (this.isDevelopment) {
      console.error(`🚨 [ERROR] ${message}`, data ?? '');
    } else {
      const logEntry = this.formatLog('error', message, data);
      console.error(JSON.stringify(logEntry));
    }
  }

  debug(message: string, data?: unknown): void {
    if (!this.shouldLog('debug')) return;
    
    if (this.isDevelopment) {
      console.debug(`🔍 [DEBUG] ${message}`, data ?? '');
    }
  }
}

export const logger = new Logger();