import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './config';
import { DashboardResponse } from './types';

/**
 * Dashboard Service
 * Handles all dashboard related API calls
 */
export class DashboardService {
  /**
   * Get admin dashboard overview data
   */
  static async getDashboardData(): Promise<DashboardResponse> {
    const response = await apiClient.get<DashboardResponse>(API_ENDPOINTS.DASHBOARD.OVERVIEW);
    return response.data!;
  }
}

export default DashboardService;

