import { apiClient } from './apiClient';
import { ApiResponse } from './types';

// Loan Types
export interface LoanRequest {
  requestId: string;
  memberId: {
    firstName: string;
    lastName: string;
    memberId: string;
    email: string;
  };
  loanAmount: number;
  loanPurpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  disbursedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  disbursedAmount?: number;
  disbursementMethod?: string;
  disbursementReference?: string;
  emiCount?: number;
  paidEMIs?: number;
  pendingEMIs?: number;
}

export interface LoanStatistics {
  statusBreakdown: Array<{
    status: string;
    count: number;
    totalAmount: number;
    averageAmount: number;
  }>;
  totalRequests: number;
  totalLoanAmount: number;
  additionalStats: {
    totalPendingRequests: number;
    totalApprovedRequests: number;
    totalDisbursedLoans: number;
  };
}

export interface MemberLoanSummary {
  member: {
    name: string;
    memberId: string;
    email: string;
  };
  totalLoans: number;
  totalLoanAmount: number;
  totalDisbursedAmount: number;
  statusBreakdown: {
    pending: number;
    approved: number;
    disbursed: number;
    completed: number;
    rejected: number;
  };
  loanRequests: Array<{
    requestId: string;
    loanAmount: number;
    disbursedAmount: number;
    status: string;
    emiCount: number;
    paidEMIs: number;
    pendingEMIs: number;
  }>;
}

export interface LoanFilters {
  status?: string;
  memberId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface LoanRequestsResponse {
  loanRequests: LoanRequest[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRequests: number;
  };
}

export interface LoanApprovalRequest {
  approvalNotes: string;
}

export interface LoanRejectionRequest {
  rejectionReason: string;
}

export interface LoanDisbursementRequest {
  disbursedAmount: number;
  disbursementMethod: string;
  disbursementReference: string;
}

export interface LoanApprovalResponse {
  requestId: string;
  status: string;
  approvedAt: string;
  approvedBy: string;
}

export interface LoanRejectionResponse {
  requestId: string;
  status: string;
  rejectedAt: string;
  rejectionReason: string;
}

export interface LoanDisbursementResponse {
  requestId: string;
  status: string;
  disbursedAmount: number;
  disbursedAt: string;
  disbursementMethod: string;
}

export const loanService = {
  /**
   * Get all loan requests
   */
  async getLoanRequests(filters: LoanFilters = {}): Promise<ApiResponse<LoanRequestsResponse>> {
    try {
      const params = new URLSearchParams();
      
      // Set defaults
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 10).toString());

      // Add optional filters
      if (filters.status) params.append('status', filters.status);
      if (filters.memberId) params.append('memberId', filters.memberId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await apiClient.get(`/admin/loans?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching loan requests:', error);
      throw error;
    }
  },

  /**
   * Approve loan request
   */
  async approveLoanRequest(
    requestId: string,
    approvalData: LoanApprovalRequest
  ): Promise<ApiResponse<LoanApprovalResponse>> {
    try {
      const response = await apiClient.put(`/admin/loans/${requestId}/approve`, approvalData);
      return response;
    } catch (error) {
      console.error('Error approving loan request:', error);
      throw error;
    }
  },

  /**
   * Reject loan request
   */
  async rejectLoanRequest(
    requestId: string,
    rejectionData: LoanRejectionRequest
  ): Promise<ApiResponse<LoanRejectionResponse>> {
    try {
      const response = await apiClient.put(`/admin/loans/${requestId}/reject`, rejectionData);
      return response;
    } catch (error) {
      console.error('Error rejecting loan request:', error);
      throw error;
    }
  },

  /**
   * Disburse loan
   */
  async disburseLoan(
    requestId: string,
    disbursementData: LoanDisbursementRequest
  ): Promise<ApiResponse<LoanDisbursementResponse>> {
    try {
      const response = await apiClient.put(`/admin/loans/${requestId}/disburse`, disbursementData);
      return response;
    } catch (error) {
      console.error('Error disbursing loan:', error);
      throw error;
    }
  },

  /**
   * Get loan statistics
   */
  async getLoanStatistics(filters: LoanFilters = {}): Promise<ApiResponse<LoanStatistics>> {
    try {
      const params = new URLSearchParams();

      // Add optional filters
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await apiClient.get(`/admin/loans/statistics/overview?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching loan statistics:', error);
      throw error;
    }
  },

  /**
   * Get member loan summary
   */
  async getMemberLoanSummary(memberId: string): Promise<ApiResponse<MemberLoanSummary>> {
    try {
      const response = await apiClient.get(`/admin/loans/member/${memberId}/summary`);
      return response;
    } catch (error) {
      console.error('Error fetching member loan summary:', error);
      throw error;
    }
  },

  /**
   * Get loan status color for UI display
   */
  getLoanStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'disbursed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Get disbursement method color for UI display
   */
  getDisbursementMethodColor(method: string): string {
    switch (method?.toLowerCase()) {
      case 'bank_transfer':
        return 'bg-blue-100 text-blue-800';
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'cheque':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format date and time for display
   */
  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Get loan purpose color for UI display
   */
  getLoanPurposeColor(purpose: string): string {
    switch (purpose?.toLowerCase()) {
      case 'personal':
        return 'bg-blue-100 text-blue-800';
      case 'business':
        return 'bg-green-100 text-green-800';
      case 'education':
        return 'bg-purple-100 text-purple-800';
      case 'medical':
        return 'bg-red-100 text-red-800';
      case 'home':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Calculate EMI progress percentage
   */
  calculateEMIProgress(paidEMIs: number, totalEMIs: number): number {
    if (totalEMIs === 0) return 0;
    return Math.round((paidEMIs / totalEMIs) * 100);
  },

  /**
   * Get EMI progress color based on completion percentage
   */
  getEMIProgressColor(percentage: number): string {
    if (percentage >= 100) return 'bg-green-100 text-green-800';
    if (percentage >= 75) return 'bg-blue-100 text-blue-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 25) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }
};
