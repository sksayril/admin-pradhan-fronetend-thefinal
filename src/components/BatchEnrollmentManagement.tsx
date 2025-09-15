import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, Eye, RefreshCw, AlertCircle, ArrowLeft, X, RotateCcw } from 'lucide-react';
import { enrollmentService, Enrollment, EnrollmentFilters } from '../services/enrollmentService';
import EnrollmentApprovalModal from '../components/EnrollmentApprovalModal';
import EnrollmentRejectionModal from '../components/EnrollmentRejectionModal';
import EnrollmentSyncModal from '../components/EnrollmentSyncModal';
import EnrollmentFiltersComponent from './EnrollmentFilters';

interface BatchEnrollmentManagementProps {
  batchId: string;
  batchName: string;
  courseName: string;
  onBackToSelection?: () => void;
}

const BatchEnrollmentManagement: React.FC<BatchEnrollmentManagementProps> = ({
  batchId,
  batchName,
  courseName,
  onBackToSelection
}) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Filters state
  const [filters, setFilters] = useState<EnrollmentFilters>({
    batchId: batchId,
    page: 1,
    limit: 100,
    sortBy: 'enrollmentDate',
    sortOrder: 'desc'
  });
  
  // Statistics from API (for future use)
  const [apiStatistics, setApiStatistics] = useState({
    totalEnrollments: 0,
    pendingEnrollments: 0,
    approvedEnrollments: 0,
    rejectedEnrollments: 0,
    totalRevenue: 0
  });
  
  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    enrolled: 0
  });

  // Load enrollments for this batch with comprehensive filtering
  const loadBatchEnrollments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading enrollments with filters:', filters);
      
      // Get enrollments using comprehensive API with filters
      const response = await enrollmentService.getAllEnrollments(filters);
      
      console.log('Enrollments response:', response);
      
      if (response.success && response.data) {
        const { enrollments: allEnrollments, statistics: apiStats } = response.data;
        console.log('Found enrollments:', allEnrollments.length, allEnrollments);
        console.log('API statistics:', apiStats);
        
        setEnrollments(allEnrollments);
        setApiStatistics(apiStats);
        
        // Calculate local statistics from filtered enrollments
        const stats = {
          total: allEnrollments.length,
          pending: allEnrollments.filter((e: Enrollment) => e.status === 'pending' || e.approvalStatus === 'pending').length,
          approved: allEnrollments.filter((e: Enrollment) => e.approvalStatus === 'approved').length,
          rejected: allEnrollments.filter((e: Enrollment) => e.approvalStatus === 'rejected').length,
          enrolled: allEnrollments.filter((e: Enrollment) => e.status === 'enrolled').length
        };
        
        console.log('Calculated statistics:', stats);
        setStatistics(stats);
      } else {
        console.error('Failed to load enrollments:', response);
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
               title: courseName,
               category: 'Programming',
               type: 'online',
               price: 5000,
               currency: 'INR'
             },
             batchId: {
               _id: batchId,
               name: batchName,
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
               _id: 'course1',
               title: courseName,
               category: 'Programming',
               type: 'online',
               price: 5000,
               currency: 'INR'
             },
             batchId: {
               _id: batchId,
               name: batchName,
               startDate: '2024-01-01T00:00:00.000Z',
               endDate: '2024-03-01T00:00:00.000Z',
               maxStudents: 30
             },
             status: 'enrolled',
             approvalStatus: 'approved',
             enrollmentDate: '2024-01-10T10:00:00.000Z',
             paymentAmount: 5000,
             currency: 'INR',
             paymentStatus: 'paid',
             createdAt: '2024-01-10T10:00:00.000Z',
             updatedAt: '2024-01-10T10:00:00.000Z'
           },
           {
             _id: 'mock3',
             studentId: {
               _id: 'student3',
               firstName: 'Alice',
               lastName: 'Johnson',
               studentId: 'STU003',
               email: 'alice.johnson@example.com',
               phoneNumber: '+1234567892'
             },
             courseId: {
               _id: 'course1',
               title: courseName,
               category: 'Programming',
               type: 'online',
               price: 5000,
               currency: 'INR'
             },
             batchId: {
               _id: batchId,
               name: batchName,
               startDate: '2024-01-01T00:00:00.000Z',
               endDate: '2024-03-01T00:00:00.000Z',
               maxStudents: 30
             },
             status: 'pending',
             approvalStatus: 'pending',
             enrollmentDate: '2024-01-20T10:00:00.000Z',
             paymentAmount: 5000,
             currency: 'INR',
             paymentStatus: 'pending',
             createdAt: '2024-01-20T10:00:00.000Z',
             updatedAt: '2024-01-20T10:00:00.000Z'
           }
         ];
        
        setEnrollments(mockEnrollments);
        const stats = {
          total: mockEnrollments.length,
          pending: mockEnrollments.filter((e: Enrollment) => e.status === 'pending' || e.approvalStatus === 'pending').length,
          approved: mockEnrollments.filter((e: Enrollment) => e.approvalStatus === 'approved').length,
          rejected: mockEnrollments.filter((e: Enrollment) => e.approvalStatus === 'rejected').length,
          enrolled: mockEnrollments.filter((e: Enrollment) => e.status === 'enrolled').length
        };
        setStatistics(stats);
        setError('Using mock data - API not available');
      }
    } catch (err) {
      console.error('Error loading batch enrollments:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) {
      loadBatchEnrollments();
    }
  }, [batchId, filters]);


  const handleApprove = (enrollment: Enrollment) => {
    console.log('Approving enrollment:', enrollment);
    console.log('Enrollment ID:', enrollment._id);
    console.log('Enrollment status:', enrollment.status);
    console.log('Enrollment approval status:', enrollment.approvalStatus);
    setSelectedEnrollment(enrollment);
    setShowApprovalModal(true);
  };

  const handleReject = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowRejectionModal(true);
  };


  const handleApprovalSuccess = () => {
    setShowApprovalModal(false);
    setSelectedEnrollment(null);
    setSuccessMessage('Enrollment approved successfully!');
    setTimeout(() => setSuccessMessage(null), 5000); // Clear message after 5 seconds
    loadBatchEnrollments();
  };

  const handleRejectionSuccess = () => {
    setShowRejectionModal(false);
    setSelectedEnrollment(null);
    loadBatchEnrollments();
  };

  const handleSyncEnrollment = (enrollment: Enrollment) => {
    console.log('Opening sync modal for enrollment:', enrollment._id);
    setSelectedEnrollment(enrollment);
    setShowSyncModal(true);
  };

  const handleSyncSuccess = (syncResult: any) => {
    setShowSyncModal(false);
    setSelectedEnrollment(null);
    
    // Show success message with sync details
    if (syncResult.updated) {
      setSuccessMessage(`Sync completed: ${syncResult.action}`);
    } else {
      setSuccessMessage(`Sync completed: ${syncResult.action}`);
    }
    setTimeout(() => setSuccessMessage(null), 5000);
    
    // Refresh the enrollment data
    loadBatchEnrollments();
  };


  const handleFiltersChange = (newFilters: EnrollmentFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      batchId: batchId,
      page: 1,
      limit: 100,
      sortBy: 'enrollmentDate',
      sortOrder: 'desc'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'enrolled':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'dropped':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch Info Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBackToSelection && (
              <button
                onClick={onBackToSelection}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                title="Back to batch selection"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Batch Enrollment Management</h2>
              <p className="text-gray-600">{courseName} - {batchName}</p>
            </div>
          </div>
          <button
            onClick={loadBatchEnrollments}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
       </div>

       {/* Success Message */}
       {successMessage && (
         <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
           <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
           <p className="text-green-700 text-sm">{successMessage}</p>
           <button
             onClick={() => setSuccessMessage(null)}
             className="text-green-500 hover:text-green-700 ml-auto"
           >
             <X className="w-4 h-4" />
           </button>
         </div>
       )}

       {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.pending}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.approved}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.rejected}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enrolled</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.enrolled}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <EnrollmentFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        courses={[{ _id: 'course1', title: courseName }]}
        batches={[{ _id: batchId, name: batchName, courseId: 'course1' }]}
      />


      {/* Enrollments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
             <thead className="bg-gray-50">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
               </tr>
             </thead>
            <tbody className="bg-white divide-y divide-gray-200">
               {loading ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-8 text-center">
                     <div className="flex items-center justify-center">
                       <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                       <span className="ml-3 text-gray-500">Loading enrollments...</span>
                     </div>
                   </td>
                 </tr>
               ) : error ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-8 text-center">
                     <div className="flex flex-col items-center">
                       <AlertCircle className="w-12 h-12 text-red-300 mb-2" />
                       <p className="text-red-600 font-medium">Error loading enrollments</p>
                       <p className="text-gray-500 text-sm">{error}</p>
                     </div>
                   </td>
                 </tr>
               ) : enrollments.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                     <div className="flex flex-col items-center">
                       <Users className="w-12 h-12 text-gray-300 mb-2" />
                       <p>No enrollments found for this batch</p>
                       <p className="text-sm">Students can enroll through the course page</p>
                     </div>
                   </td>
                 </tr>
              ) : (
                 enrollments.map((enrollment) => (
                   <tr key={enrollment._id} className="hover:bg-gray-50">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                        <div className="text-xs text-gray-500">
                          {enrollment.approvalStatus}
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
                         {(enrollment.status === 'pending' || enrollment.approvalStatus === 'pending') && (
                           <>
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
                           </>
                         )}
                         <button
                           onClick={() => handleSyncEnrollment(enrollment)}
                           className="text-purple-600 hover:text-purple-900"
                           title="Sync with Batch"
                         >
                           <RotateCcw className="w-4 h-4" />
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

       {showSyncModal && selectedEnrollment && (
         <EnrollmentSyncModal
           enrollment={selectedEnrollment}
           onClose={() => setShowSyncModal(false)}
           onSuccess={handleSyncSuccess}
         />
       )}

     </div>
   );
 };

export default BatchEnrollmentManagement;
