import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './config';
import { PaginationParams, PaginatedResponse, StudentFilters, EnhancedStudent } from './types';
import { dataUtils } from './utils';

// Student Types
export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentRequest {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  courseId: string;
  batchId: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  status?: 'active' | 'inactive' | 'graduated' | 'suspended';
}

// Course Batch Types
export interface CourseBatch {
  id: string;
  batchName: string;
  courseId: string;
  courseName: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentStudents: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  instructorId?: string;
  instructorName?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchRequest {
  batchName: string;
  courseId: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  instructorId?: string;
  description?: string;
}

export interface UpdateBatchRequest extends Partial<CreateBatchRequest> {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

// Certificate Types
export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  certificateNumber: string;
  issueDate: string;
  status: 'pending' | 'issued' | 'cancelled';
  grade?: string;
  remarks?: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificateRequest {
  studentId: string;
  courseId: string;
  batchId: string;
  grade?: string;
  remarks?: string;
}

// Marksheet Types
export interface Marksheet {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  semester: number;
  subjects: SubjectMarks[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  status: 'draft' | 'published' | 'cancelled';
  issueDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectMarks {
  subjectId: string;
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
}

export interface CreateMarksheetRequest {
  studentId: string;
  courseId: string;
  batchId: string;
  semester: number;
  subjects: Omit<SubjectMarks, 'grade'>[];
  remarks?: string;
}

// Course Types
export interface Course {
  id: string;
  courseName: string;
  courseCode: string;
  duration: number; // in months
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

class StudentService {
  // Student Management
  async getStudents(params?: PaginationParams): Promise<PaginatedResponse<Student>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Student>>(
        API_ENDPOINTS.STUDENT.STUDENTS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch students');
    } catch (error) {
      console.error('Get students error:', error);
      throw error;
    }
  }

  // Enhanced Student Management with Filtering
  async getStudentsWithFilters(
    page: number = 1,
    limit: number = 10,
    filters?: StudentFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ students: EnhancedStudent[]; pagination: any }> {
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

      const response = await apiClient.get<{ students: EnhancedStudent[]; pagination: any }>(
        API_ENDPOINTS.STUDENT.STUDENTS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch students with filters');
    } catch (error) {
      console.error('Get students with filters error:', error);
      throw error;
    }
  }

  async getStudentById(id: string): Promise<Student> {
    try {
      const response = await apiClient.get<{ student: Student }>(
        `${API_ENDPOINTS.STUDENT.STUDENTS}/${id}`
      );

      if (response.success && response.data) {
        return response.data.student;
      }

      throw new Error(response.message || 'Failed to fetch student');
    } catch (error) {
      console.error('Get student error:', error);
      throw error;
    }
  }

  async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(studentData);
      
      const response = await apiClient.post<{ student: Student }>(
        API_ENDPOINTS.STUDENT.STUDENTS,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.student;
      }

      throw new Error(response.message || 'Failed to create student');
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  }

  async updateStudent(id: string, studentData: UpdateStudentRequest): Promise<Student> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(studentData);
      
      const response = await apiClient.put<{ student: Student }>(
        `${API_ENDPOINTS.STUDENT.STUDENTS}/${id}`,
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

  async deleteStudent(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.STUDENT.STUDENTS}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Delete student error:', error);
      throw error;
    }
  }

  // Course Batch Management
  async getBatches(params?: PaginationParams): Promise<PaginatedResponse<CourseBatch>> {
    try {
      const response = await apiClient.get<PaginatedResponse<CourseBatch>>(
        API_ENDPOINTS.STUDENT.COURSE_BATCH,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch batches');
    } catch (error) {
      console.error('Get batches error:', error);
      throw error;
    }
  }

  async getBatchById(id: string): Promise<CourseBatch> {
    try {
      const response = await apiClient.get<{ batch: CourseBatch }>(
        `${API_ENDPOINTS.STUDENT.COURSE_BATCH}/${id}`
      );

      if (response.success && response.data) {
        return response.data.batch;
      }

      throw new Error(response.message || 'Failed to fetch batch');
    } catch (error) {
      console.error('Get batch error:', error);
      throw error;
    }
  }

  async createBatch(batchData: CreateBatchRequest): Promise<CourseBatch> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(batchData);
      
      const response = await apiClient.post<{ batch: CourseBatch }>(
        API_ENDPOINTS.STUDENT.COURSE_BATCH,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.batch;
      }

      throw new Error(response.message || 'Failed to create batch');
    } catch (error) {
      console.error('Create batch error:', error);
      throw error;
    }
  }

  async updateBatch(id: string, batchData: UpdateBatchRequest): Promise<CourseBatch> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(batchData);
      
      const response = await apiClient.put<{ batch: CourseBatch }>(
        `${API_ENDPOINTS.STUDENT.COURSE_BATCH}/${id}`,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.batch;
      }

      throw new Error(response.message || 'Failed to update batch');
    } catch (error) {
      console.error('Update batch error:', error);
      throw error;
    }
  }

  // Certificate Management
  async getCertificates(params?: PaginationParams): Promise<PaginatedResponse<Certificate>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Certificate>>(
        API_ENDPOINTS.STUDENT.CERTIFICATES,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch certificates');
    } catch (error) {
      console.error('Get certificates error:', error);
      throw error;
    }
  }

  async createCertificate(certificateData: CreateCertificateRequest): Promise<Certificate> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(certificateData);
      
      const response = await apiClient.post<{ certificate: Certificate }>(
        API_ENDPOINTS.STUDENT.CERTIFICATES,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.certificate;
      }

      throw new Error(response.message || 'Failed to create certificate');
    } catch (error) {
      console.error('Create certificate error:', error);
      throw error;
    }
  }

  async issueCertificate(id: string): Promise<Certificate> {
    try {
      const response = await apiClient.patch<{ certificate: Certificate }>(
        `${API_ENDPOINTS.STUDENT.CERTIFICATES}/${id}/issue`
      );

      if (response.success && response.data) {
        return response.data.certificate;
      }

      throw new Error(response.message || 'Failed to issue certificate');
    } catch (error) {
      console.error('Issue certificate error:', error);
      throw error;
    }
  }

  async downloadCertificate(id: string): Promise<void> {
    try {
      await apiClient.download(
        `${API_ENDPOINTS.STUDENT.CERTIFICATES}/${id}/download`,
        `certificate-${id}.pdf`
      );
    } catch (error) {
      console.error('Download certificate error:', error);
      throw error;
    }
  }

  // Marksheet Management
  async getMarksheets(params?: PaginationParams): Promise<PaginatedResponse<Marksheet>> {
    try {
      const response = await apiClient.get<PaginatedResponse<Marksheet>>(
        API_ENDPOINTS.STUDENT.MARKSHEETS,
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch marksheets');
    } catch (error) {
      console.error('Get marksheets error:', error);
      throw error;
    }
  }

  async getMarksheetById(id: string): Promise<Marksheet> {
    try {
      const response = await apiClient.get<{ marksheet: Marksheet }>(
        `${API_ENDPOINTS.STUDENT.MARKSHEETS}/${id}`
      );

      if (response.success && response.data) {
        return response.data.marksheet;
      }

      throw new Error(response.message || 'Failed to fetch marksheet');
    } catch (error) {
      console.error('Get marksheet error:', error);
      throw error;
    }
  }

  async createMarksheet(marksheetData: CreateMarksheetRequest): Promise<Marksheet> {
    try {
      const sanitizedData = dataUtils.sanitizeInput(marksheetData);
      
      const response = await apiClient.post<{ marksheet: Marksheet }>(
        API_ENDPOINTS.STUDENT.MARKSHEETS,
        sanitizedData
      );

      if (response.success && response.data) {
        return response.data.marksheet;
      }

      throw new Error(response.message || 'Failed to create marksheet');
    } catch (error) {
      console.error('Create marksheet error:', error);
      throw error;
    }
  }

  async publishMarksheet(id: string): Promise<Marksheet> {
    try {
      const response = await apiClient.patch<{ marksheet: Marksheet }>(
        `${API_ENDPOINTS.STUDENT.MARKSHEETS}/${id}/publish`
      );

      if (response.success && response.data) {
        return response.data.marksheet;
      }

      throw new Error(response.message || 'Failed to publish marksheet');
    } catch (error) {
      console.error('Publish marksheet error:', error);
      throw error;
    }
  }

  async downloadMarksheet(id: string): Promise<void> {
    try {
      await apiClient.download(
        `${API_ENDPOINTS.STUDENT.MARKSHEETS}/${id}/download`,
        `marksheet-${id}.pdf`
      );
    } catch (error) {
      console.error('Download marksheet error:', error);
      throw error;
    }
  }

  // Course Management
  async getCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<{ courses: Course[] }>(
        '/courses'
      );

      if (response.success && response.data) {
        return response.data.courses;
      }

      throw new Error(response.message || 'Failed to fetch courses');
    } catch (error) {
      console.error('Get courses error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const studentService = new StudentService();
export default studentService;
