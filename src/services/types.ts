// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
}

// Admin Types
export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

export interface AuthResponse {
  admin: Admin;
  token: string;
}

export interface ProfileResponse {
  user: Admin;
  userType: string;
}

// Token Management
export interface TokenData {
  token: string;
  expiresAt: number;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Request Configuration
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  params?: Record<string, any>;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Enhanced Pagination for User Management
export interface UserManagementPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  itemsPerPage: number;
}

// User Management Filter Types
export interface StudentFilters {
  search?: string;
  department?: string;
  year?: string;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  isActive?: boolean;
  isVerified?: boolean;
  courseId?: string;
  batchId?: string;
  enrollmentDateFrom?: string;
  enrollmentDateTo?: string;
}

export interface SocietyMemberFilters {
  search?: string;
  societyName?: string;
  position?: string;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  isActive?: boolean;
  isVerified?: boolean;
  membershipDateFrom?: string;
  membershipDateTo?: string;
  contributionAmountMin?: number;
  contributionAmountMax?: number;
}

export interface AdminFilters {
  search?: string;
  role?: string;
  permissions?: string[];
  isActive?: boolean;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}

// KYC Information Types
export interface KYCInfo {
  _id?: string;
  status: 'approved' | 'pending' | 'rejected' | 'not_submitted';
  submittedAt?: string;
  approvedAt?: string;
  reviewedAt?: string;
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviewedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  rejectionReason?: string;
  remarks?: string;
  aadharNumber?: string;
  aadharCardImage?: string;
  panNumber?: string;
  panCardImage?: string;
}

// Address Information
export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Enhanced User Types
export interface EnhancedStudent {
  _id: string;
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  originalPassword?: string;
  phone: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string | AddressInfo;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  department: string;
  year: string;
  academicYear: string;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  isActive: boolean;
  isVerified: boolean;
  profileImage?: string;
  profilePicture?: string;
  lastLogin?: string;
  interests?: string[];
  achievements?: string[];
  registeredSocieties?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents?: {
    id: string;
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  kyc?: KYCInfo;
  // New fields from the updated API
  enrollments?: StudentEnrollment[];
  enrollmentStats?: {
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    totalCourses: number;
    totalBatches: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EnhancedSocietyMember {
  _id: string;
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string | AddressInfo;
  membershipDate: string;
  status: 'active' | 'inactive' | 'suspended';
  societyName: string;
  position: string;
  totalContribution: number;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  isActive: boolean;
  isVerified: boolean;
  profileImage?: string;
  profilePicture?: string;
  lastLogin?: string;
  skills?: string[];
  responsibilities?: string[];
  achievements?: string[];
  eventsOrganized?: string[];
  documents?: {
    id: string;
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  paymentHistory?: {
    id: string;
    amount: number;
    date: string;
    type: string;
    status: string;
  }[];
  kyc?: KYCInfo;
  createdAt: string;
  updatedAt: string;
}

export interface EnhancedAdmin {
  _id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: string;
  profileImage?: string;
  department?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// User Management Response Types
export interface StudentsResponse {
  students: EnhancedStudent[];
  pagination: UserManagementPagination;
}

export interface SocietyMembersResponse {
  societyMembers: EnhancedSocietyMember[];
  pagination: UserManagementPagination;
}

export interface AdminsResponse {
  admins: EnhancedAdmin[];
  pagination: UserManagementPagination;
}

// Bulk Action Types
export interface BulkActionRequest {
  action: 'activate' | 'deactivate' | 'verify' | 'unverify' | 'delete' | 'export';
  userIds: string[];
  reason?: string;
}

export interface BulkActionResponse {
  success: boolean;
  message: string;
  data: {
    processed: number;
    failed: number;
    errors?: string[];
  };
}

// Approved KYC Types
export interface ApprovedKYCStudent {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId: string;
  department: string;
  year: string;
  kycStatus: 'approved';
  kyc: {
    status: 'approved';
    submittedAt: string;
    reviewedAt: string;
    reviewedBy: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    rejectionReason: null;
    remarks: string;
    aadharNumber: string;
    aadharCardImage: string;
  };
}

export interface ApprovedKYCSocietyMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  memberId: string;
  societyName: string;
  position: string;
  kycStatus: 'approved';
  kyc: {
    status: 'approved';
    submittedAt: string;
    reviewedAt: string;
    reviewedBy: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    rejectionReason: null;
    remarks: string;
    aadharNumber: string;
    panNumber?: string;
    aadharCardImage: string;
    panCardImage?: string;
  };
}

export interface ApprovedKYCStudentsResponse {
  students: ApprovedKYCStudent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalStudents: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApprovedKYCSocietyMembersResponse {
  societyMembers: ApprovedKYCSocietyMember[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMembers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Course Management Types
export interface Instructor {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  qualifications?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface CourseRating {
  average: number;
  count: number;
}

export interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  type: 'online' | 'offline' | 'hybrid';
  category: string;
  instructor: Instructor;
  price: number;
  currency?: string;
  duration: number;
  durationUnit?: string;
  thumbnail?: string;
  syllabus?: string;
  coursePdf?: string; // For online courses
  videoUrl?: string; // For online courses
  venue?: string; // For offline courses
  address?: Address; // For offline courses
  maxStudents?: number; // For offline courses
  status: 'draft' | 'published' | 'archived';
  isActive: boolean;
  tags?: string[];
  prerequisites?: string[];
  learningObjectives?: string[];
  courseContent?: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  enrollmentCount: number;
  slug: string;
  rating: CourseRating;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  type: 'online' | 'offline' | 'hybrid';
  category: string;
  status: 'draft' | 'published' | 'archived';
  instructor: Instructor;
  price: number;
  currency?: string;
  duration: number;
  durationUnit?: string;
  maxStudents: number;
  thumbnail: File | null;
  syllabus?: File | null;
  coursePdf?: File; // For online courses
  videoUrl?: string; // For online courses
  venue?: string; // For offline courses
  address?: Address; // For offline courses
  tags?: string;
  prerequisites?: string;
  learningObjectives?: string;
  courseContent?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  status?: 'draft' | 'published' | 'archived';
  isActive?: boolean;
}

export interface CourseFilters {
  search?: string;
  type?: 'online' | 'offline';
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export interface CoursePagination {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CoursesResponse {
  success: boolean;
  message: string;
  data: {
    courses: Course[];
    pagination: CoursePagination;
    filters?: {
      applied: string;
      sortBy: string;
      sortOrder: string;
    };
  };
}

export interface CourseResponse {
  success: boolean;
  message: string;
  data: {
    course: Course;
  };
}

export interface CourseWithBatchesResponse {
  success: boolean;
  message: string;
  data: {
    course: Course;
    batches: Batch[];
  };
}

export interface CourseStatistics {
  totalCourses: number;
  onlineCourses: number;
  offlineCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  averageRating: number;
}

export interface CourseStatisticsResponse {
  success: boolean;
  message: string;
  data: CourseStatistics;
}

// Batch Management Types
export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  isActive: boolean;
}

export interface EnrolledStudent {
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  enrolledAt: string;
  status: 'enrolled' | 'completed' | 'dropped';
}

export interface Batch {
  _id: string;
  name: string;
  description: string;
  courseId: string | {
    _id: string;
    title: string;
    type: 'online' | 'offline';
    category: string;
    price?: number;
    description?: string;
  };
  timeSlots: TimeSlot[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  maxStudents: number;
  enrolledStudents: EnrolledStudent[];
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  createdBy: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  isActive: boolean;
  allowLateRegistration: boolean;
  enrollmentCount: number;
  availableSpots: number;
  durationInDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchRequest {
  name: string;
  description: string;
  courseId: string;
  timeSlots: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  maxStudents: number;
  price: number;
  currency?: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  allowLateRegistration?: boolean;
}

export interface UpdateBatchRequest extends Partial<CreateBatchRequest> {
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  isActive?: boolean;
}

export interface BatchFilters {
  search?: string;
  courseId?: string;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface BatchesResponse {
  success: boolean;
  message: string;
  data: {
    batches: Batch[];
    pagination: UserManagementPagination;
  };
}

export interface BatchResponse {
  success: boolean;
  message: string;
  data: {
    batch: Batch;
  };
}

export interface BatchesByCourseResponse {
  success: boolean;
  message: string;
  data: {
    course: {
      _id: string;
      title: string;
      type: 'online' | 'offline';
    };
    batches: Batch[];
  };
}

export interface BatchStatistics {
  totalBatches: number;
  scheduledBatches: number;
  ongoingBatches: number;
  completedBatches: number;
  totalEnrollments: number;
  averageEnrollment: number;
}

export interface BatchStatisticsResponse {
  success: boolean;
  message: string;
  data: BatchStatistics;
}

// Enrollment Management Types
export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline' | 'hybrid';
  };
  batchId: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  enrollmentDate: string;
  status: 'enrolled' | 'completed' | 'dropped' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentAmount?: number;
  paymentDate?: string;
  completionDate?: string;
  grade?: string;
  certificateIssued?: boolean;
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentsByStudentResponse {
  success: boolean;
  message: string;
  data: {
    enrollments: Enrollment[];
  };
}

// Fee Management Types
export interface FeeRequest {
  _id: string;
  studentId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  courseId: string | {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline' | 'hybrid';
  };
  batchId: string | {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  totalAmount: number;
  currency: string;
  paymentMethod: 'online' | 'cash';
  status: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  requestDate: string;
  notes?: string;
  createdBy: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeeRequestRequest {
  studentId: string;
  courseId: string;
  batchId: string;
  totalAmount: number;
  currency?: string;
  paymentMethod: 'online' | 'cash';
  dueDate: string;
  notes?: string;
}

export interface UpdateFeeRequestRequest extends Partial<CreateFeeRequestRequest> {
  status?: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  paidAmount?: number;
  remainingAmount?: number;
}

export interface FeeRequestFilters {
  search?: string;
  studentId?: string;
  courseId?: string;
  batchId?: string;
  status?: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  paymentMethod?: 'online' | 'cash';
  dueDateFrom?: string;
  dueDateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

export interface FeeRequestsResponse {
  success: boolean;
  message: string;
  data: {
    feeRequests: FeeRequest[];
    pagination: UserManagementPagination;
  };
}

export interface FeeRequestResponse {
  success: boolean;
  message: string;
  data: {
    feeRequest: FeeRequest;
  };
}

export interface FeeStatistics {
  totalFeeRequests: number;
  pendingRequests: number;
  paidRequests: number;
  partialRequests: number;
  overdueRequests: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
}

export interface FeeStatisticsResponse {
  success: boolean;
  message: string;
  data: FeeStatistics;
}

// Students with Enrollments Types
export interface StudentWithEnrollments {
  studentId: string;
  studentDetails: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    studentId: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
    createdAt: string;
  };
  enrollmentStats: {
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    totalCourses: number;
    totalBatches: number;
  };
  enrollments: StudentEnrollment[];
}

export interface StudentEnrollment {
  enrollmentId: string;
  enrollmentDate: string;
  status: 'enrolled' | 'completed' | 'dropped' | 'suspended';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  progress: {
    completedLessons: string[];
    overallProgress: number;
    lastAccessedAt: string;
  };
  course: {
    id: string;
    title: string;
    category: string;
    type: 'online' | 'offline' | 'hybrid';
    instructor: {
      name: string;
      email: string;
      phone?: string;
      bio?: string;
    };
    duration: number;
    durationUnit: 'days' | 'weeks' | 'months' | 'years';
    price: number;
    currency: string;
  };
  batch: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
    price: number;
    currency: string;
    timeSlots: {
      date: string;
      startTime: string;
      endTime: string;
      duration: number;
      isActive: boolean;
    }[];
  };
}

export interface StudentsWithEnrollmentsResponse {
  success: boolean;
  message: string;
  data: {
    overallStats: {
      totalStudents: number;
      totalEnrollments: number;
      studentsWithEnrollments: number;
      studentsWithoutEnrollments: number;
      totalCourses: number;
      totalBatches: number;
    };
    students: StudentWithEnrollments[];
  };
}

// Payment Management Types
export interface FeePayment {
  _id: string;
  feeRequestId: string;
  studentId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  courseId: string | {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline' | 'hybrid';
  };
  batchId: string | {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  amount: number;
  currency: string;
  paymentMethod: 'online' | 'cash' | 'bank_transfer' | 'cheque';
  paymentStatus: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentDate: string;
  transactionId?: string;
  paymentReference?: string;
  receiptNumber?: string;
  notes?: string;
  collectedBy: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface RecordPaymentRequest {
  feeRequestId: string;
  amount: number;
  paymentMethod: 'online' | 'cash' | 'bank_transfer' | 'cheque';
  transactionId?: string;
  paymentReference?: string;
  notes?: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  message: string;
  data: {
    payments: FeePayment[];
    pagination: UserManagementPagination;
  };
}

export interface RecordPaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: FeePayment;
    updatedFeeRequest: {
      id: string;
      totalAmount: number;
      paidAmount: number;
      remainingAmount: number;
      status: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
    };
  };
}

export interface StudentFeeSummary {
  totalRequests: number;
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  pendingRequests: number;
  overdueRequests: number;
  paidRequests: number;
}

export interface StudentFeeRequestsResponse {
  success: boolean;
  message: string;
  data: {
    summary: StudentFeeSummary;
    feeRequests: FeeRequest[];
  };
}

export interface FeeStatisticsEnhanced {
  summary: {
    totalFeeRequests: number;
    totalAmount: number;
    totalPaid: number;
    totalRemaining: number;
    overdueCount: number;
  };
  statusBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  paymentMethodBreakdown: Array<{
    _id: string;
    count: number;
  }>;
}

export interface FeeStatisticsEnhancedResponse {
  success: boolean;
  message: string;
  data: FeeStatisticsEnhanced;
}

// Attendance Management Types
export interface AttendanceRecord {
  _id: string;
  studentId: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  courseId: string | {
    _id: string;
    title: string;
    category: string;
    type: 'online' | 'offline' | 'hybrid';
  };
  batchId: string | {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  sessionId: string;
  sessionDate: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  markedBy: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSession {
  _id: string;
  courseId: string | {
    _id: string;
    title: string;
    category: string;
  };
  batchId: string | {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  sessionDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  topic?: string;
  description?: string;
  isActive: boolean;
  attendanceRecords: AttendanceRecord[];
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  createdBy: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudentAttendanceSummary {
  studentId: string;
  studentDetails: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
  };
  courseId: string | {
    _id: string;
    title: string;
    category: string;
  };
  batchId: string | {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
  lastAttendanceDate?: string;
  attendanceRecords: AttendanceRecord[];
}

export interface AttendanceReport {
  courseId: string | {
    _id: string;
    title: string;
    category: string;
  };
  batchId: string | {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  totalSessions: number;
  totalStudents: number;
  overallAttendancePercentage: number;
  studentSummaries: StudentAttendanceSummary[];
  sessionDetails: AttendanceSession[];
  statistics: {
    averageAttendance: number;
    bestAttendance: number;
    worstAttendance: number;
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    totalExcused: number;
  };
}

export interface CreateAttendanceSessionRequest {
  courseId: string;
  batchId: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  topic?: string;
  description?: string;
}

export interface MarkAttendanceRequest {
  sessionId: string;
  attendanceRecords: {
    studentId: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    checkInTime?: string;
    notes?: string;
  }[];
}

// New interface for single student attendance marking
export interface MarkSingleStudentAttendanceRequest {
  studentId: string;
  courseId: string;
  batchId: string;
  attendanceDate: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  remarks?: string;
}

// Simplified interface for single student attendance marking (auto-detects course/batch)
export interface MarkSimpleAttendanceRequest {
  studentId: string;
  attendanceDate: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timeSlot: {
    startTime: string;
    endTime: string;
  };
  remarks?: string;
}

// Response interface for simplified attendance marking
export interface SimpleAttendanceResponse {
  attendance: {
    id: string;
    student: {
      _id: string;
      firstName: string;
      lastName: string;
      studentId: string;
      email: string;
    };
    course: {
      _id: string;
      title: string;
      category: string;
      type: string;
    };
    batch: {
      _id: string;
      name: string;
      startDate: string;
      endDate: string;
    };
    attendanceDate: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    timeSlot: {
      startTime: string;
      endTime: string;
      duration: number;
    };
    remarks?: string;
    markedBy: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    createdAt: string;
  };
}

// Student Attendance Report Types
export interface StudentAttendanceReportRequest {
  studentId: string;
  year?: string;
  month?: string;
  startDate?: string;
  endDate?: string;
}

export interface StudentAttendanceReportResponse {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    email: string;
    phoneNumber: string;
  };
  enrollments: Array<{
    id: string;
    course: {
      _id: string;
      title: string;
      category: string;
      type: string;
    };
    batch: {
      _id: string;
      name: string;
      startDate: string;
      endDate: string;
    };
    enrollmentDate: string;
    status: string;
    approvalStatus: string;
  }>;
  summary: {
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    overallAttendanceRate: number;
  };
  monthlyReport: Array<{
    month: string;
    monthKey: string;
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
    records: Array<{
      id: string;
      date: string;
      status: string;
      timeSlot: {
        startTime: string;
        endTime: string;
        duration: number;
      };
      remarks?: string;
      course: {
        _id: string;
        title: string;
        category: string;
        type: string;
      };
      batch: {
        _id: string;
        name: string;
        startDate: string;
        endDate: string;
      };
      markedBy: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      createdAt: string;
    }>;
  }>;
  filter: {
    year: string | null;
    month: string | null;
    startDate: string | null;
    endDate: string | null;
  };
}

// Investment Management Types
export interface InvestmentPlan {
  _id: string;
  planName: string;
  planType: 'FD' | 'RD' | 'CD';
  description: string;
  minimumAmount: number;
  maximumAmount: number;
  interestRate: number;
  tenureMonths: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  penaltyConfig: {
    latePaymentPenalty: number;
    penaltyPercentage: number;
    gracePeriodDays: number;
  };
  emiCostStructure: {
    planType: 'FD' | 'RD' | 'CD';
    costStructure: {
      minimumInvestment?: number;
      maximumInvestment?: number;
      investmentIncrements?: number;
      minimumMonthlyInstallment?: number;
      maximumMonthlyInstallment?: number;
      installmentIncrements?: number;
      gracePeriodDays?: number;
      minimumCertificateValue?: number;
      maximumCertificateValue?: number;
      certificateIncrements?: number;
      certificateNumberPrefix?: string;
    };
  };
  features: Array<{
    feature: string;
    description: string;
  }>;
  termsAndConditions: Array<{
    term: string;
  }>;
  isActive: boolean;
  statistics?: {
    totalInvestments: number;
    totalAmountInvested: number;
    activeInvestments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EMICost {
  planType: 'FD' | 'RD' | 'CD';
  principalAmount: number;
  maturityAmount: number;
  totalInterest: number;
  monthlyInterest: number;
  emiCost: {
    oneTimeInvestment?: number;
    monthlyInstallment?: number;
    monthlyInterestEarned: number;
    totalReturn: number;
  };
  costBreakdown: {
    investment: number;
    interest: number;
    maturity: number;
  };
}

export interface SampleEMICost {
  planType: 'FD' | 'RD' | 'CD';
  principalAmount: number;
  maturityAmount: number;
  totalInterest: number;
  monthlyInterest: number;
  emiCost?: {
    oneTimeInvestment?: number;
    monthlyInstallment?: number;
    monthlyInterestEarned: number;
    totalReturn: number;
  };
  costBreakdown?: {
    investment: number;
    interest: number;
    maturity: number;
  };
}

export interface CreateInvestmentPlanRequest {
  planName: string;
  planType: 'FD' | 'RD' | 'CD';
  description: string;
  minimumAmount: number;
  maximumAmount: number;
  interestRate: number;
  tenureMonths: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  penaltyConfig: {
    latePaymentPenalty: number;
    penaltyPercentage: number;
    gracePeriodDays: number;
  };
  emiCostStructure: {
    fd?: {
      minimumInvestment: number;
      maximumInvestment: number;
      investmentIncrements: number;
    };
    rd?: {
      minimumMonthlyInstallment: number;
      maximumMonthlyInstallment: number;
      installmentIncrements: number;
      gracePeriodDays: number;
    };
    cd?: {
      minimumCertificateValue: number;
      maximumCertificateValue: number;
      certificateIncrements: number;
      certificateNumberPrefix: string;
    };
  };
  features: Array<{
    feature: string;
    description: string;
  }>;
  termsAndConditions: Array<{
    term: string;
  }>;
}

export interface CalculateEMIRequest {
  amount: number;
  planType: 'FD' | 'RD' | 'CD';
  monthlyInstallment?: number;
}

export interface InvestmentPlanResponse {
  plan: InvestmentPlan;
  sampleEMICosts?: SampleEMICost[];
}

export interface EMICalculationResponse {
  plan: {
    planName: string;
    planType: 'FD' | 'RD' | 'CD';
    interestRate: number;
    tenureMonths: number;
  };
  emiCost: EMICost;
  calculation?: {
    annualizedReturn: string;
  };
}

export interface SampleEMICostsResponse {
  plan: {
    planName: string;
    planType: 'FD' | 'RD' | 'CD';
    interestRate: number;
    tenureMonths: number;
  };
  emiCostStructure: {
    planType: 'FD' | 'RD' | 'CD';
    costStructure: any;
  };
  sampleEMICosts: SampleEMICost[];
}

export interface AvailablePlansResponse {
  plans: InvestmentPlan[];
}

export interface MemberInvestment {
  _id: string;
  memberId: string;
  planId: string;
  plan: InvestmentPlan;
  principalAmount: number;
  monthlyInstallment?: number;
  startDate: string;
  maturityDate: string;
  status: 'active' | 'completed' | 'cancelled';
  totalInvested: number;
  totalInterestEarned: number;
  currentValue: number;
  emiSchedule?: Array<{
    emiNumber: number;
    dueDate: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    paidDate?: string;
    penaltyAmount: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentSummary {
  totalInvestments: number;
  activeInvestments: number;
  completedInvestments: number;
  totalPrincipalAmount: number;
  totalExpectedMaturity: number;
  totalInterestEarned: number;
  totalPenaltyPaid: number;
  netReturn: number;
}

export interface MemberInvestmentsResponse {
  investments: MemberInvestment[];
  summary: InvestmentSummary;
}

export interface CreateInvestmentRequest {
  planId: string;
  memberId: string;
  principalAmount: number;
  monthlyInstallment?: number;
}

export interface CreateInvestmentResponse {
  investment: {
    investmentId: string;
    planName: string;
    planType: string;
    principalAmount: number;
    expectedMaturityAmount: number;
    investmentDate: string;
    maturityDate: string;
    status: string;
  };
}

export interface InvestmentFilters {
  planId?: string;
  memberId?: string;
  status?: 'active' | 'completed' | 'cancelled' | 'defaulted';
  planType?: 'FD' | 'RD' | 'CD';
  startDate?: string;
  endDate?: string;
}

export interface PlanStatistics {
  plan: {
    planName: string;
    planType: string;
    interestRate: number;
  };
  statistics: {
    totalInvestments: number;
    activeInvestments: number;
    completedInvestments: number;
    totalAmountInvested: number;
    totalInterestEarned: number;
    emiStatistics: {
      totalEMIs: number;
      paidEMIs: number;
      pendingEMIs: number;
      overdueEMIs: number;
    };
  };
}

export interface AttendanceFilters {
  courseId?: string;
  batchId?: string;
  studentId?: string;
  status?: 'present' | 'absent' | 'late' | 'excused';
  startDate?: string;
  endDate?: string;
}

export interface AttendanceSessionsResponse {
  success: boolean;
  message: string;
  data: {
    sessions: AttendanceSession[];
    pagination: UserManagementPagination;
  };
}

export interface AttendanceReportResponse {
  success: boolean;
  message: string;
  data: AttendanceReport;
}

export interface StudentAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    studentAttendance: StudentAttendanceSummary[];
    pagination: UserManagementPagination;
  };
}

// Investment Application Management Types
export interface InvestmentApplication {
  applicationId: string;
  status: 'pending' | 'approved' | 'rejected';
  investmentAmount: number;
  totalAmountPaid: number;
  remainingAmount: number;
  paymentStatus: 'pending' | 'partial' | 'completed';
  emiProgress: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  member: {
    firstName: string;
    lastName: string;
    email: string;
    memberId: string;
    phoneNumber?: string;
  };
  plan: {
    planName: string;
    planType: 'FD' | 'RD' | 'CD';
    interestRate: number;
    tenureMonths: number;
  };
  applicationDate: string;
  approvalDate?: string;
  rejectionDate?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  notes?: string[];
  documents?: Array<{
    id: string;
    type: string;
    url: string;
    status: 'pending' | 'approved' | 'rejected';
  }>;
  emiSchedule?: Array<{
    emiNumber: number;
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
  }>;
  monthlyEMI?: number;
  paymentMethod?: 'online' | 'cash' | 'bank_transfer';
}

export interface InvestmentApplicationFilters {
  page?: number;
  limit?: number;
  planType?: 'FD' | 'RD' | 'CD';
  memberId?: string;
  search?: string;
  status?: 'pending' | 'approved' | 'rejected';
  applicationDateFrom?: string;
  applicationDateTo?: string;
}

export interface InvestmentApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    applications: InvestmentApplication[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalApplications: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface InvestmentApplicationDetailResponse {
  success: boolean;
  message: string;
  data: {
    application: InvestmentApplication;
  };
}

export interface ApproveInvestmentApplicationRequest {
  notes?: string;
}

export interface RejectInvestmentApplicationRequest {
  rejectionReason: string;
  notes?: string;
}

export interface InvestmentApplicationActionResponse {
  success: boolean;
  message: string;
  data: {
    application: {
      applicationId: string;
      status: 'approved' | 'rejected';
      approvalDate?: string;
      rejectionDate?: string;
      approvedBy?: string;
      rejectedBy?: string;
      rejectionReason?: string;
    };
    investment?: {
      investmentId: string;
      status: 'active';
      principalAmount: number;
      expectedMaturityAmount: number;
    };
  };
}

// Marksheet Types
export interface Subject {
  subjectName: string;
  subjectCode: string;
  credits: number;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  gradePoints: number;
}

export interface CreateMarksheetRequest {
  studentId: string;
  courseId: string;
  batchId: string;
  academicYear: string;
  semester: string;
  examinationType: 'Regular' | 'Supplementary' | 'Improvement';
  subjects: Subject[];
  examinationDate: string;
  resultDate: string;
  remarks?: string;
}

export interface Marksheet {
  _id: string;
  marksheetNumber: string;
  studentId: string;
  studentInfo: {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    year: string;
  };
  courseId: string;
  courseInfo: {
    courseId: string;
    title: string;
    category: string;
    instructor: string;
    duration: string;
  };
  batchId: string;
  batchInfo: {
    batchId: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  academicYear: string;
  semester: string;
  examinationType: 'Regular' | 'Supplementary' | 'Improvement';
  subjects: Subject[];
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  cgpa: number;
  overallGrade: string;
  result: 'PASS' | 'FAIL';
  status: 'draft' | 'published' | 'verified';
  isVerified: boolean;
  verificationCode: string;
  examinationDate: string;
  resultDate: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarksheetResponse {
  success: boolean;
  message: string;
  data: {
    marksheet: Marksheet;
    student: {
      studentId: string;
      firstName: string;
      lastName: string;
      email: string;
      department: string;
      year: string;
    };
    course: {
      courseId: string;
      title: string;
      category: string;
      instructor: string;
      duration: string;
    };
    batch: {
      batchId: string;
      name: string;
      startDate: string;
      endDate: string;
    };
  };
}

export interface MarksheetFilters {
  search?: string;
  studentId?: string;
  courseId?: string;
  batchId?: string;
  academicYear?: string;
  semester?: string;
  examinationType?: 'Regular' | 'Supplementary' | 'Improvement';
  status?: 'draft' | 'published' | 'verified';
  isVerified?: boolean;
  result?: 'PASS' | 'FAIL';
  department?: string;
  year?: string;
}

export interface MarksheetPagination {
  currentPage: number;
  totalPages: number;
  totalMarksheets: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// CD Investment Management Types
export interface CDInvestment {
  _id: string;
  id: string;
  cdId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId?: string;
    memberId?: string;
  };
  userType: 'Student' | 'SocietyMember';
  userEmail: string;
  userMemberId?: string;
  userStudentId?: string;
  userDisplayName: string;
  investmentAmount: number;
  tenureMonths: number;
  interestRate: number;
  maturityAmount: number;
  totalInterest: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'matured' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  cdType: 'fixed' | 'flexible';
  isRenewable: boolean;
  autoRenewal: boolean;
  purpose?: string;
  notes?: string;
  requestDate: string;
  approvalDate?: string;
  maturityDate?: string;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CDInvestmentFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'active' | 'matured' | 'cancelled';
  userType?: 'Student' | 'SocietyMember';
  search?: string;
  requestDateFrom?: string;
  requestDateTo?: string;
  investmentAmountMin?: number;
  investmentAmountMax?: number;
}

export interface CDInvestmentPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface CDInvestmentSummary {
  Student: {
    count: number;
    totalAmount: number;
  };
  SocietyMember: {
    count: number;
    totalAmount: number;
  };
}

export interface CDInvestmentStatistics {
  overall: {
    _id: string | null;
    totalInvestments: number;
    totalAmount: number;
    totalMaturityAmount: number;
    totalInterest: number;
    avgInvestmentAmount: number;
    avgInterestRate: number;
  };
  byStatus: {
    [key: string]: {
      count: number;
      totalAmount: number;
    };
  };
  byUserType: {
    Student?: {
      count: number;
      totalAmount: number;
    };
    SocietyMember?: {
      count: number;
      totalAmount: number;
    };
  };
}

export interface PendingCDRequestsResponse {
  success: boolean;
  data: {
    requests: CDInvestment[];
    pagination: CDInvestmentPagination;
    summary: CDInvestmentSummary;
  };
}

export interface AllCDInvestmentsResponse {
  success: boolean;
  data: {
    investments: CDInvestment[];
    pagination: CDInvestmentPagination;
    statistics: CDInvestmentStatistics;
  };
}

export interface ApproveCDRequestRequest {
  adminNotes?: string;
}

export interface RejectCDRequestRequest {
  rejectionReason: string;
  adminNotes?: string;
}

export interface CDInvestmentActionResponse {
  success: boolean;
  message: string;
  data: {
    investment: {
      cdId: string;
      status: 'approved' | 'rejected';
      approvalDate?: string;
      maturityDate?: string;
      adminNotes?: string;
      rejectionReason?: string;
    };
  };
}

// Dashboard Types
export interface DashboardAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

export interface DashboardOverview {
  totalUsers: number;
  totalStudents: number;
  totalSocietyMembers: number;
  totalAdmins: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface CDInvestmentsData {
  total: number;
  totalAmount: number;
  pending: number;
  approved: number;
}

export interface RegularInvestmentsData {
  total: number;
  totalAmount: number;
  pending: number;
}

export interface CombinedInvestmentsData {
  totalInvestments: number;
  totalAmount: number;
}

export interface DashboardInvestments {
  cdInvestments: CDInvestmentsData;
  regularInvestments: RegularInvestmentsData;
  combined: CombinedInvestmentsData;
}

export interface DashboardLoans {
  totalRequests: number;
  totalAmount: number;
  pending: number;
  approved: number;
  disbursed: number;
}

export interface DashboardFees {
  totalRequests: number;
  totalAmount: number;
  pending: number;
  totalPayments: number;
  totalCollected: number;
}

export interface DashboardAcademics {
  totalCourses: number;
  totalBatches: number;
  totalEnrollments: number;
  activeEnrollments: number;
  totalAttendanceRecords: number;
  attendanceThisMonth: number;
}

export interface ChartDataPoint {
  month: string;
  count: number;
  amount?: number;
}

export interface UserGrowthChart {
  students: ChartDataPoint[];
  societyMembers: ChartDataPoint[];
}

export interface FinancialChart {
  cdInvestments: ChartDataPoint[];
  loans: ChartDataPoint[];
  fees: ChartDataPoint[];
}

export interface DashboardCharts {
  userGrowth: UserGrowthChart;
  financial: FinancialChart;
}

export interface MonthlyStats {
  current: {
    students: number;
    societyMembers: number;
    cdInvestments: { count: number; amount: number };
    loans: { count: number; amount: number };
    fees: { count: number; amount: number };
  };
  last: {
    students: number;
    societyMembers: number;
    cdInvestments: { count: number; amount: number };
    loans: { count: number; amount: number };
    fees: { count: number; amount: number };
  };
  growth: {
    students: number;
    societyMembers: number;
    cdInvestments: number;
    loans: number;
    fees: number;
  };
}

export interface DepartmentStat {
  _id: string;
  count: number;
}

export interface DepartmentStats {
  students: DepartmentStat[];
  societyMembers: DepartmentStat[];
  courses: DepartmentStat[];
}

export interface StatusBreakdown {
  _id: string;
  count: number;
}

export interface StatusBreakdowns {
  cdInvestments: StatusBreakdown[];
  loans: StatusBreakdown[];
  feeRequests: StatusBreakdown[];
  enrollments: StatusBreakdown[];
}

export interface RecentActivityUser {
  _id: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  memberId?: string;
  email: string;
  createdAt: string;
}

export interface RecentCDInvestment {
  _id: string;
  cdId: string;
  investmentAmount: number;
  status: string;
  requestDate: string;
  userEmail?: string;
  userMemberId?: string;
  userDisplayName?: string;
  id?: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    memberId?: string;
  };
}

export interface RecentLoanRequest {
  _id: string;
  loanAmount: number;
  status: string;
  requestDate?: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    memberId?: string;
  };
}

export interface RecentFeePayment {
  _id: string;
  amount: number;
  paymentDate: string;
  userId?: {
    _id: string;
    firstName: string;
    lastName: string;
    studentId?: string;
    memberId?: string;
  };
}

export interface RecentActivities {
  students: RecentActivityUser[];
  societyMembers: RecentActivityUser[];
  cdInvestments: RecentCDInvestment[];
  loanRequests: RecentLoanRequest[];
  feePayments: RecentFeePayment[];
}

export interface SystemHealth {
  activeUsers: number;
  activeCourses: number;
  activeBatches: number;
  systemUptime: number;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalInvestments: number;
  totalPendingApprovals: number;
  systemHealth: SystemHealth;
}

export interface DashboardData {
  admin: DashboardAdmin;
  overview: DashboardOverview;
  investments: DashboardInvestments;
  loans: DashboardLoans;
  fees: DashboardFees;
  academics: DashboardAcademics;
  charts: DashboardCharts;
  monthlyStats: MonthlyStats;
  departmentStats: DepartmentStats;
  statusBreakdowns: StatusBreakdowns;
  recentActivities: RecentActivities;
  summary: DashboardSummary;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}
