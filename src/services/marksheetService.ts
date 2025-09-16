import { apiClient } from './apiClient';
import { dataUtils } from './utils';
import { 
  ApiResponse,
  Marksheet,
  CreateMarksheetRequest,
  MarksheetResponse,
  MarksheetFilters,
  MarksheetPagination
} from './types';

class MarksheetService {
  // Create marksheet
  async createMarksheet(marksheetData: CreateMarksheetRequest): Promise<ApiResponse<MarksheetResponse>> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(marksheetData);

      const response = await apiClient.post<MarksheetResponse>(
        '/admin/student-documents/marksheets',
        sanitizedData
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to create marksheet');
    } catch (error) {
      console.error('Create marksheet error:', error);
      throw error;
    }
  }

  // Get all marksheets with pagination and filtering
  async getAllMarksheets(
    page: number = 1,
    limit: number = 10,
    filters?: MarksheetFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<ApiResponse<{
    marksheets: Marksheet[];
    pagination: MarksheetPagination;
  }>> {
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

      const response = await apiClient.get<{
        marksheets: Marksheet[];
        pagination: MarksheetPagination;
      }>(
        '/admin/student-documents/marksheets',
        { params }
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch marksheets');
    } catch (error) {
      console.error('Get marksheets error:', error);
      throw error;
    }
  }

  // Get marksheet by ID
  async getMarksheetById(id: string): Promise<ApiResponse<MarksheetResponse>> {
    try {
      const response = await apiClient.get<MarksheetResponse>(
        `/admin/student-documents/marksheets/${id}`
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch marksheet');
    } catch (error) {
      console.error('Get marksheet by ID error:', error);
      throw error;
    }
  }

  // Get marksheets by student ID
  async getMarksheetsByStudent(studentId: string): Promise<ApiResponse<Marksheet[]>> {
    try {
      const response = await apiClient.get<Marksheet[]>(
        `/admin/student-documents/marksheets/student/${studentId}`
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch student marksheets');
    } catch (error) {
      console.error('Get marksheets by student error:', error);
      throw error;
    }
  }

  // Get student marksheets with enhanced data
  async getStudentMarksheets(
    studentId: string,
    page: number = 1,
    limit: number = 10,
    filters?: {
      academicYear?: string;
      semester?: string;
      examinationType?: string;
      result?: string;
      status?: string;
      includeDetails?: boolean;
    }
  ): Promise<ApiResponse<{
    student: any;
    statistics: {
      totalMarksheets: number;
      verifiedMarksheets: number;
      publishedMarksheets: number;
      averagePercentage: number;
      averageCGPA: number;
      passCount: number;
      failCount: number;
    };
    marksheets: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalMarksheets: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
        includeDetails: true
      };

      // Add filters to params
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params[key] = value;
          }
        });
      }

      const response = await apiClient.get<{
        student: any;
        statistics: {
          totalMarksheets: number;
          verifiedMarksheets: number;
          publishedMarksheets: number;
          averagePercentage: number;
          averageCGPA: number;
          passCount: number;
          failCount: number;
        };
        marksheets: any[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalMarksheets: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>(
        `/admin/student-documents/students/${studentId}/marksheets`,
        { params }
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch student marksheets');
    } catch (error) {
      console.error('Get student marksheets error:', error);
      throw error;
    }
  }

  // Update marksheet
  async updateMarksheet(id: string, marksheetData: Partial<CreateMarksheetRequest>): Promise<ApiResponse<MarksheetResponse>> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(marksheetData);

      const response = await apiClient.put<MarksheetResponse>(
        `/admin/student-documents/marksheets/${id}`,
        sanitizedData
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to update marksheet');
    } catch (error) {
      console.error('Update marksheet error:', error);
      throw error;
    }
  }

  // Delete marksheet
  async deleteMarksheet(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        `/admin/student-documents/marksheets/${id}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to delete marksheet');
    } catch (error) {
      console.error('Delete marksheet error:', error);
      throw error;
    }
  }

  // Verify marksheet
  async verifyMarksheet(id: string, verificationCode: string): Promise<ApiResponse<MarksheetResponse>> {
    try {
      const response = await apiClient.post<MarksheetResponse>(
        `/admin/student-documents/marksheets/${id}/verify`,
        { verificationCode }
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to verify marksheet');
    } catch (error) {
      console.error('Verify marksheet error:', error);
      throw error;
    }
  }

  // Download marksheet PDF
  async downloadMarksheetPDF(id: string): Promise<Blob> {
    try {
      const response = await fetch(`/admin/student-documents/marksheets/${id}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download marksheet PDF');
      }

      return await response.blob();
    } catch (error) {
      console.error('Download marksheet PDF error:', error);
      throw error;
    }
  }

  // Get marksheet statistics
  async getMarksheetStatistics(): Promise<ApiResponse<{
    totalMarksheets: number;
    verifiedMarksheets: number;
    pendingMarksheets: number;
    averagePercentage: number;
    passRate: number;
  }>> {
    try {
      const response = await apiClient.get<{
        totalMarksheets: number;
        verifiedMarksheets: number;
        pendingMarksheets: number;
        averagePercentage: number;
        passRate: number;
      }>(
        '/admin/student-documents/marksheets/statistics'
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch marksheet statistics');
    } catch (error) {
      console.error('Get marksheet statistics error:', error);
      throw error;
    }
  }

  // Helper method to calculate grade from percentage
  calculateGrade(percentage: number): { grade: string; gradePoints: number } {
    if (percentage >= 90) return { grade: 'A+', gradePoints: 10 };
    if (percentage >= 80) return { grade: 'A', gradePoints: 9 };
    if (percentage >= 70) return { grade: 'B+', gradePoints: 8 };
    if (percentage >= 60) return { grade: 'B', gradePoints: 7 };
    if (percentage >= 50) return { grade: 'C+', gradePoints: 6 };
    if (percentage >= 40) return { grade: 'C', gradePoints: 5 };
    if (percentage >= 35) return { grade: 'D', gradePoints: 4 };
    return { grade: 'F', gradePoints: 0 };
  }

  // Helper method to calculate CGPA
  calculateCGPA(subjects: Array<{ gradePoints: number; credits: number }>): number {
    if (subjects.length === 0) return 0;
    
    const totalPoints = subjects.reduce((sum, subject) => sum + (subject.gradePoints * subject.credits), 0);
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }

  // Helper method to get result status
  getResultStatus(percentage: number): 'PASS' | 'FAIL' {
    return percentage >= 35 ? 'PASS' : 'FAIL';
  }
}

export const marksheetService = new MarksheetService();
