import { ApiError, TokenData } from './types';
import { STORAGE_KEYS } from './config';

// Token Management Utilities
export const tokenUtils = {
  // Save token to localStorage
  saveToken: (token: string): void => {
    const tokenData: TokenData = {
      token,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(tokenData));
  },

  // Get token from localStorage
  getToken: (): string | null => {
    try {
      const tokenData = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!tokenData) return null;

      const parsed: TokenData = JSON.parse(tokenData);
      
      // Check if token is expired
      if (Date.now() > parsed.expiresAt) {
        tokenUtils.removeToken();
        return null;
      }

      return parsed.token;
    } catch (error) {
      console.error('Error parsing token:', error);
      tokenUtils.removeToken();
      return null;
    }
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return tokenUtils.getToken() !== null;
  },
};

// Error Handling Utilities
export const errorUtils = {
  // Create standardized error object
  createError: (message: string, status?: number, code?: string): ApiError => {
    return {
      message,
      status,
      code,
    };
  },

  // Handle API errors
  handleApiError: (error: any): any => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // For 400 validation errors, preserve the full response structure
      if (status === 400 && data && (data.errors || data.success === false)) {
        return {
          success: false,
          message: data.message || 'Validation failed',
          errors: data.errors || [],
          status,
          code: data.code,
        };
      }
      
      // For other errors, return the standard ApiError format
      return {
        message: data?.message || data?.error || 'An error occurred',
        status,
        code: data?.code,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        code: 'NETWORK_ERROR',
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
    }
  },

  // Log error for debugging
  logError: (error: ApiError, context?: string): void => {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, {
      message: error.message,
      status: error.status,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
  },
};

// Request Utilities
export const requestUtils = {
  // Create authorization header
  getAuthHeader: (): Record<string, string> => {
    const token = tokenUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Retry request with exponential backoff
  retryRequest: async <T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }

    throw lastError;
  },

  // Validate response
  validateResponse: <T>(response: any): T => {
    if (!response) {
      throw errorUtils.createError('No response received');
    }

    if (response.success === false) {
      throw errorUtils.createError(
        response.message || 'Request failed',
        response.status,
        response.code
      );
    }

    return response;
  },
};

// Data Transformation Utilities
export const dataUtils = {
  // Convert form data to JSON
  formToJson: (formData: FormData): Record<string, any> => {
    const json: Record<string, any> = {};
    formData.forEach((value, key) => {
      json[key] = value;
    });
    return json;
  },

  // Sanitize input data
  sanitizeInput: (data: any): any => {
    if (typeof data === 'string') {
      return data.trim();
    }
    if (Array.isArray(data)) {
      return data.map(item => dataUtils.sanitizeInput(item));
    }
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      Object.keys(data).forEach(key => {
        sanitized[key] = dataUtils.sanitizeInput(data[key]);
      });
      return sanitized;
    }
    return data;
  },

  // Format date for API
  formatDate: (date: Date | string): string => {
    const d = new Date(date);
    return d.toISOString();
  },
};
