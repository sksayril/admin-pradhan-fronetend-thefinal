import { apiClient } from './apiClient';
import { 
  ApiResponse, 
  CreateFeeRequestRequest, 
  UpdateFeeRequestRequest, 
  FeeRequestFilters,
  FeeRequestsResponse,
  FeeRequestResponse,
  FeeStatisticsResponse,
  StudentsWithEnrollmentsResponse,
  RecordPaymentRequest,
  RecordPaymentResponse,
  PaymentHistoryResponse,
  StudentFeeRequestsResponse,
  FeeStatisticsEnhancedResponse
} from './types';

export const feeService = {
  /**
   * Create a new fee request
   */
  async createFeeRequest(feeRequestData: CreateFeeRequestRequest): Promise<ApiResponse<FeeRequestResponse['data']>> {
    try {
      const response = await apiClient.post('/fee-management/requests/create', feeRequestData);
      return response;
    } catch (error) {
      console.error('Error creating fee request:', error);
      throw error;
    }
  },

  /**
   * Get all fee requests with filtering and pagination
   */
  async getAllFeeRequests(
    page: number = 1,
    limit: number = 10,
    filters: FeeRequestFilters = {},
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<ApiResponse<FeeRequestsResponse['data']>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await apiClient.get(`/fee-management/requests?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching fee requests:', error);
      throw error;
    }
  },

  /**
   * Get fee request by ID
   */
  async getFeeRequestById(feeRequestId: string): Promise<ApiResponse<FeeRequestResponse['data']>> {
    try {
      const response = await apiClient.get(`/fee-management/requests/${feeRequestId}`);
      return response;
    } catch (error) {
      console.error('Error fetching fee request:', error);
      throw error;
    }
  },

  /**
   * Update fee request
   */
  async updateFeeRequest(
    feeRequestId: string, 
    updateData: UpdateFeeRequestRequest
  ): Promise<ApiResponse<FeeRequestResponse['data']>> {
    try {
      const response = await apiClient.put(`/fee-management/requests/${feeRequestId}`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating fee request:', error);
      throw error;
    }
  },

  /**
   * Delete fee request
   */
  async deleteFeeRequest(feeRequestId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(`/fee-management/requests/${feeRequestId}`);
      return response;
    } catch (error) {
      console.error('Error deleting fee request:', error);
      throw error;
    }
  },

  /**
   * Get fee statistics
   */
  async getFeeStatistics(): Promise<ApiResponse<FeeStatisticsResponse['data']>> {
    try {
      const response = await apiClient.get('/fee-management/statistics');
      return response;
    } catch (error) {
      console.error('Error fetching fee statistics:', error);
      throw error;
    }
  },

  /**
   * Get fee requests by student ID with summary
   */
  async getFeeRequestsByStudentId(studentId: string): Promise<ApiResponse<StudentFeeRequestsResponse['data']>> {
    try {
      const response = await apiClient.get(`/fee-management/requests/student/${studentId}`);
      return response;
    } catch (error) {
      console.error('Error fetching student fee requests:', error);
      throw error;
    }
  },

  /**
   * Get students with their enrollment data for fee management
   */
  async getStudentsWithEnrollments(): Promise<ApiResponse<StudentsWithEnrollmentsResponse['data']>> {
    try {
      const response = await apiClient.get('/user-management/students/with-enrollments');
      return response;
    } catch (error) {
      console.error('Error fetching students with enrollments:', error);
      throw error;
    }
  },

  /**
   * Record a payment for a fee request
   */
  async recordPayment(paymentData: RecordPaymentRequest): Promise<ApiResponse<RecordPaymentResponse['data']>> {
    try {
      const response = await apiClient.post('/fee-management/payments/record', paymentData);
      return response;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  },

  /**
   * Get payment history with filtering and pagination
   */
  async getPaymentHistory(
    page: number = 1,
    limit: number = 10,
    filters: {
      studentId?: string;
      courseId?: string;
      batchId?: string;
      paymentMethod?: string;
      paymentStatus?: string;
    } = {},
    sortBy: string = 'paymentDate',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<ApiResponse<PaymentHistoryResponse['data']>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await apiClient.get(`/fee-management/payments/history?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  /**
   * Get enhanced fee statistics
   */
  async getEnhancedFeeStatistics(): Promise<ApiResponse<FeeStatisticsEnhancedResponse['data']>> {
    try {
      const response = await apiClient.get('/fee-management/statistics');
      return response;
    } catch (error) {
      console.error('Error fetching enhanced fee statistics:', error);
      throw error;
    }
  },

  /**
   * Get fee status color for UI display
   */
  getFeeStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Get payment method color for UI display
   */
  getPaymentMethodColor(method: string): string {
    switch (method.toLowerCase()) {
      case 'online':
        return 'bg-blue-100 text-blue-800';
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'bank_transfer':
        return 'bg-purple-100 text-purple-800';
      case 'cheque':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Get payment status color for UI display
   */
  getPaymentStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Check if fee request is overdue
   */
  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  },

  /**
   * Format currency amount
   */
  formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }
};
