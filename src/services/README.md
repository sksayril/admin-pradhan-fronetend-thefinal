# API Services Documentation

This folder contains all the API service implementations for the admin frontend application. The services are designed to handle communication with the backend API at `https://api.padyai.co.in/api`.

## 📁 Structure

```
src/services/
├── apiClient.ts          # Base HTTP client with interceptors
├── authService.ts        # Authentication services
├── societyService.ts     # Society management services
├── studentService.ts     # Student management services
├── types.ts             # TypeScript interfaces and types
├── config.ts            # API configuration and endpoints
├── utils.ts             # Utility functions
├── index.ts             # Service exports
└── README.md            # This documentation
```

## 🚀 Quick Start

### Import Services

```typescript
import { authService, societyService, studentService } from '../services';
```

### Basic Usage

```typescript
// Authentication
const response = await authService.login({ email: 'admin@example.com', password: 'password' });

// Society Management
const members = await societyService.getMembers();

// Student Management
const students = await studentService.getStudents();
```

## 🔧 Configuration

### API Configuration

The API configuration is centralized in `config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://api.padyai.co.in/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};
```

### Environment Variables

You can override the base URL using environment variables:

```bash
VITE_API_BASE_URL=https://api.padyai.co.in/api
```

## 🔐 Authentication

### Login

```typescript
import { authService } from '../services';

const loginData = {
  email: 'admin@example.com',
  password: 'Admin123'
};

try {
  const response = await authService.login(loginData);
  console.log('Login successful:', response.admin);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Signup

```typescript
const signupData = {
  email: 'admin@example.com',
  password: 'Admin123',
  firstName: 'John',
  lastName: 'Doe',
  role: 'admin',
  permissions: ['user-management', 'content-management']
};

try {
  const response = await authService.signup(signupData);
  console.log('Signup successful:', response.admin);
} catch (error) {
  console.error('Signup failed:', error.message);
}
```

### Profile Management

```typescript
// Get current profile
const profile = await authService.getProfile();

// Update profile
const updatedProfile = await authService.updateProfile({
  firstName: 'Jane',
  lastName: 'Smith'
});
```

## 🏢 Society Management

### Members

```typescript
import { societyService } from '../services';

// Get all members with pagination
const members = await societyService.getMembers({
  page: 1,
  limit: 10,
  sortBy: 'firstName',
  sortOrder: 'asc'
});

// Create new member
const newMember = await societyService.createMember({
  memberId: 'MEM001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  address: '123 Main St'
});

// Update member
const updatedMember = await societyService.updateMember('member-id', {
  status: 'active'
});
```

### Payments

```typescript
// Get payments
const payments = await societyService.getPayments();

// Create payment
const payment = await societyService.createPayment({
  memberId: 'member-id',
  amount: 1000,
  paymentType: 'monthly',
  description: 'Monthly contribution'
});

// Update payment status
const updatedPayment = await societyService.updatePaymentStatus('payment-id', 'completed');
```

### Loans

```typescript
// Get loans
const loans = await societyService.getLoans();

// Create loan
const loan = await societyService.createLoan({
  memberId: 'member-id',
  loanAmount: 50000,
  interestRate: 12,
  tenure: 24,
  description: 'Home improvement loan'
});

// Approve loan
const approvedLoan = await societyService.approveLoan('loan-id');
```

### Penalties

```typescript
// Get penalties
const penalties = await societyService.getPenalties();

// Create penalty
const penalty = await societyService.createPenalty({
  memberId: 'member-id',
  amount: 500,
  reason: 'Late payment',
  description: 'Penalty for late monthly contribution'
});
```

## 🎓 Student Management

### Students

```typescript
import { studentService } from '../services';

// Get students
const students = await studentService.getStudents();

// Create student
const student = await studentService.createStudent({
  studentId: 'STU001',
  firstName: 'Alice',
  lastName: 'Johnson',
  email: 'alice@example.com',
  phone: '+1234567890',
  dateOfBirth: '2000-01-01',
  address: '456 Oak St',
  courseId: 'course-id',
  batchId: 'batch-id'
});
```

### Course Batches

```typescript
// Get batches
const batches = await studentService.getBatches();

// Create batch
const batch = await studentService.createBatch({
  batchName: 'Spring 2024',
  courseId: 'course-id',
  startDate: '2024-01-15',
  endDate: '2024-06-15',
  maxStudents: 30,
  description: 'Spring semester batch'
});
```

### Certificates

```typescript
// Get certificates
const certificates = await studentService.getCertificates();

// Create certificate
const certificate = await studentService.createCertificate({
  studentId: 'student-id',
  courseId: 'course-id',
  batchId: 'batch-id',
  grade: 'A+',
  remarks: 'Excellent performance'
});

// Issue certificate
const issuedCertificate = await studentService.issueCertificate('certificate-id');

// Download certificate
await studentService.downloadCertificate('certificate-id');
```

### Marksheets

```typescript
// Get marksheets
const marksheets = await studentService.getMarksheets();

// Create marksheet
const marksheet = await studentService.createMarksheet({
  studentId: 'student-id',
  courseId: 'course-id',
  batchId: 'batch-id',
  semester: 1,
  subjects: [
    {
      subjectId: 'sub1',
      subjectName: 'Mathematics',
      maxMarks: 100,
      obtainedMarks: 85
    }
  ]
});

// Publish marksheet
const publishedMarksheet = await studentService.publishMarksheet('marksheet-id');
```

## 🔄 Error Handling

All services include comprehensive error handling:

```typescript
try {
  const data = await authService.login(credentials);
  // Handle success
} catch (error) {
  // Error object contains:
  // - message: User-friendly error message
  // - status: HTTP status code
  // - code: Error code for programmatic handling
  
  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 500) {
    // Handle server error
  }
}
```

## 🔒 Security Features

### Token Management

- Automatic token storage and retrieval
- Token expiration handling
- Automatic token refresh (when implemented)
- Secure token removal on logout

### Request Interceptors

- Automatic authorization header injection
- Request/response logging in development
- Error handling and retry logic
- Request timeout handling

## 📊 TypeScript Support

All services are fully typed with comprehensive interfaces:

```typescript
import { 
  Admin, 
  LoginRequest, 
  SocietyMember, 
  Student,
  ApiResponse 
} from '../services/types';
```

## 🧪 Testing

Services can be easily mocked for testing:

```typescript
// Mock auth service
jest.mock('../services', () => ({
  authService: {
    login: jest.fn().mockResolvedValue({ admin: mockAdmin, token: 'mock-token' })
  }
}));
```

## 🚀 Performance Features

- Request retry with exponential backoff
- Request deduplication
- Response caching (when implemented)
- Optimistic updates
- Lazy loading support

## 📝 Best Practices

1. **Always handle errors**: Use try-catch blocks when calling services
2. **Use TypeScript**: Leverage the provided types for better development experience
3. **Validate inputs**: Services include input sanitization
4. **Handle loading states**: Use the loading states provided by the auth context
5. **Clean up**: Services automatically handle token cleanup on logout

## 🔧 Customization

### Adding New Endpoints

1. Add endpoint to `config.ts`:
```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_FEATURE: {
    LIST: '/new-feature/list',
    CREATE: '/new-feature/create',
  }
};
```

2. Create service methods:
```typescript
class NewFeatureService {
  async getItems(): Promise<Item[]> {
    const response = await apiClient.get(API_ENDPOINTS.NEW_FEATURE.LIST);
    return response.data;
  }
}
```

3. Export from `index.ts`:
```typescript
export { default as newFeatureService } from './newFeatureService';
```

## 📞 Support

For questions or issues with the API services, please refer to:

1. This documentation
2. TypeScript interfaces in `types.ts`
3. Console logs in development mode
4. Network tab in browser dev tools

## 🔄 Updates

This service layer is designed to be easily maintainable and extensible. When the backend API changes:

1. Update the relevant interfaces in `types.ts`
2. Update endpoint URLs in `config.ts`
3. Update service methods as needed
4. Update this documentation

The modular design ensures that changes are isolated and don't affect other parts of the application.
