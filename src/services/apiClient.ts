import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, HTTP_STATUS } from './config';
import { ApiResponse, RequestConfig } from './types';
import { tokenUtils, errorUtils, requestUtils } from './utils';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token to requests
        const token = tokenUtils.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Handle FormData requests - remove Content-Type to let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        // Add request timestamp
        config.metadata = { startTime: Date.now() };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful requests in development
        if (process.env.NODE_ENV === 'development') {
          const duration = Date.now() - response.config.metadata?.startTime;
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
          const duration = Date.now() - (originalRequest?.metadata?.startTime || 0);
          console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - ${error.response?.status} (${duration}ms)`, error.response?.data);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Attempt to refresh token
            await this.refreshToken();
            this.processQueue(null);
            
            // Retry original request
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            tokenUtils.removeToken();
            
            // Redirect to login or handle auth failure
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  private async refreshToken(): Promise<void> {
    // Implement token refresh logic here
    // For now, we'll just throw an error to force re-authentication
    throw new Error('Token refresh not implemented');
  }

  private handleAuthFailure(): void {
    // Clear tokens and redirect to login
    tokenUtils.removeToken();
    
    // Dispatch custom event for auth failure
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    // Redirect to login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Generic request method
  async request<T = any>(
    config: AxiosRequestConfig & RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await requestUtils.retryRequest(
        () => this.client.request(config),
        config.retries || API_CONFIG.RETRY_ATTEMPTS,
        API_CONFIG.RETRY_DELAY
      );

      return requestUtils.validateResponse(response.data);
    } catch (error) {
      const apiError = errorUtils.handleApiError(error);
      errorUtils.logError(apiError, config.url);
      throw apiError;
    }
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // File upload method
  async upload<T = any>(url: string, file: File, config?: RequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Download method
  async download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    try {
      const response = await this.client.get(url, {
        ...config,
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      const apiError = errorUtils.handleApiError(error);
      errorUtils.logError(apiError, url);
      throw apiError;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
