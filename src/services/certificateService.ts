import { apiClient } from './apiClient';

// Certificate Types
export interface CertificateGenerationRequest {
  certificateType?: string;
  certificateTitle?: string;
  description?: string;
  achievements?: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  deliveryMethod?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CertificateData {
  certificateNumber: string;
  certificateType: string;
  certificateTitle: string;
  academicYear: string;
  grade: string;
  percentage: number;
  cgpa: number;
  status: string;
  isVerified: boolean;
  verificationCode: string;
  deliveryStatus: string;
}

export interface CertificateGenerationResponse {
  success: boolean;
  message: string;
  data: {
    certificate: CertificateData;
    student: {
      _id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      studentId: string;
      email: string;
      department: string;
      year: string;
    };
    course: {
      _id: string;
      title: string;
      category: string;
      instructor: string;
      duration: string;
    };
    batch: {
      _id: string;
      name: string;
      startDate: string;
      endDate: string;
    };
    marksheet: {
      marksheetNumber: string;
      academicYear: string;
      semester: string;
      examinationType: string;
      percentage: number;
      cgpa: number;
      overallGrade: string;
      result: string;
    };
    createdBy: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

class CertificateService {
  /**
   * Generate certificate from marksheet
   */
  async generateCertificateFromMarksheet(
    marksheetNumber: string,
    requestData?: CertificateGenerationRequest
  ): Promise<CertificateGenerationResponse['data']> {
    try {
      const response = await apiClient.post<CertificateGenerationResponse>(
        `/admin/student-documents/certificates/generate-from-marksheet/${marksheetNumber}`,
        requestData || {}
      );

      if (response.success && response.data) {
        return response.data.data;
      }

      throw new Error(response.message || 'Failed to generate certificate');
    } catch (error) {
      console.error('Generate certificate error:', error);
      throw error;
    }
  }

  /**
   * Get certificate by certificate number
   */
  async getCertificate(certificateNumber: string): Promise<CertificateGenerationResponse['data']> {
    try {
      const response = await apiClient.get<CertificateGenerationResponse>(
        `/admin/student-documents/certificates/${certificateNumber}`
      );

      if (response.success && response.data) {
        return response.data.data;
      }

      throw new Error(response.message || 'Failed to fetch certificate');
    } catch (error) {
      console.error('Get certificate error:', error);
      throw error;
    }
  }

  /**
   * Get student certificate data by student ID
   */
  async getStudentCertificateData(
    studentId: string,
    page: number = 1,
    limit: number = 10,
    filters?: {
      certificateType?: string;
      academicYear?: string;
      status?: string;
      includeDetails?: boolean;
    }
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      student: {
        _id: string;
        firstName: string;
        lastName: string;
        fullName: string;
        studentId: string;
        email: string;
        department: string;
        year: string;
      };
      certificates: Array<{
        certificateNumber: string;
        certificateType: string;
        certificateTitle: string;
        academicYear: string;
        grade: string;
        percentage: number;
        cgpa: number;
        status: string;
        isVerified: boolean;
        verificationCode: string;
        certificateIssueDate: string;
        course: {
          _id: string;
          title: string;
          category: string;
          instructor: {
            name: string;
            email: string;
            bio: string;
          };
          duration: number;
        };
        batch: {
          _id: string;
          name: string;
          startDate: string;
          endDate: string;
          maxStudents: number;
        };
        marksheet: {
          marksheetNumber: string;
          academicYear: string;
          semester: string;
          examinationType: string;
          percentage: number;
          cgpa: number;
          overallGrade: string;
          result: string;
        } | null;
        createdBy: {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
        };
        verifiedBy?: {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
        };
        createdAt: string;
        updatedAt: string;
        description?: string;
        achievements?: Array<{
          _id: string;
          title: string;
          description: string;
          date: string;
        }>;
        deliveryAddress?: {
          country: string;
          street?: string;
          city?: string;
          state?: string;
          zipCode?: string;
        };
        deliveryStatus?: string;
        deliveryMethod?: string;
        printHistory?: any[];
        downloadHistory?: any[];
      }>;
      statistics: {
        totalCertificates: number;
        verifiedCertificates: number;
        issuedCertificates: number;
        deliveredCertificates: number;
        averageGrade: number;
        averagePercentage: number;
      };
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCertificates: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    };
  }> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
        includeDetails: true
      };

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params[key] = value;
          }
        });
      }

      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          student: {
            _id: string;
            firstName: string;
            lastName: string;
            fullName: string;
            studentId: string;
            email: string;
            department: string;
            year: string;
          };
          certificates: Array<{
            certificateNumber: string;
            certificateType: string;
            certificateTitle: string;
            academicYear: string;
            grade: string;
            percentage: number;
            cgpa: number;
            status: string;
            isVerified: boolean;
            verificationCode: string;
            certificateIssueDate: string;
            course: {
              _id: string;
              title: string;
              category: string;
              instructor: {
                name: string;
                email: string;
                bio: string;
              };
              duration: number;
            };
            batch: {
              _id: string;
              name: string;
              startDate: string;
              endDate: string;
              maxStudents: number;
            };
            marksheet: {
              marksheetNumber: string;
              academicYear: string;
              semester: string;
              examinationType: string;
              percentage: number;
              cgpa: number;
              overallGrade: string;
              result: string;
            } | null;
            createdBy: {
              _id: string;
              firstName: string;
              lastName: string;
              email: string;
            };
            verifiedBy?: {
              _id: string;
              firstName: string;
              lastName: string;
              email: string;
            };
            createdAt: string;
            updatedAt: string;
            description?: string;
            achievements?: Array<{
              _id: string;
              title: string;
              description: string;
              date: string;
            }>;
            deliveryAddress?: {
              country: string;
              street?: string;
              city?: string;
              state?: string;
              zipCode?: string;
            };
            deliveryStatus?: string;
            deliveryMethod?: string;
            printHistory?: any[];
            downloadHistory?: any[];
          }>;
          statistics: {
            totalCertificates: number;
            verifiedCertificates: number;
            issuedCertificates: number;
            deliveredCertificates: number;
            averageGrade: number;
            averagePercentage: number;
          };
          pagination: {
            currentPage: number;
            totalPages: number;
            totalCertificates: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
          };
        };
      }>(
        `/admin/student-documents/students/${studentId}/certificate-data`,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch student certificate data');
    } catch (error) {
      console.error('Get student certificate data error:', error);
      throw error;
    }
  }

  /**
   * Get all certificates for a student
   */
  async getStudentCertificates(
    studentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    certificates: CertificateData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCertificates: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          certificates: CertificateData[];
          pagination: {
            currentPage: number;
            totalPages: number;
            totalCertificates: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
          };
        };
      }>(
        `/admin/student-documents/students/${studentId}/certificates`,
        {
          params: { page, limit }
        }
      );

      if (response.success && response.data) {
        return response.data.data;
      }

      throw new Error(response.message || 'Failed to fetch student certificates');
    } catch (error) {
      console.error('Get student certificates error:', error);
      throw error;
    }
  }
}

export const certificateService = new CertificateService();
