import React, { useState, useEffect } from 'react';
import { FileText, Plus, Download, Eye, Search, Filter, RefreshCw, User, Calendar, Phone, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { userManagementService } from '../../services';
import { EnhancedStudent } from '../../services/types';
import GenerateMarksheetModal from '../../components/GenerateMarksheetModal';
import ViewMarksheetsModal from '../../components/ViewMarksheetsModal';

const Marksheet: React.FC = () => {
  const [students, setStudents] = useState<EnhancedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<EnhancedStudent | null>(null);
  const [selectedStudentForGeneration, setSelectedStudentForGeneration] = useState<string>('');
  const [isViewMarksheetsModalOpen, setIsViewMarksheetsModalOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState<EnhancedStudent | null>(null);

  // Load students data
  const loadStudents = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userManagementService.getAllStudents(
        page,
        10,
        {
          search: searchTerm || undefined,
          department: departmentFilter || undefined,
          year: yearFilter || undefined
        },
        'firstName',
        'asc'
      );

      setStudents(response.students);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalStudents: response.pagination.totalItems,
        hasNextPage: response.pagination.hasNextPage,
        hasPrevPage: response.pagination.hasPrevPage
      });
      
      toast.success('📚 Students data loaded successfully!', {
        duration: 2000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '14px',
        },
      });
    } catch (err) {
      console.error('Error loading students:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast.error(`❌ Failed to load students: ${errorMessage}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '14px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount and when filters change
  useEffect(() => {
    loadStudents(1);
  }, [departmentFilter, yearFilter]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        loadStudents(1);
      } else {
        loadStudents(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle refresh
  const handleRefresh = () => {
    loadStudents(pagination.currentPage);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setYearFilter('');
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    loadStudents(page);
  };

  // Handle marksheet generation
  const handleGenerateMarksheet = (student: EnhancedStudent) => {
    setSelectedStudent(student);
    setIsGenerateModalOpen(true);
  };

  // Handle bulk marksheet generation
  const handleBulkGenerateMarksheet = () => {
    if (!selectedStudentForGeneration) {
      toast('💡 Please select a student to generate marksheet', {
        duration: 3000,
        style: {
          background: '#3B82F6',
          color: '#fff',
          fontSize: '14px',
        },
      });
      return;
    }

    const student = students.find(s => s._id === selectedStudentForGeneration);
    if (student) {
      setSelectedStudent(student);
      setIsGenerateModalOpen(true);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsGenerateModalOpen(false);
    setSelectedStudent(null);
    setSelectedStudentForGeneration('');
  };

  const handleViewMarksheets = (student: EnhancedStudent) => {
    setSelectedStudentForView(student);
    setIsViewMarksheetsModalOpen(true);
  };

  const handleCloseViewMarksheetsModal = () => {
    setIsViewMarksheetsModalOpen(false);
    setSelectedStudentForView(null);
  };

  // Handle marksheet generation success
  const handleMarksheetGenerated = () => {
    // Optionally refresh the students list or show success message
    toast.success('🎉 Marksheet generated successfully!', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
      },
    });
  };

  // Calculate statistics
  const activeStudents = students.filter(s => s.isActive).length;
  const verifiedStudents = students.filter(s => s.isVerified).length;
  const approvedKycStudents = students.filter(s => s.kycStatus === 'approved').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Student Marksheets</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
          <div className="flex items-center space-x-2">
            <select
              value={selectedStudentForGeneration}
              onChange={(e) => setSelectedStudentForGeneration(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName} ({student.studentId})
                </option>
              ))}
            </select>
            <button 
              onClick={handleBulkGenerateMarksheet}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Generate Marksheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or student ID..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Student Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{pagination.totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-2xl font-bold text-gray-800">{activeStudents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Students</p>
              <p className="text-2xl font-bold text-gray-800">{verifiedStudents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">🔒</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">KYC Approved</p>
              <p className="text-2xl font-bold text-gray-800">{approvedKycStudents}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-lg">🛡️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading students data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Students</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Students Found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more students.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Students List</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department & Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-semibold">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.department}</div>
                      <div className="text-sm text-gray-500">{student.year} Year</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {student.phoneNumber}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(student.dateOfBirth).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          student.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        student.kycStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        student.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        student.kycStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {student.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-sky-600 hover:text-sky-900" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleViewMarksheets(student)}
                        className="text-blue-600 hover:text-blue-900" 
                        title="View Marksheets"
                      >
                        <FileCheck className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleGenerateMarksheet(student)}
                        className="text-green-600 hover:text-green-900" 
                        title="Generate Marksheet"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * 10, pagination.totalStudents)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{pagination.totalStudents}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generate Marksheet Modal */}
      <GenerateMarksheetModal
        isOpen={isGenerateModalOpen}
        onClose={handleCloseModal}
        student={selectedStudent}
        onSuccess={handleMarksheetGenerated}
      />

      {/* View Marksheets Modal */}
      {selectedStudentForView && (
        <ViewMarksheetsModal
          isOpen={isViewMarksheetsModalOpen}
          onClose={handleCloseViewMarksheetsModal}
          student={selectedStudentForView}
        />
      )}
    </div>
  );
};

export default Marksheet;