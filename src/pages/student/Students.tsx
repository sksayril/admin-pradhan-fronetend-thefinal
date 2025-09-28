import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GraduationCap, Plus, Search, Filter, Download, RefreshCw, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { userManagementService, StudentFilters, EnhancedStudent } from '../../services';
import StudentDetailModal from '../../components/StudentDetailModal';
import StudentEnrollmentsModal from '../../components/StudentEnrollmentsModal';
import { TableSkeleton, CardSkeleton } from '../../components/LoadingSkeleton';
import ErrorDisplay from '../../components/ErrorDisplay';

const Students: React.FC = React.memo(() => {
  // State for students data
  const [students, setStudents] = useState<EnhancedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters and search
  const [filters] = useState<StudentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedKycStatus, setSelectedKycStatus] = useState('all');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // State for detail modal
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // State for enrollment modal
  const [selectedStudent, setSelectedStudent] = useState<EnhancedStudent | null>(null);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  // Load students data
  const loadStudents = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters: StudentFilters = {
        ...filters,
        search: searchTerm || undefined,
        isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
        department: selectedDepartment === 'all' ? undefined : selectedDepartment,
        kycStatus: selectedKycStatus === 'all' ? undefined : selectedKycStatus as any,
      };

      // Remove undefined values
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key as keyof StudentFilters] === undefined) {
          delete currentFilters[key as keyof StudentFilters];
        }
      });

      const response = await userManagementService.getAllStudents(
        page,
        10,
        currentFilters,
        'firstName',
        'asc'
      );

      setStudents(response.students);
      setTotalPages(response.pagination.totalPages);
      setTotalStudents(response.pagination.totalItems);
      setHasNextPage(response.pagination.hasNextPage);
      setHasPrevPage(response.pagination.hasPrevPage);
      setCurrentPage(response.pagination.currentPage);
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, selectedStatus, selectedDepartment, selectedKycStatus]);

  // Load students on component mount and when filters change
  useEffect(() => {
    loadStudents(1);
  }, [loadStudents]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadStudents(page);
  }, [loadStudents]);

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      const currentFilters: StudentFilters = {
        ...filters,
        search: searchTerm || undefined,
        isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
        department: selectedDepartment === 'all' ? undefined : selectedDepartment,
        kycStatus: selectedKycStatus === 'all' ? undefined : selectedKycStatus as any,
      };

      await userManagementService.exportUsers('students', currentFilters, 'excel');
    } catch (err) {
      console.error('Error exporting students:', err);
      setError('Failed to export students. Please try again.');
    }
  }, [filters, searchTerm, selectedStatus, selectedDepartment, selectedKycStatus]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    loadStudents(currentPage);
  }, [loadStudents, currentPage]);

  // Handle view student details
  const handleViewStudent = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDetailModalOpen(true);
  }, []);

  // Handle close detail modal
  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedStudentId(null);
  }, []);

  // Handle view student enrollments
  const handleViewEnrollments = useCallback((student: EnhancedStudent) => {
    setSelectedStudent(student);
    setIsEnrollmentModalOpen(true);
  }, []);

  // Handle close enrollment modal
  const handleCloseEnrollmentModal = useCallback(() => {
    setIsEnrollmentModalOpen(false);
    setSelectedStudent(null);
  }, []);

  // Memoized statistics calculations
  const statistics = useMemo(() => ({
    activeStudents: students.filter(s => s.isActive).length,
    kycPending: students.filter(s => s.kycStatus === 'pending').length,
    verified: students.filter(s => s.isVerified).length,
  }), [students]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            aria-label="Refresh students list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            aria-label="Export students data"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            aria-label="Add new student"
            disabled
          >
            <Plus className="w-5 h-5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      <ErrorDisplay
        error={error}
        onRetry={handleRefresh}
        onDismiss={() => setError(null)}
        title="Failed to load students"
      />

      {/* Student Stats */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-800">
                  {statistics.activeStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">KYC Pending</p>
                <p className="text-2xl font-bold text-gray-800">
                  {statistics.kycPending}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-lg">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-800">
                  {statistics.verified}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              aria-label="Search students"
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Enter student name, email, or student ID to filter the list
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              aria-label="Filter by department"
            >
              <option value="all">All Departments</option>
              <option value="Arts">Arts</option>
              <option value="Business">Business</option>
              <option value="Science">Science</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Medicine">Medicine</option>
            </select>
            <select 
              value={selectedKycStatus}
              onChange={(e) => setSelectedKycStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              aria-label="Filter by KYC status"
            >
              <option value="all">All KYC Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="not_submitted">Not Submitted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Student List ({students.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="Students table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8">
                    <TableSkeleton rows={5} columns={8} />
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <GraduationCap className="w-12 h-12 text-gray-300 mb-2" />
                      <p>No students found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id || student._id || student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          {student.profilePicture ? (
                            <img
                              src={student.profilePicture}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-sky-500 flex items-center justify-center">
                                      <span class="text-white text-sm font-semibold">
                                        ${student.firstName.charAt(0)}${student.lastName.charAt(0)}
                                      </span>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-sky-500 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                      <div className="text-sm text-gray-500">{student.phoneNumber || student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.courseName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        student.kycStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        student.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        student.kycStatus === 'not_submitted' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.kycStatus === 'not_submitted' ? 'Not Submitted' : student.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewStudent(student.id || student._id)}
                          className="text-sky-600 hover:text-sky-900" 
                          title="View Student Details"
                          aria-label={`View details for ${student.firstName} ${student.lastName}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleViewEnrollments(student)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="View Enrollments"
                          aria-label={`View enrollments for ${student.firstName} ${student.lastName}`}
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900" 
                          title="Edit"
                          aria-label={`Edit ${student.firstName} ${student.lastName}`}
                          disabled
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900" 
                          title="Delete"
                          aria-label={`Delete ${student.firstName} ${student.lastName}`}
                          disabled
                        >
                          <Trash2 className="w-4 h-4" />
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
        {students.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {students.length} of {totalStudents} students
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                aria-label="Go to previous page"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm" aria-live="polite">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                aria-label="Go to next page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudentId && (
        <StudentDetailModal
          studentId={selectedStudentId}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Student Enrollments Modal */}
      <StudentEnrollmentsModal
        isOpen={isEnrollmentModalOpen}
        onClose={handleCloseEnrollmentModal}
        student={selectedStudent}
      />
    </div>
  );
});

Students.displayName = 'Students';

export default Students;