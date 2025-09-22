import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './config';
import {
  CDInvestment,
  CDInvestmentFilters,
  PendingCDRequestsResponse,
  AllCDInvestmentsResponse,
  ApproveCDRequestRequest,
  RejectCDRequestRequest,
  CDInvestmentActionResponse,
} from './types';

/**
 * CD Investment Service
 * Handles all CD investment related API calls
 */
export class CDInvestmentService {
  /**
   * Get pending CD investment requests
   */
  static async getPendingRequests(filters: CDInvestmentFilters = {}): Promise<PendingCDRequestsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.userType) params.append('userType', filters.userType);
    if (filters.search) params.append('search', filters.search);
    if (filters.requestDateFrom) params.append('requestDateFrom', filters.requestDateFrom);
    if (filters.requestDateTo) params.append('requestDateTo', filters.requestDateTo);
    if (filters.investmentAmountMin) params.append('investmentAmountMin', filters.investmentAmountMin.toString());
    if (filters.investmentAmountMax) params.append('investmentAmountMax', filters.investmentAmountMax.toString());

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.CD_INVESTMENT.PENDING_REQUESTS}?${queryString}`
      : API_ENDPOINTS.CD_INVESTMENT.PENDING_REQUESTS;

    const response = await apiClient.get<PendingCDRequestsResponse>(url);
    return response.data!;
  }

  /**
   * Get all CD investments with filters
   */
  static async getAllInvestments(filters: CDInvestmentFilters = {}): Promise<AllCDInvestmentsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.userType) params.append('userType', filters.userType);
    if (filters.search) params.append('search', filters.search);
    if (filters.requestDateFrom) params.append('requestDateFrom', filters.requestDateFrom);
    if (filters.requestDateTo) params.append('requestDateTo', filters.requestDateTo);
    if (filters.investmentAmountMin) params.append('investmentAmountMin', filters.investmentAmountMin.toString());
    if (filters.investmentAmountMax) params.append('investmentAmountMax', filters.investmentAmountMax.toString());

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.CD_INVESTMENT.ALL_INVESTMENTS}?${queryString}`
      : API_ENDPOINTS.CD_INVESTMENT.ALL_INVESTMENTS;

    console.log('CD Investment Service - Making request to:', url);
    console.log('CD Investment Service - Filters:', filters);
    
    const response = await apiClient.get<AllCDInvestmentsResponse>(url);
    console.log('CD Investment Service - Raw response:', response);
    
    // The validateResponse returns the full response, so we need to return response.data
    return response.data!;
  }

  /**
   * Approve a CD investment request
   */
  static async approveRequest(cdId: string, request: ApproveCDRequestRequest): Promise<CDInvestmentActionResponse> {
    const response = await apiClient.patch<CDInvestmentActionResponse>(
      API_ENDPOINTS.CD_INVESTMENT.APPROVE(cdId),
      request
    );
    return response.data!;
  }

  /**
   * Reject a CD investment request
   */
  static async rejectRequest(cdId: string, request: RejectCDRequestRequest): Promise<CDInvestmentActionResponse> {
    const response = await apiClient.patch<CDInvestmentActionResponse>(
      API_ENDPOINTS.CD_INVESTMENT.REJECT(cdId),
      request
    );
    return response.data!;
  }

  /**
   * Get CD investment by ID (if needed for detailed view)
   */
  static async getCDInvestmentById(cdId: string): Promise<{ success: boolean; data: { investment: CDInvestment } }> {
    // This endpoint might not exist in the API, but adding for completeness
    const response = await apiClient.get<{ success: boolean; data: { investment: CDInvestment } }>(
      `/admin/cd-investment/${cdId}`
    );
    return response.data!;
  }
}

export default CDInvestmentService;
