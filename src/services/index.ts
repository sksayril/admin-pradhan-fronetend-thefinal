// Export all services
export { default as apiClient } from './apiClient';
export { default as authService } from './authService';
export { default as societyService } from './societyService';
export { default as studentService } from './studentService';
export { default as userManagementService } from './userManagementService';
export { kycService } from './kycService';
export { courseService } from './courseService';
export { batchService } from './batchService';
export { enrollmentService } from './enrollmentService';
export { feeService } from './feeService';
export { attendanceService } from './attendanceService';
export { investmentService } from './investmentService';
export { marksheetService } from './marksheetService';

// Export types
export * from './types';

// Export configuration
export { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, STORAGE_KEYS } from './config';

// Export utilities
export { tokenUtils, errorUtils, requestUtils, dataUtils } from './utils';

// Re-export specific types from services
export type {
  SocietyMember,
  CreateMemberRequest,
  UpdateMemberRequest,
  Payment,
  CreatePaymentRequest,
  Loan,
  CreateLoanRequest,
  Penalty,
  CreatePenaltyRequest,
} from './societyService';

export type {
  Student,
  CreateStudentRequest,
  UpdateStudentRequest,
  CourseBatch,
  CreateBatchRequest as CreateStudentBatchRequest,
  UpdateBatchRequest as UpdateStudentBatchRequest,
  Certificate,
  CreateCertificateRequest,
  SubjectMarks,
  Course as StudentCourse,
} from './studentService';

// Re-export user management types
export type {
  EnhancedStudent,
  EnhancedSocietyMember,
  EnhancedAdmin,
  StudentFilters,
  SocietyMemberFilters,
  AdminFilters,
  StudentsResponse,
  SocietyMembersResponse,
  AdminsResponse,
  UserManagementPagination,
  BulkActionRequest,
  BulkActionResponse,
  ApprovedKYCStudent,
  ApprovedKYCSocietyMember,
  ApprovedKYCStudentsResponse,
  ApprovedKYCSocietyMembersResponse,
} from './types';

// Re-export KYC types
export type {
  StudentKYC,
  SocietyMemberKYC,
  PendingKYCResponse,
  KYCApprovalRequest,
  KYCRejectionRequest,
  KYCResponse,
} from './kycService';

// Re-export Course and Batch types
export type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseFilters,
  CoursesResponse,
  CourseResponse,
  CourseWithBatchesResponse,
  CourseStatistics,
  CourseStatisticsResponse,
  Batch,
  CreateBatchRequest,
  UpdateBatchRequest,
  BatchFilters,
  BatchesResponse,
  BatchResponse,
  BatchesByCourseResponse,
  BatchStatistics,
  BatchStatisticsResponse,
  TimeSlot,
  EnrolledStudent,
  Instructor,
  Address,
  CourseRating,
  Enrollment,
  EnrollmentsByStudentResponse,
  FeeRequest,
  CreateFeeRequestRequest,
  UpdateFeeRequestRequest,
  FeeRequestFilters,
  FeeRequestsResponse,
  FeeRequestResponse,
  FeeStatistics,
  FeeStatisticsResponse,
  StudentWithEnrollments,
  StudentEnrollment,
  StudentsWithEnrollmentsResponse,
  FeePayment,
  RecordPaymentRequest,
  PaymentHistoryResponse,
  RecordPaymentResponse,
  StudentFeeSummary,
  StudentFeeRequestsResponse,
  FeeStatisticsEnhanced,
  FeeStatisticsEnhancedResponse,
  AttendanceRecord,
  AttendanceSession,
  StudentAttendanceSummary,
  AttendanceReport,
  CreateAttendanceSessionRequest,
  MarkAttendanceRequest,
  AttendanceFilters,
  AttendanceSessionsResponse,
  AttendanceReportResponse,
  StudentAttendanceResponse,
  Subject,
  CreateMarksheetRequest,
  Marksheet,
  MarksheetResponse,
  MarksheetFilters,
  MarksheetPagination,
} from './types';
