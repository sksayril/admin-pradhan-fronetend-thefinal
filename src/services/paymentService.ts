import { apiClient } from './apiClient';
import { ApiResponse } from './types';

// Payment Types
export interface PendingCashPayment {
  paymentId: string;
  transactionId: string | null;
  amount: number;
  paymentType: 'cash';
  paymentMethod: 'cash';
  status: 'pending';
  verificationStatus: 'pending';
  paymentDate: string;
  paymentFor: 'emi';
  emiNumber: number;
  screenshots: number;
  remarks: string;
  memberDetails: {
    name: string;
    memberId: string;
    email: string;
    phoneNumber: string;
  };
  investmentDetails: {
    investmentId: string;
    planName: string;
    planType: string;
  };
}

export interface PendingEMI {
  emiId: string;
  emiNumber: number;
  emiAmount: number;
  dueDate: string;
  status: 'pending';
  paidAmount: number;
  penaltyAmount: number;
  totalPaidAmount: number;
  paidDate: string | null;
  isOverdue: boolean;
  isInGracePeriod: boolean;
  remindersCount: number;
  paymentIds: string[];
  memberDetails: {
    name: string;
    memberId: string;
    email: string;
    phoneNumber: string;
  };
  investmentDetails: {
    investmentId: string;
    planName: string;
    planType: string;
  };
}

export interface EMIMonthlyGroup {
  month: number;
  year: number;
  monthName: string;
  emiCount: number;
  totalAmount: number;
  totalPenalty: number;
  emis: PendingEMI[];
}

export interface MemberPaymentSummary {
  memberDetails: {
    memberId: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  investmentSummary: {
    totalInvestments: number;
    investments: Array<{
      investmentId: string;
      planName: string;
      planType: string;
      principalAmount: number;
      expectedMaturityAmount: number;
      emiProgress: {
        total: number;
        paid: number;
        pending: number;
        overdue: number;
      };
      paymentSummary: {
        totalPaid: number;
        totalPending: number;
        completionPercentage: number;
      };
      nextDueDate: string;
      status: string;
    }>;
  };
  paymentSummary: {
    totalPayments: number;
    cashPayments: number;
    onlinePayments: number;
    totalPaidAmount: number;
    pendingPayments: number;
  };
}

export interface PaymentStatistics {
  paymentStatistics: {
    totalPayments: number;
    totalAmount: number;
    completedPayments: number;
    completedAmount: number;
    pendingPayments: number;
    pendingAmount: number;
    failedPayments: number;
    failedAmount: number;
  };
  emiStatistics: {
    totalEMIs: number;
    totalEMIAmount: number;
    paidEMIs: number;
    paidAmount: number;
    pendingEMIs: number;
    pendingAmount: number;
    overdueEMIs: number;
    overdueAmount: number;
    totalPenaltyAmount: number;
  };
  insights: {
    totalCashPayments: number;
    totalOnlinePayments: number;
    pendingCashPayments: number;
    pendingVerifications: number;
    cashVsOnlineRatio: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface PendingCashPaymentsResponse {
  pendingPayments: PendingCashPayment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPendingPayments: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PendingEMIsResponse {
  pendingEMIs: PendingEMI[];
  summary: {
    totalPendingEMIs: number;
    totalPendingAmount: number;
    totalPenaltyAmount: number;
    overdueEMIs: number;
    gracePeriodEMIs: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPendingEMIs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface EMIMonthlyResponse {
  pendingEMIsByMonth: EMIMonthlyGroup[];
  overallSummary: {
    totalPendingEMIs: number;
    totalPendingAmount: number;
    totalPenaltyAmount: number;
    monthsWithPendingEMIs: number;
  };
}

export interface CashPaymentVerificationRequest {
  verificationStatus: 'verified' | 'rejected';
  remarks: string;
  receiptNumber?: string;
  receivedAmount: number;
}

export interface CashPaymentVerificationResponse {
  paymentDetails: {
    paymentId: string;
    status: string;
    verificationStatus: string;
    amount: number;
  };
  verificationDetails: {
    verificationStatus: string;
    verifiedBy: string;
    verifiedDate: string;
    remarks: string;
    receiptNumber?: string;
  };
  memberDetails: {
    name: string;
    memberId: string;
    email: string;
  };
  investmentDetails: {
    investmentId: string;
    planName: string;
    planType: string;
  };
}

export interface PaymentFilters {
  memberId?: string;
  investmentId?: string;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  overdue?: boolean;
  page?: number;
  limit?: number;
}

export const paymentService = {
  /**
   * Get pending cash payments
   */
  async getPendingCashPayments(filters: PaymentFilters = {}): Promise<ApiResponse<PendingCashPaymentsResponse>> {
    try {
      const params = new URLSearchParams();
      
      // Set defaults
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 10).toString());

      // Add optional filters
      if (filters.memberId) params.append('memberId', filters.memberId);
      if (filters.investmentId) params.append('investmentId', filters.investmentId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await apiClient.get(`/admin/payments/pending-cash-payments?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching pending cash payments:', error);
      throw error;
    }
  },

  /**
   * Verify cash payment
   */
  async verifyCashPayment(
    paymentId: string,
    verificationData: CashPaymentVerificationRequest
  ): Promise<ApiResponse<CashPaymentVerificationResponse>> {
    try {
      const response = await apiClient.put(`/admin/payments/verify-cash/${paymentId}`, verificationData);
      return response;
    } catch (error) {
      console.error('Error verifying cash payment:', error);
      throw error;
    }
  },

  /**
   * Get all pending EMIs
   */
  async getPendingEMIs(filters: PaymentFilters = {}): Promise<ApiResponse<PendingEMIsResponse>> {
    try {
      const params = new URLSearchParams();
      
      // Set defaults
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 10).toString());

      // Add optional filters
      if (filters.memberId) params.append('memberId', filters.memberId);
      if (filters.investmentId) params.append('investmentId', filters.investmentId);
      if (filters.month) params.append('month', filters.month.toString());
      if (filters.year) params.append('year', filters.year.toString());
      if (filters.overdue !== undefined) params.append('overdue', filters.overdue.toString());

      const response = await apiClient.get(`/admin/payments/pending-emis?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching pending EMIs:', error);
      throw error;
    }
  },

  /**
   * Get pending EMIs grouped by month
   */
  async getPendingEMIsByMonth(filters: PaymentFilters = {}): Promise<ApiResponse<EMIMonthlyResponse>> {
    try {
      const params = new URLSearchParams();

      // Add optional filters
      if (filters.memberId) params.append('memberId', filters.memberId);
      if (filters.investmentId) params.append('investmentId', filters.investmentId);

      const response = await apiClient.get(`/admin/payments/pending-emis/monthly?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching pending EMIs by month:', error);
      throw error;
    }
  },

  /**
   * Get member payment summary
   */
  async getMemberPaymentSummary(memberId: string): Promise<ApiResponse<MemberPaymentSummary>> {
    try {
      const response = await apiClient.get(`/admin/payments/member-summary/${memberId}`);
      return response;
    } catch (error) {
      console.error('Error fetching member payment summary:', error);
      throw error;
    }
  },

  /**
   * Get payment statistics
   */
  async getPaymentStatistics(filters: PaymentFilters = {}): Promise<ApiResponse<PaymentStatistics>> {
    try {
      const params = new URLSearchParams();

      // Add optional filters
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.memberId) params.append('memberId', filters.memberId);
      if (filters.investmentId) params.append('investmentId', filters.investmentId);

      const response = await apiClient.get(`/admin/payments/statistics?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      throw error;
    }
  },

  /**
   * Get payment status color for UI display
   */
  getPaymentStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'in_grace_period':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Get EMI status color for UI display
   */
  getEMIStatusColor(emi: PendingEMI): string {
    if (emi.isOverdue) {
      return 'bg-red-100 text-red-800';
    }
    if (emi.isInGracePeriod) {
      return 'bg-orange-100 text-orange-800';
    }
    if (emi.status === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
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
   * Check if EMI is overdue
   */
  isEMIOverdue(dueDate: string): boolean {
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  },

  /**
   * Check if EMI is in grace period
   */
  isEMIInGracePeriod(dueDate: string, gracePeriodDays: number = 7): boolean {
    const due = new Date(dueDate);
    const graceEnd = new Date(due.getTime() + (gracePeriodDays * 24 * 60 * 60 * 1000));
    const now = new Date();
    return now > due && now <= graceEnd;
  },

  /**
   * Calculate penalty amount
   */
  calculatePenalty(emiAmount: number, daysOverdue: number, penaltyRate: number = 0.01): number {
    return Math.round(emiAmount * penaltyRate * daysOverdue);
  }
};
