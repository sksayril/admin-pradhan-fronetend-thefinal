import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './config';
import { PaginationParams, PaginatedResponse, SocietyMemberFilters, EnhancedSocietyMember } from './types';
import { dataUtils } from './utils';

// Society Member Types
export interface SocietyMember {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: string;
  status: 'active' | 'inactive' | 'suspended';
  totalContribution: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberRequest {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
  status?: 'active' | 'inactive' | 'suspended';
}

// Payment Types
export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentType: 'monthly' | 'annual' | 'special' | 'penalty';
  paymentDate: string;
  dueDate?: string;
  status: 'pending' | 'completed' | 'overdue' | 'cancelled';
  description?: string;
  receiptNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  memberId: string;
  amount: number;
  paymentType: 'monthly' | 'annual' | 'special' | 'penalty';
  dueDate?: string;
  description?: string;
}

// Loan Types
export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  loanAmount: number;
  interestRate: number;
  tenure: number; // in months
  monthlyEMI: number;
  loanDate: string;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'defaulted';
  remainingAmount: number;
  nextEMIDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanRequest {
  memberId: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  description?: string;
}

// Penalty Types
export interface Penalty {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  reason: string;
  penaltyDate: string;
  status: 'pending' | 'paid' | 'waived';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePenaltyRequest {
  memberId: string;
  amount: number;
  reason: string;
  description?: string;
}

class SocietyService {
  // Member Management
  async getMembers(params?: PaginationParams): Promise<PaginatedResponse<SocietyMember>> {
    try {
      const response = await apiClient.get<PaginatedResponse<SocietyMember>>(
        API_ENDPOINTS.SOCIETY.MEMBERS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch members');
    } catch (error) {
      console.error('Get members error:', error);
      throw error;
    }
  }

  // Enhanced Member Management with Filtering
  async getMembersWithFilters(
    page: number = 1,
    limit: number = 10,
    filters?: SocietyMemberFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ societyMembers: EnhancedSocietyMember[]; pagination: any }> {
    try {
      const params: any = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...dataUtils.sanitizeInput(filters || {})
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const response = await apiClient.get<{ societyMembers: EnhancedSocietyMember[]; pagination: any }>(
        API_ENDPOINTS.SOCIETY.MEMBERS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch members with filters');
    } catch (error) {
      console.error('Get members with filters error:', error);
      throw error;
    }
  }

  async getMemberById(id: string): Promise<SocietyMember> {
    try {
      const response = await apiClient.get<{ member: SocietyMember }>(
        `${API_ENDPOINTS.SOCIETY.MEMBERS}/${id}`
      );

      if (response.success && response.data) {
        return response.data.member;
      }

      throw new Error(response.message || 'Failed to fetch member');
    } catch (error) {
      console.error('Get member error:', error);
      throw error;
    }
  }

  async createMember(memberData: CreateMemberRequest): Promise<SocietyMember> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(memberData);
      
      const response = await apiClient.post<{ member: SocietyMember }>(
        API_ENDPOINTS.SOCIETY.MEMBERS,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.member;
      }

      throw new Error(response.message || 'Failed to create member');
    } catch (error) {
      console.error('Create member error:', error);
      throw error;
    }
  }

  async updateMember(id: string, memberData: UpdateMemberRequest): Promise<SocietyMember> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(memberData);
      
      const response = await apiClient.put<{ member: SocietyMember }>(
        `${API_ENDPOINTS.SOCIETY.MEMBERS}/${id}`,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.member;
      }

      throw new Error(response.message || 'Failed to update member');
    } catch (error) {
      console.error('Update member error:', error);
      throw error;
    }
  }

  async deleteMember(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.SOCIETY.MEMBERS}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Delete member error:', error);
      throw error;
    }
  }

  // Payment Management
  async getPayments(params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Payment>>(
        API_ENDPOINTS.SOCIETY.PAYMENTS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch payments');
    } catch (error) {
      console.error('Get payments error:', error);
      throw error;
    }
  }

  async createPayment(paymentData: CreatePaymentRequest): Promise<Payment> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(paymentData);
      
      const response = await apiClient.post<{ payment: Payment }>(
        API_ENDPOINTS.SOCIETY.PAYMENTS,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.payment;
      }

      throw new Error(response.message || 'Failed to create payment');
    } catch (error) {
      console.error('Create payment error:', error);
      throw error;
    }
  }

  async updatePaymentStatus(id: string, status: Payment['status']): Promise<Payment> {
    try {
      const response = await apiClient.patch<{ payment: Payment }>(
        `${API_ENDPOINTS.SOCIETY.PAYMENTS}/${id}/status`,
        { status }
      );

      if (response.success && response.data) {
        return response.data.payment;
      }

      throw new Error(response.message || 'Failed to update payment status');
    } catch (error) {
      console.error('Update payment status error:', error);
      throw error;
    }
  }

  // Loan Management
  async getLoans(params?: PaginationParams): Promise<PaginatedResponse<Loan>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Loan>>(
        API_ENDPOINTS.SOCIETY.LOANS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch loans');
    } catch (error) {
      console.error('Get loans error:', error);
      throw error;
    }
  }

  async createLoan(loanData: CreateLoanRequest): Promise<Loan> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(loanData);
      
      const response = await apiClient.post<{ loan: Loan }>(
        API_ENDPOINTS.SOCIETY.LOANS,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.loan;
      }

      throw new Error(response.message || 'Failed to create loan');
    } catch (error) {
      console.error('Create loan error:', error);
      throw error;
    }
  }

  async approveLoan(id: string): Promise<Loan> {
    try {
      const response = await apiClient.patch<{ loan: Loan }>(
        `${API_ENDPOINTS.SOCIETY.LOANS}/${id}/approve`
      );

      if (response.success && response.data) {
        return response.data.loan;
      }

      throw new Error(response.message || 'Failed to approve loan');
    } catch (error) {
      console.error('Approve loan error:', error);
      throw error;
    }
  }

  // Penalty Management
  async getPenalties(params?: PaginationParams): Promise<PaginatedResponse<Penalty>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Penalty>>(
        API_ENDPOINTS.SOCIETY.PENALTIES,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch penalties');
    } catch (error) {
      console.error('Get penalties error:', error);
      throw error;
    }
  }

  async createPenalty(penaltyData: CreatePenaltyRequest): Promise<Penalty> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(penaltyData);
      
      const response = await apiClient.post<{ penalty: Penalty }>(
        API_ENDPOINTS.SOCIETY.PENALTIES,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.penalty;
      }

      throw new Error(response.message || 'Failed to create penalty');
    } catch (error) {
      console.error('Create penalty error:', error);
      throw error;
    }
  }

  async updatePenaltyStatus(id: string, status: Penalty['status']): Promise<Penalty> {
    try {
      const response = await apiClient.patch<{ penalty: Penalty }>(
        `${API_ENDPOINTS.SOCIETY.PENALTIES}/${id}/status`,
        { status }
      );

      if (response.success && response.data) {
        return response.data.penalty;
      }

      throw new Error(response.message || 'Failed to update penalty status');
    } catch (error) {
      console.error('Update penalty status error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const societyService = new SocietyService();
export default societyService;
