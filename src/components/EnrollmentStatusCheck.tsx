import React, { useState } from 'react';
import { Search, User, BookOpen, Users, Calendar, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { enrollmentService, StudentEnrollmentStatus } from '../services/enrollmentService';

const EnrollmentStatusCheck: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<StudentEnrollmentStatus | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId.trim()) {
      setError('Please enter a student ID');
      return;
    }

    setLoading(true);
    setError(null);
    setEnrollmentStatus(null);

    try {
      const response = await enrollmentService.getStudentEnrollmentStatus(
        studentId.trim(),
        courseId.trim() || undefined,
        batchId.trim() || undefined
      );

      if (response.success && response.data) {
        setEnrollmentStatus(response.data);
      } else {
        console.error('Failed to fetch enrollment status:', response);
        // Show mock data for testing if API fails
        const mockStatus: StudentEnrollmentStatus = {
          student: {
            id: studentId.trim(),
            name: 'John Doe',
            studentId: 'STU001',
            email: 'john.doe@example.com'
          },
          statistics: {
            total: 3,
            pending: 1,
            approved: 1,
            rejected: 0,
            enrolled: 1,
            active: 1,
            completed: 0,
            dropped: 0,
            suspended: 0
          },
          enrollments: {
            pending: [
              {
                _id: 'enrollment1',
                studentId: {
                  _id: studentId.trim(),
                  firstName: 'John',
                  lastName: 'Doe',
                  studentId: 'STU001',
                  email: 'john.doe@example.com'
                },
                courseId: {
                  _id: 'course1',
                  title: 'Advanced Python',
                  category: 'Programming',
                  type: 'online',
                  price: 8000,
                  currency: 'INR'
                },
                batchId: {
                  _id: 'batch1',
                  name: 'Python Advanced Batch',
                  startDate: '2024-02-01T00:00:00.000Z',
                  endDate: '2024-04-01T00:00:00.000Z',
                  maxStudents: 25
                },
                status: 'pending',
                approvalStatus: 'pending',
                enrollmentDate: '2024-01-15T10:00:00.000Z',
                paymentAmount: 8000,
                currency: 'INR'
              }
            ],
            approved: [],
            rejected: [],
            enrolled: [
              {
                _id: 'enrollment2',
                studentId: {
                  _id: studentId.trim(),
                  firstName: 'John',
                  lastName: 'Doe',
                  studentId: 'STU001',
                  email: 'john.doe@example.com'
                },
                courseId: {
                  _id: 'course2',
                  title: 'Introduction to Python',
                  category: 'Programming',
                  type: 'online',
                  price: 5000,
                  currency: 'INR'
                },
                batchId: {
                  _id: 'batch2',
                  name: 'Python Morning Batch',
                  startDate: '2024-01-01T00:00:00.000Z',
                  endDate: '2024-03-01T00:00:00.000Z',
                  maxStudents: 30
                },
                status: 'enrolled',
                approvalStatus: 'approved',
                enrollmentDate: '2024-01-10T10:00:00.000Z',
                paymentAmount: 5000,
                currency: 'INR'
              }
            ],
            active: [],
            completed: [],
            dropped: [],
            suspended: []
          },
          allEnrollments: []
        };
        
        setEnrollmentStatus(mockStatus);
        setError('Using mock data - API not available');
      }
    } catch (err) {
      console.error('Error fetching enrollment status:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'enrolled':
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'dropped':
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'enrolled':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'dropped':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Check Student Enrollment Status
        </h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student ID *
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course ID (Optional)
              </label>
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Enter course ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch ID (Optional)
              </label>
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Enter batch ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {enrollmentStatus && (
        <div className="space-y-6">
          {/* Student Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{enrollmentStatus.student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium text-gray-800">{enrollmentStatus.student.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{enrollmentStatus.student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Enrollments</p>
                <p className="font-medium text-gray-800">{enrollmentStatus.statistics.total}</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Enrollment Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{enrollmentStatus.statistics.pending}</div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{enrollmentStatus.statistics.approved}</div>
                <div className="text-sm text-green-700">Approved</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{enrollmentStatus.statistics.active}</div>
                <div className="text-sm text-blue-700">Active</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{enrollmentStatus.statistics.completed}</div>
                <div className="text-sm text-gray-700">Completed</div>
              </div>
            </div>
          </div>

          {/* Enrollments by Status */}
          {Object.entries(enrollmentStatus.enrollments).map(([status, enrollments]) => {
            if (enrollments.length === 0) return null;
            
            return (
              <div key={status} className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  {getStatusIcon(status)}
                  <span className="ml-2 capitalize">{status} Enrollments ({enrollments.length})</span>
                </h3>
                
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-800">{enrollment.courseId.title}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                              {enrollment.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="font-medium text-gray-700">Batch</p>
                              <p>{enrollment.batchId.name}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Enrollment Date</p>
                              <p>{enrollmentService.formatDate(enrollment.enrollmentDate)}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Amount</p>
                              <p>{enrollmentService.formatCurrency(enrollment.paymentAmount, enrollment.currency)}</p>
                            </div>
                          </div>
                          {enrollment.adminNotes && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Admin Notes</p>
                              <p className="text-sm text-gray-600">{enrollment.adminNotes}</p>
                            </div>
                          )}
                          {enrollment.rejectionReason && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-700">Rejection Reason</p>
                              <p className="text-sm text-red-600">{enrollment.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrollmentStatusCheck;
