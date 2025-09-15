import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './config';
import { 
  StudentsResponse,
  SocietyMembersResponse,
  AdminsResponse,
  StudentFilters,
  SocietyMemberFilters,
  AdminFilters,
  EnhancedStudent,
  EnhancedSocietyMember,
  EnhancedAdmin,
  BulkActionRequest,
  BulkActionResponse,
  ApprovedKYCStudentsResponse,
  ApprovedKYCSocietyMembersResponse
} from './types';
import { dataUtils } from './utils';

class UserManagementService {
  // Get All Students with Advanced Filtering
  async getAllStudents(
    page: number = 1,
    limit: number = 10,
    filters?: StudentFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<StudentsResponse> {
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

      const response = await apiClient.get<StudentsResponse>(
        API_ENDPOINTS.USER_MANAGEMENT.STUDENTS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch students');
    } catch (error) {
      console.error('Get all students error:', error);
      throw error;
    }
  }

  // Get Student by ID
  async getStudentById(id: string): Promise<EnhancedStudent> {
    try {
      const response = await apiClient.get<{ student: EnhancedStudent }>(
        API_ENDPOINTS.USER_MANAGEMENT.STUDENT_BY_ID(id)
      );

      if (response.success && response.data) {
        return response.data.student;
      }

      throw new Error(response.message || 'Failed to fetch student');
    } catch (error) {
      console.error('Get student by ID error:', error);
      throw error;
    }
  }

  // Get Student by Student ID
  async getStudentByStudentId(studentId: string): Promise<EnhancedStudent> {
    try {
      const response = await apiClient.get<{ student: EnhancedStudent }>(
        API_ENDPOINTS.USER_MANAGEMENT.STUDENT_BY_STUDENT_ID(studentId)
      );

      if (response.success && response.data) {
        return response.data.student;
      }

      throw new Error(response.message || 'Failed to fetch student');
    } catch (error) {
      console.error('Get student by student ID error:', error);
      throw error;
    }
  }

  // Update Student
  async updateStudent(id: string, studentData: Partial<EnhancedStudent>): Promise<EnhancedStudent> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(studentData);
      
      const response = await apiClient.put<{ student: EnhancedStudent }>(
        `${API_ENDPOINTS.USER_MANAGEMENT.STUDENTS}/${id}`,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.student;
      }

      throw new Error(response.message || 'Failed to update student');
    } catch (error) {
      console.error('Update student error:', error);
      throw error;
    }
  }

  // Delete Student
  async deleteStudent(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.USER_MANAGEMENT.STUDENTS}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Delete student error:', error);
      throw error;
    }
  }

  // Get All Society Members with Advanced Filtering
  async getAllSocietyMembers(
    page: number = 1,
    limit: number = 10,
    filters?: SocietyMemberFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<SocietyMembersResponse> {
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

      const response = await apiClient.get<SocietyMembersResponse>(
        API_ENDPOINTS.USER_MANAGEMENT.SOCIETY_MEMBERS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch society members');
    } catch (error) {
      console.error('Get all society members error:', error);
      throw error;
    }
  }

  // Get Society Member by ID
  async getSocietyMemberById(id: string): Promise<EnhancedSocietyMember> {
    try {
      const response = await apiClient.get<{ societyMember: EnhancedSocietyMember }>(
        API_ENDPOINTS.USER_MANAGEMENT.SOCIETY_MEMBER_BY_ID(id)
      );

      if (response.success && response.data) {
        return response.data.societyMember;
      }

      throw new Error(response.message || 'Failed to fetch society member');
    } catch (error) {
      console.error('Get society member by ID error:', error);
      throw error;
    }
  }

  // Get Society Member by Member ID
  async getSocietyMemberByMemberId(memberId: string): Promise<EnhancedSocietyMember> {
    try {
      const response = await apiClient.get<{ societyMember: EnhancedSocietyMember }>(
        API_ENDPOINTS.USER_MANAGEMENT.SOCIETY_MEMBER_BY_MEMBER_ID(memberId)
      );

      if (response.success && response.data) {
        return response.data.societyMember;
      }

      throw new Error(response.message || 'Failed to fetch society member');
    } catch (error) {
      console.error('Get society member by member ID error:', error);
      throw error;
    }
  }

  // Update Society Member
  async updateSocietyMember(id: string, memberData: Partial<EnhancedSocietyMember>): Promise<EnhancedSocietyMember> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(memberData);
      
      const response = await apiClient.put<{ societyMember: EnhancedSocietyMember }>(
        `${API_ENDPOINTS.USER_MANAGEMENT.SOCIETY_MEMBERS}/${id}`,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.societyMember;
      }

      throw new Error(response.message || 'Failed to update society member');
    } catch (error) {
      console.error('Update society member error:', error);
      throw error;
    }
  }

  // Delete Society Member
  async deleteSocietyMember(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.USER_MANAGEMENT.SOCIETY_MEMBERS}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete society member');
      }
    } catch (error) {
      console.error('Delete society member error:', error);
      throw error;
    }
  }

  // Get All Admins with Advanced Filtering
  async getAllAdmins(
    page: number = 1,
    limit: number = 10,
    filters?: AdminFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<AdminsResponse> {
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

      const response = await apiClient.get<AdminsResponse>(
        API_ENDPOINTS.USER_MANAGEMENT.ADMINS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch admins');
    } catch (error) {
      console.error('Get all admins error:', error);
      throw error;
    }
  }

  // Get Admin by ID
  async getAdminById(id: string): Promise<EnhancedAdmin> {
    try {
      const response = await apiClient.get<{ admin: EnhancedAdmin }>(
        API_ENDPOINTS.USER_MANAGEMENT.ADMIN_BY_ID(id)
      );

      if (response.success && response.data) {
        return response.data.admin;
      }

      throw new Error(response.message || 'Failed to fetch admin');
    } catch (error) {
      console.error('Get admin by ID error:', error);
      throw error;
    }
  }

  // Create Admin
  async createAdmin(adminData: Partial<EnhancedAdmin>): Promise<EnhancedAdmin> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(adminData);
      
      const response = await apiClient.post<{ admin: EnhancedAdmin }>(
        API_ENDPOINTS.USER_MANAGEMENT.ADMINS,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.admin;
      }

      throw new Error(response.message || 'Failed to create admin');
    } catch (error) {
      console.error('Create admin error:', error);
      throw error;
    }
  }

  // Update Admin
  async updateAdmin(id: string, adminData: Partial<EnhancedAdmin>): Promise<EnhancedAdmin> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(adminData);
      
      const response = await apiClient.put<{ admin: EnhancedAdmin }>(
        `${API_ENDPOINTS.USER_MANAGEMENT.ADMINS}/${id}`,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.admin;
      }

      throw new Error(response.message || 'Failed to update admin');
    } catch (error) {
      console.error('Update admin error:', error);
      throw error;
    }
  }

  // Delete Admin
  async deleteAdmin(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.USER_MANAGEMENT.ADMINS}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Delete admin error:', error);
      throw error;
    }
  }

  // Bulk Actions
  async performBulkAction(bulkAction: BulkActionRequest): Promise<BulkActionResponse> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(bulkAction);
      
      const response = await apiClient.post<BulkActionResponse>(
        API_ENDPOINTS.USER_MANAGEMENT.BULK_ACTIONS,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Bulk action failed');
    } catch (error) {
      console.error('Bulk action error:', error);
      throw error;
    }
  }

  // Export Users
  async exportUsers(
    userType: 'students' | 'society-members' | 'admins',
    filters?: StudentFilters | SocietyMemberFilters | AdminFilters,
    format: 'csv' | 'excel' | 'pdf' = 'excel'
  ): Promise<void> {
    try {
      const params: any = {
        format,
        ...dataUtils.sanitizeInput(filters || {})
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      await apiClient.download(
        `${API_ENDPOINTS.USER_MANAGEMENT.USERS}/export/${userType}`,
        `users-export.${format}`,
        { params }
      );
    } catch (error) {
      console.error('Export users error:', error);
      throw error;
    }
  }

  // Get User Statistics
  async getUserStatistics(): Promise<{
    totalStudents: number;
    totalSocietyMembers: number;
    totalAdmins: number;
    activeStudents: number;
    activeSocietyMembers: number;
    activeAdmins: number;
    pendingKycStudents: number;
    pendingKycSocietyMembers: number;
    recentRegistrations: {
      students: number;
      societyMembers: number;
      admins: number;
    };
  }> {
    try {
      const response = await apiClient.get<{
        totalStudents: number;
        totalSocietyMembers: number;
        totalAdmins: number;
        activeStudents: number;
        activeSocietyMembers: number;
        activeAdmins: number;
        pendingKycStudents: number;
        pendingKycSocietyMembers: number;
        recentRegistrations: {
          students: number;
          societyMembers: number;
          admins: number;
        };
      }>(`${API_ENDPOINTS.USER_MANAGEMENT.USERS}/statistics`);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch user statistics');
    } catch (error) {
      console.error('Get user statistics error:', error);
      throw error;
    }
  }

  // Search Users (Global Search)
  async searchUsers(
    query: string,
    userTypes: ('students' | 'society-members' | 'admins')[] = ['students', 'society-members', 'admins'],
    limit: number = 10
  ): Promise<{
    students: EnhancedStudent[];
    societyMembers: EnhancedSocietyMember[];
    admins: EnhancedAdmin[];
  }> {
    try {
      const params = {
        query: dataUtils.sanitizeInput(query),
        userTypes: userTypes.join(','),
        limit
      };

      const response = await apiClient.get<{
        students: EnhancedStudent[];
        societyMembers: EnhancedSocietyMember[];
        admins: EnhancedAdmin[];
      }>(`${API_ENDPOINTS.USER_MANAGEMENT.USERS}/search`, { params });

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Search failed');
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  // Get All Approved KYC Students
  async getApprovedKYCStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    year?: string;
  }): Promise<ApprovedKYCStudentsResponse> {
    try {
      const queryParams = {
        page: params?.page || 1,
        limit: params?.limit || 10,
        ...(params?.search && { search: params.search }),
        ...(params?.department && { department: params.department }),
        ...(params?.year && { year: params.year }),
      };

      const response = await apiClient.get<ApprovedKYCStudentsResponse>(
        API_ENDPOINTS.USER_MANAGEMENT.STUDENTS_APPROVED_KYC,
        { params: queryParams }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch approved KYC students');
    } catch (error) {
      console.error('Get approved KYC students error:', error);
      throw error;
    }
  }

  // Get All Approved KYC Society Members
  async getApprovedKYCSocietyMembers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    societyName?: string;
    position?: string;
  }): Promise<ApprovedKYCSocietyMembersResponse> {
    try {
      const queryParams = {
        page: params?.page || 1,
        limit: params?.limit || 10,
        ...(params?.search && { search: params.search }),
        ...(params?.societyName && { societyName: params.societyName }),
        ...(params?.position && { position: params.position }),
      };

      const response = await apiClient.get<ApprovedKYCSocietyMembersResponse>(
        API_ENDPOINTS.USER_MANAGEMENT.SOCIETY_MEMBERS_APPROVED_KYC,
        { params: queryParams }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch approved KYC society members');
    } catch (error) {
      console.error('Get approved KYC society members error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const userManagementService = new UserManagementService();
export default userManagementService;
