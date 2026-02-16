// Frontend logging utility
// Structured logging for user interactions and API calls

class Logger {
  private isDevelopment: boolean;
  private sessionId: string;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.sessionId = this.generateSessionId();
  }

  generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Base logging method
  log(level: string, event: string, data: Record<string, unknown> = {}): Record<string, unknown> {
    const logEntry = {
      time: new Date().toISOString(),
      level,
      service: 'rixly-frontend',
      env: this.isDevelopment ? 'development' : 'production',
      sessionId: this.sessionId,
      event,
      data: {
        ...data,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      }
    };

    // Always log to console in development
    if (this.isDevelopment) {
      console.log(`[${level.toUpperCase()}] ${event}:`, logEntry);
    }

    // In production, you could send to logging service
    // For now, we'll just use console with structured format
    if (!this.isDevelopment) {
      console.log(JSON.stringify(logEntry));
    }

    return logEntry;
  }

  // User interaction events
  logUserAction(action: string, details: Record<string, unknown> = {}): Record<string, unknown> {
    return this.log('info', `user_${action}`, {
      ...details,
      timestamp: Date.now()
    });
  }

  // Page navigation
  logPageView(page: string, previousPage: string | null = null): Record<string, unknown> {
    return this.log('info', 'page_view', {
      page,
      previousPage,
      timestamp: Date.now()
    });
  }

  // API calls
  logApiCall(
    method: string,
    endpoint: string,
    status: number,
    duration: number,
    error: { message: string; name: string } | null = null
  ): Record<string, unknown> {
    const level = status >= 400 ? 'error' : 'info';
    return this.log(level, 'api_call', {
      method: method.toUpperCase(),
      endpoint,
      status,
      duration,
      error: error ? {
        message: error.message,
        name: error.name
      } : null,
      timestamp: Date.now()
    });
  }

  // Form interactions
  logFormSubmit(
    formName: string,
    success = true,
    error: { message: string; field?: string } | null = null
  ): Record<string, unknown> {
    const level = success ? 'info' : 'warn';
    return this.log(level, `form_${success ? 'submitted' : 'error'}`, {
      formName,
      success,
      error: error ? {
        message: error.message,
        field: error.field
      } : null,
      timestamp: Date.now()
    });
  }

  // Authentication events
  logAuthEvent(
    event: string,
    userId: string | null = null,
    metadata: Record<string, unknown> = {}
  ): Record<string, unknown> {
    return this.log('info', `auth_${event}`, {
      userId,
      ...metadata,
      timestamp: Date.now()
    });
  }

  // Password reset events
  logPasswordResetEvent(event: string, metadata: Record<string, unknown> = {}): Record<string, unknown> {
    return this.log('info', `password_${event}`, {
      ...metadata,
      timestamp: Date.now()
    });
  }

  // Error logging
  logError(error: Error, context: Record<string, unknown> = {}): Record<string, unknown> {
    return this.log('error', 'client_error', {
      error: {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        name: error.name
      },
      context,
      timestamp: Date.now()
    });
  }

  // Performance logging
  logPerformance(metric: string, value: number, additionalData: Record<string, unknown> = {}): Record<string, unknown> {
    return this.log('info', 'performance_metric', {
      metric,
      value,
      ...additionalData,
      timestamp: Date.now()
    });
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;
