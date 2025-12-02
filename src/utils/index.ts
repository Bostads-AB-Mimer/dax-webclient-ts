// Utility functions for DAX Web Client

export class ValidationUtils {
  static isValidApiKey(apiKey: string): boolean {
    return typeof apiKey === 'string' && apiKey.length >= 32;
  }

  static isValidPrivateKey(privateKey: string): boolean {
    return typeof privateKey === 'string' && privateKey.length >= 64;
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class DateUtils {
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  static parseISOString(dateString: string): Date {
    return new Date(dateString);
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static isExpired(createdAt: Date, maxAgeHours: number): boolean {
    const now = new Date();
    const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return diffInHours > maxAgeHours;
  }
}

export class RetryUtils {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retrying with exponential backoff
        const waitTime = delayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }
}

export class LoggerUtils {
  private static logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  static setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }

  static debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DAX-DEBUG] ${message}`, data);
    }
  }

  static info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.info(`[DAX-INFO] ${message}`, data);
    }
  }

  static warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(`[DAX-WARN] ${message}`, data);
    }
  }

  static error(message: string, error?: any): void {
    if (this.shouldLog('error')) {
      console.error(`[DAX-ERROR] ${message}`, error);
    }
  }

  private static shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
}