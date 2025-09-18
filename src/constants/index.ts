// Application Constants

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Status Options
export const STATUS_OPTIONS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

// KYC Status Options
export const KYC_STATUS_OPTIONS = {
  ALL: 'all',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Department Options
export const DEPARTMENT_OPTIONS = {
  ALL: 'all',
  COMPUTER_SCIENCE: 'computer-science',
  ENGINEERING: 'engineering',
  BUSINESS: 'business',
  MATHEMATICS: 'mathematics',
} as const;

// Course Types
export const COURSE_TYPES = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  HYBRID: 'hybrid',
} as const;

// Enrollment Status
export const ENROLLMENT_STATUS = {
  PENDING: 'pending',
  ENROLLED: 'enrolled',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIAL: 'partial',
} as const;

// Approval Status
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  TIME: 'HH:mm',
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 4000,
  MODAL_Z_INDEX: 50,
  DROPDOWN_Z_INDEX: 40,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'admin_auth_token',
  REFRESH_TOKEN: 'admin_refresh_token',
  USER_DATA: 'admin_user_data',
  THEME: 'admin_theme',
  SIDEBAR_STATE: 'admin_sidebar_state',
} as const;

// Route Paths
export const ROUTES = {
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  
  // Society Management
  SOCIETY_MEMBERS: '/society/members',
  SOCIETY_PAYMENTS: '/society/payments',
  SOCIETY_LOANS: '/society/loans',
  SOCIETY_PENALTY: '/society/penalty',
  SOCIETY_INVESTMENT_PLANS: '/society/investment-plans',
  SOCIETY_PENDING_INVESTMENTS: '/society/pending-investment-applications',
  SOCIETY_APPROVED_INVESTMENTS: '/society/approved-investment-applications',
  SOCIETY_REJECTED_INVESTMENTS: '/society/rejected-investment-applications',
  
  // Student Management
  STUDENTS: '/student/students',
  STUDENT_COURSES: '/student/courses',
  STUDENT_BATCHES: '/student/course-batches',
  STUDENT_FEE_MANAGEMENT: '/student/fee-management',
  STUDENT_PAYMENT_HISTORY: '/student/payment-history',
  STUDENT_ATTENDANCE: '/student/attendance',
  STUDENT_CERTIFICATE_MANAGEMENT: '/student/certificate-management',
  STUDENT_MARKSHEETS: '/student/marksheet',
  STUDENT_ENROLLMENT_MANAGEMENT: '/student/enrollment-management',
  
  // KYC Management
  KYC_DASHBOARD: '/kyc',
  KYC_PENDING: '/kyc/pending',
  KYC_STUDENTS: '/kyc/students',
  KYC_SOCIETY_MEMBERS: '/kyc/society-members',
  KYC_APPROVED: '/kyc/approved',
  
  // Reports
  REPORTS_FINANCIAL: '/reports/financial',
  REPORTS_STUDENTS: '/reports/students',
  REPORTS_SOCIETY: '/reports/society',
  REPORTS_KYC: '/reports/kyc',
  
  // Settings
  SETTINGS: '/settings',
  HELP: '/help',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  LOGIN_REQUIRED: 'Please log in to continue.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  CREATED: 'Created successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  EXPORTED: 'Data exported successfully.',
  IMPORTED: 'Data imported successfully.',
  APPROVED: 'Approved successfully.',
  REJECTED: 'Rejected successfully.',
} as const;

// Color Classes for Status
export const STATUS_COLORS = {
  SUCCESS: 'bg-green-100 text-green-800',
  WARNING: 'bg-yellow-100 text-yellow-800',
  ERROR: 'bg-red-100 text-red-800',
  INFO: 'bg-blue-100 text-blue-800',
  GRAY: 'bg-gray-100 text-gray-800',
} as const;

// Icon Names
export const ICONS = {
  DASHBOARD: 'LayoutDashboard',
  USERS: 'Users',
  GRADUATION_CAP: 'GraduationCap',
  BOOK_OPEN: 'BookOpen',
  AWARD: 'Award',
  FILE_TEXT: 'FileText',
  CREDIT_CARD: 'CreditCard',
  BANKNOTE: 'Banknote',
  ALERT_TRIANGLE: 'AlertTriangle',
  SHIELD: 'Shield',
  SETTINGS: 'Settings',
  HELP_CIRCLE: 'HelpCircle',
  LOG_OUT: 'LogOut',
  PLUS: 'Plus',
  SEARCH: 'Search',
  FILTER: 'Filter',
  DOWNLOAD: 'Download',
  REFRESH: 'RefreshCw',
  EDIT: 'Edit',
  TRASH: 'Trash2',
  EYE: 'Eye',
  X: 'X',
  CHECK: 'Check',
  CHEVRON_DOWN: 'ChevronDown',
  CHEVRON_RIGHT: 'ChevronRight',
} as const;
