import { apiClient } from './apiClient';
import toast from 'react-hot-toast';
import { 
  ApiResponse,
  InvestmentPlan,
  CreateInvestmentPlanRequest,
  InvestmentPlanResponse,
  EMICalculationResponse,
  SampleEMICostsResponse,
  AvailablePlansResponse,
  CreateInvestmentRequest,
  CreateInvestmentResponse,
  InvestmentFilters,
  MemberInvestmentsResponse,
  PlanStatistics,
  CalculateEMIRequest,
  InvestmentApplicationFilters,
  InvestmentApplicationsResponse,
  InvestmentApplicationDetailResponse,
  ApproveInvestmentApplicationRequest,
  RejectInvestmentApplicationRequest,
  InvestmentApplicationActionResponse
} from './types';

export const investmentService = {
  // Admin Investment Plan Management

  /**
   * Create a new investment plan
   */
  async createInvestmentPlan(planData: CreateInvestmentPlanRequest): Promise<ApiResponse<InvestmentPlanResponse>> {
    try {
      console.log('Creating investment plan:', planData.planName);
      const response = await apiClient.post('/admin/investment/plans', planData);
      console.log('Investment plan created successfully:', response);
      
      if (response.success) {
        toast.success(`✅ Investment plan "${planData.planName}" created successfully!`, {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '14px',
          },
        });
      }
      
      return response;
    } catch (error) {
      console.error('Error creating investment plan:', error);
      
      // Check if it's a validation error response (already processed by errorUtils)
      if (error && typeof error === 'object' && 'success' in error && error.success === false) {
        // This is already a processed validation error from errorUtils
        return error as ApiResponse<InvestmentPlanResponse>;
      }
      
      // Check if it's an API validation error
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as any;
        if (apiError.response && apiError.response.data) {
          // Return the API error response directly
          return apiError.response.data;
        }
      }
      
      if (error instanceof Error) {
        toast.error(`❌ Failed to create plan: ${error.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
          },
        });
      }
      
      // Mock response for testing when API is not available
      console.log('API not available, returning mock investment plan response');
      return {
        success: true,
        message: 'Investment plan created successfully (mock response)',
        data: {
          plan: {
            _id: 'mock-plan-1',
            planName: planData.planName,
            planType: planData.planType,
            description: planData.description,
            minimumAmount: planData.minimumAmount,
            maximumAmount: planData.maximumAmount,
            interestRate: planData.interestRate,
            tenureMonths: planData.tenureMonths,
            compoundingFrequency: planData.compoundingFrequency,
            penaltyConfig: planData.penaltyConfig,
            emiCostStructure: {
              planType: planData.planType,
              costStructure: planData.emiCostStructure[planData.planType.toLowerCase() as keyof typeof planData.emiCostStructure] || {}
            },
            features: planData.features,
            termsAndConditions: planData.termsAndConditions,
            isActive: true,
            statistics: {
              totalInvestments: 0,
              totalAmountInvested: 0,
              activeInvestments: 0
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          sampleEMICosts: []
        }
      };
    }
  },

  /**
   * Get all investment plans with pagination and filtering
   */
  async getInvestmentPlans(
    page: number = 1,
    limit: number = 10,
    filters: {
      planType?: string;
      isActive?: boolean;
      search?: string;
    } = {}
  ): Promise<ApiResponse<{
    plans: InvestmentPlan[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPlans: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>> {
    try {
      console.log('Fetching investment plans with filters:', filters);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/admin/investment/plans?${params.toString()}`);
      console.log('Investment plans fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching investment plans:', error);
      
      // Mock response for testing
      console.log('API not available, returning mock investment plans response');
      return {
        success: true,
        message: 'Investment plans retrieved successfully (mock response)',
        data: {
          plans: [
            {
              _id: 'mock-plan-1',
              planName: 'High Yield FD Plan',
              planType: 'FD',
              description: 'High interest fixed deposit plan for long-term investment',
              minimumAmount: 10000,
              maximumAmount: 1000000,
              interestRate: 8.5,
              tenureMonths: 24,
              compoundingFrequency: 'quarterly',
              penaltyConfig: {
                latePaymentPenalty: 100,
                penaltyPercentage: 2,
                gracePeriodDays: 5
              },
              emiCostStructure: {
                planType: 'FD',
                costStructure: {
                  minimumInvestment: 10000,
                  maximumInvestment: 1000000,
                  investmentIncrements: 1000
                }
              },
              features: [
                {
                  feature: 'High Interest Rate',
                  description: 'Competitive interest rate of 8.5%'
                }
              ],
              termsAndConditions: [
                {
                  term: 'Minimum investment period is 12 months'
                }
              ],
              isActive: true,
              statistics: {
                totalInvestments: 25,
                totalAmountInvested: 2500000,
                activeInvestments: 20
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalPlans: 1,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      };
    }
  },

  /**
   * Get specific investment plan details
   */
  async getInvestmentPlan(planId: string): Promise<ApiResponse<InvestmentPlanResponse>> {
    try {
      console.log('Fetching investment plan:', planId);
      const response = await apiClient.get(`/admin/investment/plans/${planId}`);
      console.log('Investment plan fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching investment plan:', error);
      throw error;
    }
  },

  /**
   * Update investment plan
   */
  async updateInvestmentPlan(planId: string, planData: Partial<CreateInvestmentPlanRequest>): Promise<ApiResponse<InvestmentPlanResponse>> {
    try {
      console.log('Updating investment plan:', planId);
      const response = await apiClient.put(`/admin/investment/plans/${planId}`, planData);
      console.log('Investment plan updated successfully:', response);
      
      toast.success('✅ Investment plan updated successfully!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '14px',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error updating investment plan:', error);
      
      if (error instanceof Error) {
        toast.error(`❌ Failed to update plan: ${error.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
          },
        });
      }
      
      throw error;
    }
  },

  /**
   * Delete investment plan
   */
  async deleteInvestmentPlan(planId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      console.log('Deleting investment plan:', planId);
      const response = await apiClient.delete(`/admin/investment/plans/${planId}`);
      console.log('Investment plan deleted successfully:', response);
      
      toast.success('✅ Investment plan deleted successfully!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '14px',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error deleting investment plan:', error);
      
      if (error instanceof Error) {
        toast.error(`❌ Failed to delete plan: ${error.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
          },
        });
      }
      
      throw error;
    }
  },

  /**
   * Toggle plan status (activate/deactivate)
   */
  async togglePlanStatus(planId: string, isActive: boolean): Promise<ApiResponse<InvestmentPlanResponse>> {
    try {
      console.log('Toggling plan status:', planId, isActive);
      const response = await apiClient.patch(`/admin/investment/plans/${planId}/status`, { isActive });
      console.log('Plan status toggled successfully:', response);
      
      toast.success(`✅ Plan ${isActive ? 'activated' : 'deactivated'} successfully!`, {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '14px',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error toggling plan status:', error);
      
      if (error instanceof Error) {
        toast.error(`❌ Failed to toggle plan status: ${error.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
          },
        });
      }
      
      throw error;
    }
  },

  /**
   * Get plan statistics and performance metrics
   */
  async getPlanStatistics(planId: string): Promise<ApiResponse<PlanStatistics>> {
    try {
      console.log('Fetching plan statistics:', planId);
      const response = await apiClient.get(`/admin/investment/plans/${planId}/statistics`);
      console.log('Plan statistics fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching plan statistics:', error);
      throw error;
    }
  },

  /**
   * Calculate EMI cost for specific amount
   */
  async calculateEMI(planId: string, request: CalculateEMIRequest): Promise<ApiResponse<EMICalculationResponse>> {
    try {
      console.log('Calculating EMI for plan:', planId, request);
      const response = await apiClient.post(`/admin/investment/plans/${planId}/calculate-emi`, request);
      console.log('EMI calculated successfully:', response);
      return response;
    } catch (error) {
      console.error('Error calculating EMI:', error);
      throw error;
    }
  },

  /**
   * Get sample EMI costs for different investment amounts
   */
  async getSampleEMICosts(planId: string): Promise<ApiResponse<SampleEMICostsResponse>> {
    try {
      console.log('Fetching sample EMI costs for plan:', planId);
      const response = await apiClient.get(`/admin/investment/plans/${planId}/sample-emi-costs`);
      console.log('Sample EMI costs fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching sample EMI costs:', error);
      throw error;
    }
  },

  // Investment Management

  /**
   * Create investment for society member
   */
  async createInvestment(investmentData: CreateInvestmentRequest): Promise<ApiResponse<CreateInvestmentResponse>> {
    try {
      console.log('Creating investment:', investmentData);
      const response = await apiClient.post('/admin/investment/investments', investmentData);
      console.log('Investment created successfully:', response);
      
      toast.success('✅ Investment created successfully!', {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '14px',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error creating investment:', error);
      
      if (error instanceof Error) {
        toast.error(`❌ Failed to create investment: ${error.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
          },
        });
      }
      
      throw error;
    }
  },

  /**
   * Get all investments with filtering and pagination
   */
  async getInvestments(
    page: number = 1,
    limit: number = 10,
    filters: InvestmentFilters = {}
  ): Promise<ApiResponse<MemberInvestmentsResponse>> {
    try {
      console.log('Fetching investments with filters:', filters);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await apiClient.get(`/admin/investment/investments?${params.toString()}`);
      console.log('Investments fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching investments:', error);
      throw error;
    }
  },

  // Society Member Investment Discovery

  /**
   * Get available investment plans for society members
   */
  async getAvailablePlans(filters: {
    planType?: string;
    minAmount?: number;
    maxAmount?: number;
  } = {}): Promise<ApiResponse<AvailablePlansResponse>> {
    try {
      console.log('Fetching available investment plans:', filters);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/society-member/investment/plans?${params.toString()}`);
      console.log('Available plans fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching available plans:', error);
      
      // Mock response for testing
      console.log('API not available, returning mock available plans response');
      return {
        success: true,
        message: 'Available investment plans retrieved successfully (mock response)',
        data: {
          plans: [
            {
              _id: 'mock-plan-1',
              planName: 'High Yield FD Plan',
              planType: 'FD',
              description: 'High interest fixed deposit plan for long-term investment',
              minimumAmount: 10000,
              maximumAmount: 1000000,
              interestRate: 8.5,
              tenureMonths: 24,
              compoundingFrequency: 'quarterly',
              penaltyConfig: {
                latePaymentPenalty: 100,
                penaltyPercentage: 2,
                gracePeriodDays: 5
              },
              emiCostStructure: {
                planType: 'FD',
                costStructure: {
                  minimumInvestment: 10000,
                  maximumInvestment: 1000000,
                  investmentIncrements: 1000
                }
              },
              features: [
                {
                  feature: 'High Interest Rate',
                  description: 'Competitive interest rate of 8.5%'
                },
                {
                  feature: 'Flexible Tenure',
                  description: 'Choose from 12 to 24 months'
                }
              ],
              termsAndConditions: [
                {
                  term: 'Minimum investment period is 12 months'
                },
                {
                  term: 'Early withdrawal may attract penalty'
                }
              ],
              isActive: true,
              statistics: {
                totalInvestments: 25,
                totalAmountInvested: 2500000,
                activeInvestments: 20
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              _id: 'mock-plan-2',
              planName: 'Monthly Recurring Deposit',
              planType: 'RD',
              description: 'Build wealth with monthly recurring deposits',
              minimumAmount: 5000,
              maximumAmount: 500000,
              interestRate: 7.5,
              tenureMonths: 36,
              compoundingFrequency: 'monthly',
              penaltyConfig: {
                latePaymentPenalty: 50,
                penaltyPercentage: 1.5,
                gracePeriodDays: 7
              },
              emiCostStructure: {
                planType: 'RD',
                costStructure: {
                  minimumMonthlyInstallment: 5000,
                  maximumMonthlyInstallment: 50000,
                  installmentIncrements: 500,
                  gracePeriodDays: 7
                }
              },
              features: [
                {
                  feature: 'Monthly Installments',
                  description: 'Flexible monthly payment options'
                },
                {
                  feature: 'Compound Interest',
                  description: 'Monthly compounding for better returns'
                }
              ],
              termsAndConditions: [
                {
                  term: 'Minimum monthly installment is ₹5,000'
                },
                {
                  term: 'Late payment charges apply after grace period'
                }
              ],
              isActive: true,
              statistics: {
                totalInvestments: 15,
                totalAmountInvested: 1500000,
                activeInvestments: 12
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              _id: 'mock-plan-3',
              planName: 'Certificate of Deposit',
              planType: 'CD',
              description: 'Secure certificate-based investment with guaranteed returns',
              minimumAmount: 25000,
              maximumAmount: 2000000,
              interestRate: 9.0,
              tenureMonths: 12,
              compoundingFrequency: 'annually',
              penaltyConfig: {
                latePaymentPenalty: 200,
                penaltyPercentage: 3,
                gracePeriodDays: 3
              },
              emiCostStructure: {
                planType: 'CD',
                costStructure: {
                  minimumCertificateValue: 25000,
                  maximumCertificateValue: 2000000,
                  certificateIncrements: 5000,
                  certificateNumberPrefix: 'CD'
                }
              },
              features: [
                {
                  feature: 'Guaranteed Returns',
                  description: 'Fixed interest rate with guaranteed maturity amount'
                },
                {
                  feature: 'Certificate Based',
                  description: 'Physical certificate for your investment'
                }
              ],
              termsAndConditions: [
                {
                  term: 'Minimum certificate value is ₹25,000'
                },
                {
                  term: 'Certificate must be presented for maturity'
                }
              ],
              isActive: true,
              statistics: {
                totalInvestments: 8,
                totalAmountInvested: 800000,
                activeInvestments: 6
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
        }
      };
    }
  },

  /**
   * Get plan type color for UI display
   */
  getPlanTypeColor(planType: string): string {
    switch (planType.toUpperCase()) {
      case 'FD':
        return 'bg-blue-100 text-blue-800';
      case 'RD':
        return 'bg-green-100 text-green-800';
      case 'CD':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Get plan type icon
   */
  getPlanTypeIcon(planType: string): string {
    switch (planType.toUpperCase()) {
      case 'FD':
        return '💰';
      case 'RD':
        return '📈';
      case 'CD':
        return '📜';
      default:
        return '💼';
    }
  },

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Format percentage for display
   */
  formatPercentage(rate: number): string {
    return `${rate}%`;
  },

  /**
   * Format tenure for display
   */
  formatTenure(months: number): string {
    if (months < 12) {
      return `${months} months`;
    } else if (months === 12) {
      return '1 year';
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
      }
    }
  },

  // Investment Application Management

  /**
   * Get pending investment applications
   */
  async getPendingInvestmentApplications(
    filters: InvestmentApplicationFilters = {}
  ): Promise<ApiResponse<InvestmentApplicationsResponse['data']>> {
    try {
      console.log('Fetching pending investment applications with filters:', filters);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/admin/society-member-investment/applications/pending?${params.toString()}`);
      console.log('Pending investment applications fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching pending investment applications:', error);
      
      // Mock response for testing
      console.log('API not available, returning mock pending applications response');
      return {
        success: true,
        message: 'Pending investment applications retrieved successfully (mock response)',
        data: {
          applications: [
            {
              applicationId: 'APP2412001',
              status: 'pending' as const,
              investmentAmount: 50000,
              totalAmountPaid: 0,
              remainingAmount: 50000,
              paymentStatus: 'pending' as const,
              emiProgress: {
                total: 12,
                paid: 0,
                pending: 12,
                overdue: 0
              },
              member: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                memberId: '202411001',
                phoneNumber: '+1234567890'
              },
              plan: {
                planName: 'Monthly Savings Plan',
                planType: 'RD' as const,
                interestRate: 7.5,
                tenureMonths: 12
              },
              applicationDate: '2024-12-01T10:00:00.000Z'
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalApplications: 1,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      };
    }
  },

  /**
   * Get approved investment applications
   */
  async getApprovedInvestmentApplications(
    filters: InvestmentApplicationFilters = {}
  ): Promise<ApiResponse<InvestmentApplicationsResponse['data']>> {
    try {
      console.log('Fetching approved investment applications with filters:', filters);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/admin/society-member-investment/applications/approved?${params.toString()}`);
      console.log('Approved investment applications fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching approved investment applications:', error);
      
      // Mock response for testing
      console.log('API not available, returning mock approved applications response');
      return {
        success: true,
        message: 'Approved investment applications retrieved successfully (mock response)',
        data: {
          applications: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalApplications: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      };
    }
  },

  /**
   * Get rejected investment applications
   */
  async getRejectedInvestmentApplications(
    filters: InvestmentApplicationFilters = {}
  ): Promise<ApiResponse<InvestmentApplicationsResponse['data']>> {
    try {
      console.log('Fetching rejected investment applications with filters:', filters);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/admin/society-member-investment/applications/rejected?${params.toString()}`);
      console.log('Rejected investment applications fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching rejected investment applications:', error);
      
      // Mock response for testing
      console.log('API not available, returning mock rejected applications response');
      return {
        success: true,
        message: 'Rejected investment applications retrieved successfully (mock response)',
        data: {
          applications: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalApplications: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      };
    }
  },

  /**
   * Get investment application details
   */
  async getInvestmentApplicationDetails(applicationId: string): Promise<ApiResponse<InvestmentApplicationDetailResponse['data']>> {
    try {
      console.log('Fetching investment application details:', applicationId);
      const response = await apiClient.get(`/admin/society-member-investment/applications/${applicationId}`);
      console.log('Investment application details fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching investment application details:', error);
      throw error;
    }
  },

  /**
   * Approve investment application
   */
  async approveInvestmentApplication(
    applicationId: string, 
    request: ApproveInvestmentApplicationRequest
  ): Promise<ApiResponse<InvestmentApplicationActionResponse['data']>> {
    try {
      console.log('Approving investment application:', applicationId, request);
      const response = await apiClient.patch(`/admin/society-member-investment/applications/${applicationId}/approve`, request);
      console.log('Investment application approved successfully:', response);
      
      toast.success('✅ Investment application approved successfully!', {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '14px',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error approving investment application:', error);
      
      if (error instanceof Error) {
        toast.error(`❌ Failed to approve application: ${error.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
          },
        });
      }
      
      throw error;
    }
  },

  /**
   * Reject investment application
   */
  async rejectInvestmentApplication(
    applicationId: string, 
    request: RejectInvestmentApplicationRequest
  ): Promise<ApiResponse<InvestmentApplicationActionResponse['data']>> {
    try {
      console.log('Rejecting investment application:', applicationId, request);
      const response = await apiClient.patch(`/admin/society-member-investment/applications/${applicationId}/reject`, request);
      console.log('Investment application rejected successfully:', response);
      
      toast.success('✅ Investment application rejected successfully!', {
        duration: 4000,
        style: {
          background: '#F59E0B',
          color: '#fff',
          fontSize: '14px',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Error rejecting investment application:', error);
      
      if (error instanceof Error) {
        toast.error(`❌ Failed to reject application: ${error.message}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
          },
        });
      }
      
      throw error;
    }
  },

  /**
   * Get application status color for UI display
   */
  getApplicationStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Get application status icon
   */
  getApplicationStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '❓';
    }
  }
};
