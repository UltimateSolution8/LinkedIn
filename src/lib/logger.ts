// Frontend logging utility
// Structured logging for user interactions and API calls

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.apiBaseUrl = import.meta.env.VITE_RIXLY_API_BASE_URL;
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Base logging method
  log(level, event, data = {}) {
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
  logUserAction(action, details = {}) {
    return this.log('info', `user_${action}`, {
      ...details,
      timestamp: Date.now()
    });
  }

  // Page navigation
  logPageView(page, previousPage = null) {
    return this.log('info', 'page_view', {
      page,
      previousPage,
      timestamp: Date.now()
    });
  }

  // API calls
  logApiCall(method, endpoint, status, duration, error = null) {
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
  logFormSubmit(formName, success = true, error = null) {
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
  logAuthEvent(event, userId = null, metadata = {}) {
    return this.log('info', `auth_${event}`, {
      userId,
      ...metadata,
      timestamp: Date.now()
    });
  }

  // Password reset events
  logPasswordResetEvent(event, metadata = {}) {
    return this.log('info', `password_${event}`, {
      ...metadata,
      timestamp: Date.now()
    });
  }

  // Error logging
  logError(error, context = {}) {
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
  logPerformance(metric, value, additionalData = {}) {
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