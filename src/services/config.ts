// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.padyai.co.in/api',
  // BASE_URL: 'http://localhost:3500/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/admin/login',
    SIGNUP: '/admin/signup',
    PROFILE: '/admin/profile',
    REFRESH: '/admin/refresh',
    LOGOUT: '/admin/logout',
  },
  // Admin Management
  ADMIN: {
    LIST: '/admin/list',
    CREATE: '/admin/create',
    UPDATE: '/admin/update',
    DELETE: '/admin/delete',
    BY_ID: (id: string) => `/admin/${id}`,
  },
  // Society Management
  SOCIETY: {
    MEMBERS: '/society/members',
    PAYMENTS: '/society/payments',
    LOANS: '/society/loans',
    PENALTIES: '/society/penalties',
  },
  // Student Management
  STUDENT: {
    STUDENTS: '/student/students',
    COURSE_BATCH: '/student/course-batch',
    CERTIFICATES: '/student/certificates',
    MARKSHEETS: '/student/marksheets',
  },
  // User Management (Admin Only)
  USER_MANAGEMENT: {
    STUDENTS: '/user-management/students',
    STUDENT_BY_ID: (id: string) => `/user-management/students/${id}`,
    STUDENT_BY_STUDENT_ID: (studentId: string) => `/user-management/students/by-student-id/${studentId}`,
    STUDENTS_APPROVED_KYC: '/user-management/students/approved-kyc',
    SOCIETY_MEMBERS: '/user-management/society-members',
    SOCIETY_MEMBER_BY_ID: (id: string) => `/user-management/society-members/${id}`,
    SOCIETY_MEMBER_BY_MEMBER_ID: (memberId: string) => `/user-management/society-members/by-member-id/${memberId}`,
    SOCIETY_MEMBERS_APPROVED_KYC: '/user-management/society-members/approved-kyc',
    ADMINS: '/user-management/admins',
    ADMIN_BY_ID: (id: string) => `/user-management/admins/${id}`,
    USERS: '/user-management/users',
    BULK_ACTIONS: '/user-management/bulk-actions',
  },
  // KYC Management (Admin Only)
  KYC: {
    PENDING: '/kyc/admin/pending',
    STUDENT_KYC: '/kyc/admin/student',
    SOCIETY_MEMBER_KYC: '/kyc/admin/society-member',
    APPROVE_STUDENT: '/kyc/admin/student/approve',
    REJECT_STUDENT: '/kyc/admin/student/reject',
    APPROVE_SOCIETY_MEMBER: '/kyc/admin/society-member/approve',
    REJECT_SOCIETY_MEMBER: '/kyc/admin/society-member/reject',
  },
  // Course Management (Admin Only)
  COURSES: {
    LIST: '/courses',
    CREATE: '/courses/create',
    BY_ID: (id: string) => `/courses/${id}`,
    UPDATE: (id: string) => `/courses/${id}`,
    DELETE: (id: string) => `/courses/${id}`,
    STATISTICS: '/courses/statistics',
  },
  // Batch Management (Admin Only)
  BATCHES: {
    LIST: '/batches',
    CREATE: '/batches/create',
    BY_ID: (id: string) => `/batches/${id}`,
    UPDATE: (id: string) => `/batches/${id}`,
    DELETE: (id: string) => `/batches/${id}`,
    BY_COURSE: (courseId: string) => `/batches/course/${courseId}`,
    STATISTICS: '/batches/statistics',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'admin_auth_token',
  REFRESH_TOKEN: 'admin_refresh_token',
  USER_DATA: 'admin_user_data',
} as const;
