import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { enrollmentService, Enrollment } from '../services/enrollmentService';
import EnrollmentApprovalModal from '../components/EnrollmentApprovalModal';
import EnrollmentRejectionModal from '../components/EnrollmentRejectionModal';

const PendingEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    courseId: '',
    batchId: '',
    sortBy: 'enrollmentDate',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEnrollments: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const [statistics, setStatistics] = useState({
    totalPending: 0,
    totalAmount: 0
  });

  // Load pending enrollments
  const loadPendingEnrollments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading pending enrollments with filters:', filters);
      const response = await enrollmentService.getPendingEnrollments(filters);
      console.log('Pending enrollments response:', response);
      
      if (response.success && response.data) {
        console.log('Found pending enrollments:', response.data.enrollments.length, response.data.enrollments);
        setEnrollments(response.data.enrollments);
        setPagination(response.data.pagination);
        setStatistics(response.data.statistics);
      } else {
        console.error('Failed to load pending enrollments:', response);
        // Show mock data for testing if API fails
        const mockEnrollments: Enrollment[] = [
          {
            _id: 'mock1',
            studentId: {
              _id: 'student1',
              firstName: 'John',
              lastName: 'Doe',
              studentId: 'STU001',
              email: 'john.doe@example.com',
              phoneNumber: '+1234567890'
            },
            courseId: {
              _id: 'course1',
              title: 'Introduction to Python',
              category: 'Programming',
              type: 'online',
              price: 5000,
              currency: 'INR'
            },
            batchId: {
              _id: 'batch1',
              name: 'Python Morning Batch',
              startDate: '2024-01-01T00:00:00.000Z',
              endDate: '2024-03-01T00:00:00.000Z',
              maxStudents: 30
            },
            status: 'pending',
            approvalStatus: 'pending',
            enrollmentDate: '2024-01-15T10:00:00.000Z',
            paymentAmount: 5000,
            currency: 'INR',
            paymentStatus: 'pending',
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-01-15T10:00:00.000Z'
          },
          {
            _id: 'mock2',
            studentId: {
              _id: 'student2',
              firstName: 'Jane',
              lastName: 'Smith',
              studentId: 'STU002',
              email: 'jane.smith@example.com',
              phoneNumber: '+1234567891'
            },
            courseId: {
              _id: 'course2',
              title: 'Advanced JavaScript',
              category: 'Programming',
              type: 'online',
              price: 8000,
              currency: 'INR'
            },
            batchId: {
              _id: 'batch2',
              name: 'JS Evening Batch',
              startDate: '2024-02-01T00:00:00.000Z',
              endDate: '2024-04-01T00:00:00.000Z',
              maxStudents: 25
            },
            status: 'pending',
            approvalStatus: 'pending',
            enrollmentDate: '2024-01-20T10:00:00.000Z',
            paymentAmount: 8000,
            currency: 'INR',
            paymentStatus: 'pending',
            createdAt: '2024-01-20T10:00:00.000Z',
            updatedAt: '2024-01-20T10:00:00.000Z'
          }
        ];
        
        setEnrollments(mockEnrollments);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalEnrollments: mockEnrollments.length,
          hasNextPage: false,
          hasPrevPage: false
        });
        setStatistics({
          totalPending: mockEnrollments.length,
          totalAmount: mockEnrollments.reduce((sum, e) => sum + e.paymentAmount, 0)
        });
        setError('Using mock data - API not available');
      }
    } catch (err) {
      console.error('Error loading pending enrollments:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingEnrollments();
  }, [filters]);

  const handleSelectEnrollment = (enrollmentId: string) => {
    setSelectedEnrollments(prev => 
      prev.includes(enrollmentId) 
        ? prev.filter(id => id !== enrollmentId)
        : [...prev, enrollmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEnrollments.length === enrollments.length) {
      setSelectedEnrollments([]);
    } else {
      setSelectedEnrollments(enrollments.map(e => e._id));
    }
  };

  const handleApprove = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowApprovalModal(true);
  };

  const handleReject = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowRejectionModal(true);
  };

  const handleBulkApprove = () => {
    if (selectedEnrollments.length === 0) return;
    // Implement bulk approval logic
    console.log('Bulk approve:', selectedEnrollments);
  };

  const handleBulkReject = () => {
    if (selectedEnrollments.length === 0) return;
    // Implement bulk rejection logic
    console.log('Bulk reject:', selectedEnrollments);
  };

  const handleApprovalSuccess = () => {
    setShowApprovalModal(false);
    setSelectedEnrollment(null);
    loadPendingEnrollments();
  };

  const handleRejectionSuccess = () => {
    setShowRejectionModal(false);
    setSelectedEnrollment(null);
    loadPendingEnrollments();
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.totalPending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-800">
                {enrollmentService.formatCurrency(statistics.totalAmount)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selected</p>
              <p className="text-2xl font-bold text-gray-800">{selectedEnrollments.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedEnrollments.length === enrollments.length && enrollments.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Select All</span>
            </div>
            
            {selectedEnrollments.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkApprove}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Approve Selected
                </button>
                <button
                  onClick={handleBulkReject}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Reject Selected
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadPendingEnrollments}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedEnrollments.length === enrollments.length && enrollments.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course & Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-500">Loading enrollments...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 text-red-300 mb-2" />
                      <p className="text-red-600 font-medium">Error loading enrollments</p>
                      <p className="text-gray-500 text-sm">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Clock className="w-12 h-12 text-gray-300 mb-2" />
                      <p>No pending enrollments found</p>
                      <p className="text-sm">All enrollments have been processed</p>
                    </div>
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment) => (
                  <tr key={enrollment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEnrollments.includes(enrollment._id)}
                        onChange={() => handleSelectEnrollment(enrollment._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {enrollment.studentId.firstName.charAt(0)}{enrollment.studentId.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.studentId.firstName} {enrollment.studentId.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{enrollment.studentId.studentId}</div>
                          <div className="text-sm text-gray-500">{enrollment.studentId.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{enrollment.courseId.title}</div>
                        <div className="text-gray-500">{enrollment.batchId.name}</div>
                        <div className="text-xs text-gray-400">
                          {enrollment.courseId.category} • {enrollment.courseId.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {enrollmentService.formatCurrency(enrollment.paymentAmount, enrollment.currency)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Status: <span className="capitalize">{enrollment.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollmentService.formatDate(enrollment.enrollmentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApprove(enrollment)}
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(enrollment)}
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => console.log('View details:', enrollment._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enrollments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {enrollments.length} of {pagination.totalEnrollments} enrollments
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNextPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showApprovalModal && selectedEnrollment && (
        <EnrollmentApprovalModal
          enrollment={selectedEnrollment}
          onClose={() => setShowApprovalModal(false)}
          onSuccess={handleApprovalSuccess}
        />
      )}

      {showRejectionModal && selectedEnrollment && (
        <EnrollmentRejectionModal
          enrollment={selectedEnrollment}
          onClose={() => setShowRejectionModal(false)}
          onSuccess={handleRejectionSuccess}
        />
      )}
    </div>
  );
};

export default PendingEnrollments;
