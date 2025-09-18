import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiResponse } from '../services/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    if (!isMountedRef.current) return null;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(...args);
      
      if (!isMountedRef.current) return null;

      if (response.success && response.data) {
        setState(prev => ({ ...prev, data: response.data, loading: false }));
        onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMessage = response.message || 'Request failed';
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        onError?.(errorMessage);
        return null;
      }
    } catch (error: any) {
      if (!isMountedRef.current) return null;

      // Don't set error if request was aborted
      if (error.name === 'AbortError') {
        return null;
      }

      const errorMessage = error.message || 'An unexpected error occurred';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      onError?.(errorMessage);
      return null;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}

// Hook for paginated data
interface UsePaginatedApiOptions extends UseApiOptions {
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginatedApiReturn<T> extends UseApiReturn<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refresh: () => void;
}

export function usePaginatedApi<T = any>(
  apiFunction: (page: number, limit: number, ...args: any[]) => Promise<ApiResponse<{
    data: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>>,
  options: UsePaginatedApiOptions = {}
): UsePaginatedApiReturn<T[]> {
  const { pageSize = 10, initialPage = 1, ...apiOptions } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const api = useApi(
    (page: number, limit: number, ...args: any[]) => apiFunction(page, limit, ...args),
    apiOptions
  );

  const executeWithPagination = useCallback(async (...args: any[]) => {
    const result = await api.execute(currentPage, pageSize, ...args);
    if (result && 'pagination' in result) {
      setPagination(result.pagination);
    }
    return result;
  }, [api.execute, currentPage, pageSize]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [pagination.hasNextPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [pagination.hasPrevPage]);

  const refresh = useCallback(() => {
    executeWithPagination();
  }, [executeWithPagination]);

  // Execute when page changes
  useEffect(() => {
    if (currentPage !== initialPage) {
      executeWithPagination();
    }
  }, [currentPage, executeWithPagination, initialPage]);

  return {
    ...api,
    execute: executeWithPagination,
    currentPage,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    hasNextPage: pagination.hasNextPage,
    hasPrevPage: pagination.hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    refresh,
  };
}

// Hook for form submission
interface UseFormApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
}

interface UseFormApiReturn<T> extends UseApiReturn<T> {
  submit: (data: any) => Promise<T | null>;
  isSubmitting: boolean;
}

export function useFormApi<T = any>(
  apiFunction: (data: any) => Promise<ApiResponse<T>>,
  options: UseFormApiOptions = {}
): UseFormApiReturn<T> {
  const { onSuccess, onError, resetOnSuccess = false } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const api = useApi(apiFunction, { onSuccess, onError });

  const submit = useCallback(async (data: any): Promise<T | null> => {
    setIsSubmitting(true);
    try {
      const result = await api.execute(data);
      if (result && resetOnSuccess) {
        api.reset();
      }
      return result;
    } finally {
      setIsSubmitting(false);
    }
  }, [api, resetOnSuccess]);

  return {
    ...api,
    submit,
    isSubmitting,
  };
}
