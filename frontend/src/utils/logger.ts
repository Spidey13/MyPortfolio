/**
 * Professional Frontend Logging Utility
 * Features: Structured logging, error tracking, performance monitoring, user analytics
 */

interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration: number;
    operation: string;
  };
  userAgent: string;
  url: string;
  environment: string;
}

class Logger {
  private sessionId: string;
  private environment: string;
  private enableConsole: boolean;
  private enableRemote: boolean;
  private maxLogs: number = 1000;
  private logs: LogEntry[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.environment = import.meta.env.MODE || 'development';
    this.enableConsole = this.environment === 'development' || import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true';
    this.enableRemote = import.meta.env.VITE_ENABLE_REMOTE_LOGS === 'true';
    
    // Initialize error tracking
    this.setupGlobalErrorHandling();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    context?: LogContext,
    error?: Error,
    performance?: { duration: number; operation: string }
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        sessionId: this.sessionId,
        ...context,
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      environment: this.environment,
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    if (performance) {
      entry.performance = performance;
    }

    return entry;
  }

  private outputToConsole(entry: LogEntry): void {
    if (!this.enableConsole) return;

    const style = this.getConsoleStyle(entry.level);
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    
    if (entry.error) {
      console.group(`${prefix} ${entry.message}`);
      console.error('Error:', entry.error);
      if (entry.context) console.log('Context:', entry.context);
      console.groupEnd();
    } else if (entry.performance) {
      console.log(
        `%c${prefix} ${entry.message}`,
        style,
        `(${entry.performance.duration.toFixed(2)}ms)`,
        entry.context
      );
    } else {
      console.log(`%c${prefix} ${entry.message}`, style, entry.context);
    }
  }

  private getConsoleStyle(level: LogEntry['level']): string {
    const styles = {
      debug: 'color: #888; font-weight: normal;',
      info: 'color: #0066cc; font-weight: bold;',
      warn: 'color: #ff8c00; font-weight: bold;',
      error: 'color: #cc0000; font-weight: bold;',
    };
    return styles[level];
  }

  private storeLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Maintain log size limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in localStorage for persistence
    try {
      const recentLogs = this.logs.slice(-100); // Keep last 100 logs in localStorage
      localStorage.setItem('portfolio_logs', JSON.stringify(recentLogs));
    } catch (e) {
      // localStorage full or not available
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.enableRemote) return;

    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || '/api';
      
      // Only send warnings and errors to backend to reduce noise
      if (entry.level === 'warn' || entry.level === 'error') {
        await fetch(`${backendUrl}/api/v1/frontend-logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entry),
        });
      }
    } catch (e) {
      // Silent fail for remote logging
      console.warn('Failed to send log to backend:', e);
    }
  }

  private log(level: LogEntry['level'], message: string, context?: LogContext, error?: Error): void {
    const entry = this.createLogEntry(level, message, context, error);
    
    this.outputToConsole(entry);
    this.storeLog(entry);
    this.sendToRemote(entry);
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error);
  }

  // Performance monitoring
  performance(operation: string, duration: number, context?: LogContext): void {
    const entry = this.createLogEntry('info', `Performance: ${operation}`, context, undefined, {
      duration,
      operation,
    });
    
    this.outputToConsole(entry);
    this.storeLog(entry);
    
    // Send slow operations to backend
    if (duration > 1000) { // Operations slower than 1 second
      this.sendToRemote(entry);
    }
  }

  // User interaction tracking
  userAction(action: string, component: string, details?: Record<string, any>): void {
    this.info(`User action: ${action}`, {
      component,
      action,
      ...details,
    });
  }

  // API call logging
  apiCall(method: string, url: string, duration: number, status: number, error?: Error): void {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
    const message = `API ${method} ${url} - ${status}`;
    
    this.log(level, message, {
      api: {
        method,
        url,
        status,
        duration,
      },
    }, error);
  }

  // Component lifecycle logging
  componentMount(componentName: string, props?: Record<string, any>): void {
    this.debug(`Component mounted: ${componentName}`, {
      component: componentName,
      lifecycle: 'mount',
      props,
    });
  }

  componentUnmount(componentName: string): void {
    this.debug(`Component unmounted: ${componentName}`, {
      component: componentName,
      lifecycle: 'unmount',
    });
  }

  // Get stored logs
  getLogs(level?: LogEntry['level']): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('portfolio_logs');
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Setup global error handling
  private setupGlobalErrorHandling(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error(
        'Unhandled promise rejection',
        new Error(event.reason),
        { source: 'unhandledrejection' }
      );
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.error(
        'Uncaught error',
        new Error(event.message),
        {
          source: 'uncaught',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      );
    });

    // Performance observer for slow operations
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 100) { // Operations slower than 100ms
              this.performance(entry.name, entry.duration, {
                entryType: entry.entryType,
              });
            }
          }
        });
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Utility functions for easy importing
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context),
  performance: (operation: string, duration: number, context?: LogContext) => logger.performance(operation, duration, context),
  userAction: (action: string, component: string, details?: Record<string, any>) => logger.userAction(action, component, details),
  apiCall: (method: string, url: string, duration: number, status: number, error?: Error) => logger.apiCall(method, url, duration, status, error),
  componentMount: (componentName: string, props?: Record<string, any>) => logger.componentMount(componentName, props),
  componentUnmount: (componentName: string) => logger.componentUnmount(componentName),
};

// Performance timing utility
export const withPerformance = async <T>(
  operation: string,
  fn: () => Promise<T> | T,
  context?: LogContext
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    logger.performance(operation, duration, context);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${operation} failed`, error as Error, { ...context, duration });
    throw error;
  }
};

export default logger;
