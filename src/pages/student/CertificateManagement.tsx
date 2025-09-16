import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  FileText, 
  Phone,
  Mail,
  User,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { userManagementService } from '../../services/userManagementService';
import { certificateService } from '../../services/certificateService';
import { EnhancedStudent, UserManagementPagination } from '../../services/types';
import ViewMarksheetsModal from '../../components/ViewMarksheetsModal';
import GenerateMarksheetModal from '../../components/GenerateMarksheetModal';
import GenerateCertificateModal from '../../components/GenerateCertificateModal';
import MarksheetNumberModal from '../../components/MarksheetNumberModal';
import ViewCertificatesModal from '../../components/ViewCertificatesModal';


const CertificateManagement: React.FC = () => {
  const [students, setStudents] = useState<EnhancedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UserManagementPagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kycStatusFilter, setKycStatusFilter] = useState<'pending' | 'approved' | 'rejected' | ''>('');

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isViewMarksheetsModalOpen, setIsViewMarksheetsModalOpen] = useState(false);
  const [isGenerateCertificateModalOpen, setIsGenerateCertificateModalOpen] = useState(false);
  const [isMarksheetNumberModalOpen, setIsMarksheetNumberModalOpen] = useState(false);
  const [isViewCertificatesModalOpen, setIsViewCertificatesModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<EnhancedStudent | null>(null);
  const [selectedMarksheetNumber, setSelectedMarksheetNumber] = useState<string>('');

  // Fetch students
  const fetchStudents = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userManagementService.getStudents({
        page,
        limit: 10,
        sortBy: 'firstName',
        sortOrder: 'asc',
        search: searchTerm || undefined,
        department: departmentFilter || undefined,
        year: yearFilter || undefined,
        status: statusFilter || undefined,
        kycStatus: kycStatusFilter === '' ? undefined : kycStatusFilter
      });

      if (response && response.students) {
        setStudents(response.students);
        setPagination(response.pagination);
      } else {
        throw new Error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch students');
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, departmentFilter, yearFilter, statusFilter, kycStatusFilter]);

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleGenerateMarksheet = (student: EnhancedStudent) => {
    setSelectedStudent(student);
    setIsGenerateModalOpen(true);
  };

  const handleViewMarksheets = (student: EnhancedStudent) => {
    setSelectedStudent(student);
    setIsViewMarksheetsModalOpen(true);
  };

  const handleViewCertificates = (student: EnhancedStudent) => {
    setSelectedStudent(student);
    setIsViewCertificatesModalOpen(true);
  };


  const handleOpenMarksheetNumberModal = (student: EnhancedStudent) => {
    setSelectedStudent(student);
    setIsMarksheetNumberModalOpen(true);
  };

  const handleMarksheetNumberConfirm = async (marksheetNumber: string) => {
    if (selectedStudent) {
      try {
        // Call the API directly
        const response = await certificateService.generateCertificateFromMarksheet(
          marksheetNumber,
          {
            certificateType: 'Completion',
            deliveryMethod: 'Digital'
          }
        );

        if (response) {
          toast.success('Certificate generated successfully!');
          // Refresh the student list
          fetchStudents(pagination.currentPage);
        }
      } catch (error: any) {
        console.error('Error generating certificate:', error);
        toast.error(error.message || 'Failed to generate certificate');
      }
    }
  };

  const handleCloseModals = () => {
    setIsGenerateModalOpen(false);
    setIsViewMarksheetsModalOpen(false);
    setIsGenerateCertificateModalOpen(false);
    setIsMarksheetNumberModalOpen(false);
    setIsViewCertificatesModalOpen(false);
    setSelectedStudent(null);
    setSelectedMarksheetNumber('');
  };


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'enrolled':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Award className="w-8 h-8 text-blue-600" />
                Certificate Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage student certificates and marksheets
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {pagination.totalItems}
                </div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Medicine">Medicine</option>
              <option value="Business">Business</option>
            </select>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* KYC Status Filter */}
            <select
              value={kycStatusFilter}
              onChange={(e) => setKycStatusFilter(e.target.value as 'pending' | 'approved' | 'rejected' | '')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All KYC Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    {/* Student Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {student.studentId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {student.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {student.phoneNumber}
                      </div>
                    </td>

                    {/* Academic Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.department || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.year || 'N/A'} Year
                      </div>
                    </td>

                    {/* Enrollments */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-900">
                          {student.enrollmentStats?.totalEnrollments || 0}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.enrollmentStats?.activeEnrollments || 0} active
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.isActive ? 'active' : 'inactive')}`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusColor(student.kycStatus)}`}>
                          KYC: {student.kycStatus}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleGenerateMarksheet(student)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title="Generate Marksheet"
                        >
                          <FileText className="w-4 h-4" />
                          Generate
                        </button>
                        <button
                          onClick={() => handleViewMarksheets(student)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          title="View Marksheets"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleOpenMarksheetNumberModal(student)}
                          className="text-purple-600 hover:text-purple-900 flex items-center gap-1"
                          title="Generate Certificate"
                        >
                          <Award className="w-4 h-4" />
                          Certificate
                        </button>
                        <button
                          onClick={() => handleViewCertificates(student)}
                          className="text-orange-600 hover:text-orange-900 flex items-center gap-1"
                          title="View Certificates"
                        >
                          <Award className="w-4 h-4" />
                          View Cert
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => fetchStudents(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => fetchStudents(pagination.currentPage + 1)}
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
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * 10 + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * 10, pagination.totalItems)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalItems}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => fetchStudents(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchStudents(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedStudent && (
        <>
          <GenerateMarksheetModal
            isOpen={isGenerateModalOpen}
            onClose={handleCloseModals}
            student={selectedStudent}
          />
          <ViewMarksheetsModal
            isOpen={isViewMarksheetsModalOpen}
            onClose={handleCloseModals}
            student={selectedStudent}
          />
          <GenerateCertificateModal
            isOpen={isGenerateCertificateModalOpen}
            onClose={handleCloseModals}
            student={selectedStudent!}
            marksheetNumber={selectedMarksheetNumber}
            onSuccess={() => {
              toast.success('Certificate generated successfully!');
              fetchStudents(pagination.currentPage);
            }}
          />
          <MarksheetNumberModal
            isOpen={isMarksheetNumberModalOpen}
            onClose={handleCloseModals}
            onConfirm={handleMarksheetNumberConfirm}
            studentName={selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : ''}
          />
          <ViewCertificatesModal
            isOpen={isViewCertificatesModalOpen}
            onClose={handleCloseModals}
            student={selectedStudent!}
          />
        </>
      )}
    </div>
  );
};

export default CertificateManagement;
