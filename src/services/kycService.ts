import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './config';
import { dataUtils } from './utils';
import { EnhancedStudent, EnhancedSocietyMember } from './types';

// Utility function to validate MongoDB ObjectId format
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Utility function to format KYC ID
const formatKYCId = (id: string): string => {
  // If it's already a valid ObjectId, return as is
  if (isValidObjectId(id)) {
    return id;
  }
  
  // If it starts with 'kyc_', remove the prefix and check if the rest is valid
  if (id.startsWith('kyc_')) {
    const cleanId = id.substring(4);
    if (isValidObjectId(cleanId)) {
      return cleanId;
    }
  }
  
  // If it's not a valid ObjectId, throw an error
  throw new Error(`Invalid KYC ID format: ${id}`);
};

// Utility function to validate student ID format
const isValidStudentId = (studentId: string): boolean => {
  // Student ID should be alphanumeric and at least 3 characters long
  return /^[A-Za-z0-9]{3,}$/.test(studentId);
};

// Utility function to validate member ID format
const isValidMemberId = (memberId: string): boolean => {
  // Member ID should be alphanumeric and at least 3 characters long
  return /^[A-Za-z0-9]{3,}$/.test(memberId);
};

// KYC Types
export interface StudentKYC {
  _id: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
    department: string;
    year: string;
  };
  aadharNumber: string;
  aadharCardImage: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  rejectionReason?: string;
  remarks?: string;
}

export interface SocietyMemberKYC {
  _id: string;
  memberId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    memberId: string;
    societyName: string;
    position: string;
  };
  aadharNumber: string;
  panNumber?: string;
  aadharCardImage: string;
  panCardImage?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  rejectionReason?: string;
  remarks?: string;
}

export interface PendingKYCResponse {
  studentKyc: StudentKYC[];
  societyMemberKyc: SocietyMemberKYC[];
  totalPending: number;
}

export interface KYCApprovalRequest {
  kycId: string;
  remarks?: string;
}

export interface KYCRejectionRequest {
  kycId: string;
  rejectionReason: string;
  remarks?: string;
}

export interface KYCResponse {
  kyc: {
    id: string;
    status: 'approved' | 'rejected';
    reviewedAt: string;
    remarks?: string;
    rejectionReason?: string;
  };
}

class KYCService {
  // Get all pending KYC requests
  async getPendingKYC(): Promise<PendingKYCResponse> {
    try {
      const response = await apiClient.get<PendingKYCResponse>(
        API_ENDPOINTS.KYC.PENDING
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch pending KYC requests');
    } catch (error) {
      console.error('Get pending KYC error:', error);
      throw error;
    }
  }

  // Approve student KYC
  async approveStudentKYC(request: KYCApprovalRequest): Promise<KYCResponse> {
    try {
      // Validate and format KYC ID
      if (!request.kycId || typeof request.kycId !== 'string') {
        throw new Error('Invalid KYC ID format');
      }

      const formattedKycId = formatKYCId(request.kycId);
      const sanitizedData = dataUtils.sanitizeInput({
        ...request,
        kycId: formattedKycId
      });
      
      const response = await apiClient.post<KYCResponse>(
        API_ENDPOINTS.KYC.APPROVE_STUDENT,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to approve student KYC');
    } catch (error) {
      console.error('Approve student KYC error:', error);
      throw error;
    }
  }

  // Reject student KYC
  async rejectStudentKYC(request: KYCRejectionRequest): Promise<KYCResponse> {
    try {
      // Validate and format KYC ID
      if (!request.kycId || typeof request.kycId !== 'string') {
        throw new Error('Invalid KYC ID format');
      }

      const formattedKycId = formatKYCId(request.kycId);
      const sanitizedData = dataUtils.sanitizeInput({
        ...request,
        kycId: formattedKycId
      });
      
      const response = await apiClient.post<KYCResponse>(
        API_ENDPOINTS.KYC.REJECT_STUDENT,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to reject student KYC');
    } catch (error) {
      console.error('Reject student KYC error:', error);
      throw error;
    }
  }

  // Approve society member KYC
  async approveSocietyMemberKYC(request: KYCApprovalRequest): Promise<KYCResponse> {
    try {
      // Validate and format KYC ID
      if (!request.kycId || typeof request.kycId !== 'string') {
        throw new Error('Invalid KYC ID format');
      }

      const formattedKycId = formatKYCId(request.kycId);
      const sanitizedData = dataUtils.sanitizeInput({
        ...request,
        kycId: formattedKycId
      });
      
      const response = await apiClient.post<KYCResponse>(
        API_ENDPOINTS.KYC.APPROVE_SOCIETY_MEMBER,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to approve society member KYC');
    } catch (error) {
      console.error('Approve society member KYC error:', error);
      throw error;
    }
  }

  // Reject society member KYC
  async rejectSocietyMemberKYC(request: KYCRejectionRequest): Promise<KYCResponse> {
    try {
      // Validate and format KYC ID
      if (!request.kycId || typeof request.kycId !== 'string') {
        throw new Error('Invalid KYC ID format');
      }

      const formattedKycId = formatKYCId(request.kycId);
      const sanitizedData = dataUtils.sanitizeInput({
        ...request,
        kycId: formattedKycId
      });
      
      const response = await apiClient.post<KYCResponse>(
        API_ENDPOINTS.KYC.REJECT_SOCIETY_MEMBER,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to reject society member KYC');
    } catch (error) {
      console.error('Reject society member KYC error:', error);
      throw error;
    }
  }

  // Get student KYC by status
  async getStudentKYCByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<StudentKYC[]> {
    try {
      // Use the user management endpoint with KYC status filter
      const response = await apiClient.get<{ students: EnhancedStudent[] }>(
        `${API_ENDPOINTS.USER_MANAGEMENT.STUDENTS}?kycStatus=${status}`
      );

      if (response.success && response.data) {
        // Transform EnhancedStudent to StudentKYC format
        return response.data.students
          .filter(student => student.kyc && student.kycStatus === status && isValidStudentId(student.studentId))
          .map(student => ({
            _id: student.kyc!._id || student._id,
            studentId: {
              _id: student._id,
              firstName: student.firstName,
              lastName: student.lastName,
              email: student.email,
              studentId: student.studentId,
              department: student.department,
              year: student.year
            },
            aadharNumber: student.kyc!.aadharNumber || '',
            aadharCardImage: student.kyc!.aadharCardImage || '',
            status: student.kyc!.status as 'pending' | 'approved' | 'rejected',
            submittedAt: student.kyc!.submittedAt || '',
            reviewedAt: student.kyc!.reviewedAt,
            reviewedBy: student.kyc!.reviewedBy,
            rejectionReason: student.kyc!.rejectionReason,
            remarks: student.kyc!.remarks
          }));
      }

      throw new Error(response.message || 'Failed to fetch student KYC');
    } catch (error) {
      console.error('Get student KYC by status error:', error);
      throw error;
    }
  }

  // Get society member KYC by status
  async getSocietyMemberKYCByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<SocietyMemberKYC[]> {
    try {
      // Use the user management endpoint with KYC status filter
      const response = await apiClient.get<{ societyMembers: EnhancedSocietyMember[] }>(
        `${API_ENDPOINTS.USER_MANAGEMENT.SOCIETY_MEMBERS}?kycStatus=${status}`
      );

      if (response.success && response.data) {
        // Transform EnhancedSocietyMember to SocietyMemberKYC format
        return response.data.societyMembers
          .filter(member => member.kyc && member.kycStatus === status && isValidMemberId(member.memberId))
          .map(member => ({
            _id: member.kyc!._id || member._id,
            memberId: {
              _id: member._id,
              firstName: member.firstName,
              lastName: member.lastName,
              email: member.email,
              memberId: member.memberId,
              societyName: member.societyName,
              position: member.position
            },
            aadharNumber: member.kyc!.aadharNumber || '',
            panNumber: member.kyc!.panNumber,
            aadharCardImage: member.kyc!.aadharCardImage || '',
            panCardImage: member.kyc!.panCardImage,
            status: member.kyc!.status as 'pending' | 'approved' | 'rejected',
            submittedAt: member.kyc!.submittedAt || '',
            reviewedAt: member.kyc!.reviewedAt,
            reviewedBy: member.kyc!.reviewedBy,
            rejectionReason: member.kyc!.rejectionReason,
            remarks: member.kyc!.remarks
          }));
      }

      throw new Error(response.message || 'Failed to fetch society member KYC');
    } catch (error) {
      console.error('Get society member KYC by status error:', error);
      throw error;
    }
  }

  // Get all approved KYC
  async getAllApprovedKYC(): Promise<{ studentKyc: StudentKYC[]; societyMemberKyc: SocietyMemberKYC[] }> {
    try {
      const [studentKyc, societyMemberKyc] = await Promise.all([
        this.getStudentKYCByStatus('approved'),
        this.getSocietyMemberKYCByStatus('approved')
      ]);

      return { studentKyc, societyMemberKyc };
    } catch (error) {
      console.error('Get all approved KYC error:', error);
      throw error;
    }
  }
}

export const kycService = new KYCService();
