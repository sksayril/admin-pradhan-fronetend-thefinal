import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './config';
import { dataUtils } from './utils';
import { 
  Batch, 
  CreateBatchRequest, 
  UpdateBatchRequest, 
  BatchFilters, 
  BatchesResponse, 
  BatchResponse, 
  BatchesByCourseResponse, 
  BatchStatisticsResponse,
  ApiResponse
} from './types';

class BatchService {
  // Get all batches with pagination and filtering
  async getAllBatches(
    page: number = 1,
    limit: number = 10,
    filters?: BatchFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<ApiResponse<BatchesResponse>> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
        sortBy: sortBy || 'createdAt',
        sortOrder
      };

      // Add filters to params
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params[key] = value;
          }
        });
      }

      const response = await apiClient.get<BatchesResponse>(
        API_ENDPOINTS.BATCHES.LIST,
        { params }
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch batches');
    } catch (error) {
      console.error('Get batches error:', error);
      throw error;
    }
  }

  // Get batch by ID
  async getBatchById(id: string): Promise<ApiResponse<BatchResponse>> {
    try {
      const response = await apiClient.get<BatchResponse>(
        API_ENDPOINTS.BATCHES.BY_ID(id)
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch batch');
    } catch (error) {
      console.error('Get batch by ID error:', error);
      throw error;
    }
  }

  // Get batches by course
  async getBatchesByCourse(courseId: string): Promise<ApiResponse<BatchesByCourseResponse>> {
    try {
      const response = await apiClient.get<BatchesByCourseResponse>(
        API_ENDPOINTS.BATCHES.BY_COURSE(courseId)
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch batches for course');
    } catch (error) {
      console.error('Get batches by course error:', error);
      throw error;
    }
  }

  // Create new batch
  async createBatch(batchData: CreateBatchRequest): Promise<ApiResponse<BatchResponse>> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(batchData);

      const response = await apiClient.post<BatchResponse>(
        API_ENDPOINTS.BATCHES.CREATE,
        sanitizedData
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to create batch');
    } catch (error) {
      console.error('Create batch error:', error);
      throw error;
    }
  }

  // Update batch
  async updateBatch(id: string, batchData: UpdateBatchRequest): Promise<ApiResponse<BatchResponse>> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(batchData);

      const response = await apiClient.put<BatchResponse>(
        API_ENDPOINTS.BATCHES.UPDATE(id),
        sanitizedData
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to update batch');
    } catch (error) {
      console.error('Update batch error:', error);
      throw error;
    }
  }

  // Delete batch
  async deleteBatch(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        API_ENDPOINTS.BATCHES.DELETE(id)
      );

      if (response.success) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to delete batch');
    } catch (error) {
      console.error('Delete batch error:', error);
      throw error;
    }
  }

  // Get batch statistics
  async getBatchStatistics(): Promise<ApiResponse<BatchStatisticsResponse>> {
    try {
      const response = await apiClient.get<BatchStatisticsResponse>(
        API_ENDPOINTS.BATCHES.STATISTICS
      );

      if (response.success && response.data) {
        return response;
      }

      // Handle case where statistics might be directly in the response
      if (response.data && typeof response.data === 'object') {
        return {
          success: true,
          message: 'Batch statistics retrieved successfully',
          data: response.data as any
        };
      }

      throw new Error(response.message || 'Failed to fetch batch statistics');
    } catch (error) {
      console.error('Get batch statistics error:', error);
      throw error;
    }
  }

  // Get batches with filters (convenience method)
  async getBatchesWithFilters(
    page: number = 1,
    limit: number = 10,
    filters?: BatchFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ batches: Batch[]; pagination: any }> {
    try {
      const response = await this.getAllBatches(page, limit, filters, sortBy, sortOrder);
      
      // Handle different response structures
      if (response.data && response.data.batches) {
        return {
          batches: response.data.batches,
          pagination: response.data.pagination
        };
      } else if (response.data && Array.isArray(response.data)) {
        // If the response is directly an array
        return {
          batches: response.data,
          pagination: {
            currentPage: page,
            totalPages: 1,
            totalBatches: response.data.length,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      } else {
        // Fallback for unexpected structure
        console.warn('Unexpected API response structure:', response);
        return {
          batches: [],
          pagination: {
            currentPage: page,
            totalPages: 1,
            totalBatches: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      }
    } catch (error) {
      console.error('Get batches with filters error:', error);
      throw error;
    }
  }

  // Helper method to format time slots for display
  formatTimeSlots(timeSlots: any[]): string {
    if (!timeSlots || timeSlots.length === 0) return 'No time slots';
    
    return timeSlots.map(slot => {
      const date = new Date(slot.date).toLocaleDateString();
      return `${date} (${slot.startTime} - ${slot.endTime})`;
    }).join(', ');
  }

  // Helper method to get batch status color
  getBatchStatusColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Helper method to check if batch is accepting enrollments
  isAcceptingEnrollments(batch: Batch): boolean {
    const now = new Date();
    const registrationStart = new Date(batch.registrationStartDate);
    const registrationEnd = new Date(batch.registrationEndDate);
    
    return now >= registrationStart && now <= registrationEnd && batch.availableSpots > 0;
  }
}

export const batchService = new BatchService();
