import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Award, FileText, User, BookOpen, GraduationCap, CheckCircle, Clock, AlertCircle, Download, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { certificateService } from '../services/certificateService';
import { EnhancedStudent } from '../services/types';
import CertificatePDFGenerator, { CertificatePDFGeneratorRef } from './CertificatePDFGenerator';

interface ViewCertificatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: EnhancedStudent;
}

interface CertificateData {
  certificateNumber: string;
  certificateType: string;
  certificateTitle: string;
  academicYear: string;
  grade: string;
  percentage: number;
  cgpa: number;
  status: string;
  isVerified: boolean;
  verificationCode: string;
  certificateIssueDate: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    studentId: string;
    email: string;
    department: string;
    year: string;
  };
  course: {
    _id: string;
    title: string;
    category: string;
    instructor: {
      name: string;
      email: string;
      bio: string;
    };
    duration: number;
  };
  batch: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
  };
  marksheet: {
    marksheetNumber: string;
    academicYear: string;
    semester: string;
    examinationType: string;
    percentage: number;
    cgpa: number;
    overallGrade: string;
    result: string;
  } | null;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  verifiedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  description?: string;
  achievements?: Array<{
    _id: string;
    title: string;
    description: string;
    date: string;
  }>;
  deliveryAddress?: {
    country: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  deliveryStatus?: string;
  deliveryMethod?: string;
  printHistory?: any[];
  downloadHistory?: any[];
}

const ViewCertificatesModal: React.FC<ViewCertificatesModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const [certificatesData, setCertificatesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    certificateType: '',
    academicYear: '',
    status: ''
  });
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const pdfGeneratorRef = useRef<CertificatePDFGeneratorRef>(null);

  const fetchCertificates = useCallback(async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await certificateService.getStudentCertificateData(
        student._id,
        pageNum,
        10,
        {
          certificateType: filters.certificateType || undefined,
          academicYear: filters.academicYear || undefined,
          status: filters.status || undefined,
          includeDetails: true
        }
      );
      setCertificatesData(response);
      setPage(pageNum);
    } catch (err: any) {
      console.error('Error fetching certificates:', err);
      setError(err.message || 'Failed to fetch certificates');
      toast.error(err.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }, [student._id, filters.certificateType, filters.academicYear, filters.status]);

  useEffect(() => {
    if (isOpen && student) {
      fetchCertificates(1);
    } else if (!isOpen) {
      // Reset state when modal closes
      setCertificatesData(null);
      setError(null);
      setPage(1);
    }
  }, [isOpen, student, fetchCertificates]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchCertificates(1);
  };

  const handleClearFilters = () => {
    setFilters({ certificateType: '', academicYear: '', status: '' });
    fetchCertificates(1);
  };

  const handleDownloadPDF = (certificate: any) => {
    setSelectedCertificate(certificate);
    // Small delay to ensure the component is mounted
    setTimeout(() => {
      if (pdfGeneratorRef.current) {
        pdfGeneratorRef.current.downloadPDF();
      }
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'issued':
        return <CheckCircle className="w-4 h-4" />;
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'delivered':
        return <Award className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Student Certificates</h2>
              <p className="text-sm text-gray-500">{student.firstName} {student.lastName} - {student.studentId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && !certificatesData ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading certificates...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => fetchCertificates(page)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : certificatesData ? (
            <>
              {/* Student Information */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-sm text-gray-900">{certificatesData.student.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <p className="text-sm text-gray-900">{certificatesData.student.studentId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <p className="text-sm text-gray-900">{certificatesData.student.department}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Total Certificates</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{certificatesData.statistics.totalCertificates}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Verified</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{certificatesData.statistics.verifiedCertificates}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Issued</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{certificatesData.statistics.issuedCertificates}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Avg Grade</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">{certificatesData.statistics.averageGrade}%</p>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
                    <select
                      value={filters.certificateType}
                      onChange={(e) => handleFilterChange('certificateType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value="Completion">Completion</option>
                      <option value="Achievement">Achievement</option>
                      <option value="Excellence">Excellence</option>
                      <option value="Participation">Participation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={filters.academicYear}
                      onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                      placeholder="e.g., 2024-25"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      <option value="draft">Draft</option>
                      <option value="issued">Issued</option>
                      <option value="delivered">Delivered</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      onClick={handleApplyFilters}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Certificates List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Certificates ({certificatesData.certificates.length})</h3>
                
                {certificatesData.certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Certificates Found</h3>
                    <p className="text-gray-600">This student doesn't have any certificates matching your criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {certificatesData.certificates.map((certificate: CertificateData) => (
                      <div key={certificate.certificateNumber} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Award className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{certificate.certificateTitle}</h4>
                              <p className="text-sm text-gray-500">Certificate #{certificate.certificateNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
                              {getStatusIcon(certificate.status)}
                              {certificate.status}
                            </span>
                            {certificate.isVerified && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                          {/* Course Information */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              Course Information
                            </h5>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><span className="font-medium">Title:</span> {certificate.course.title}</p>
                              <p><span className="font-medium">Category:</span> {certificate.course.category}</p>
                              <p><span className="font-medium">Instructor:</span> {certificate.course.instructor.name}</p>
                              <p><span className="font-medium">Duration:</span> {certificate.course.duration} days</p>
                            </div>
                          </div>

                          {/* Batch Information */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              Batch Information
                            </h5>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><span className="font-medium">Name:</span> {certificate.batch.name}</p>
                              <p><span className="font-medium">Start Date:</span> {formatDate(certificate.batch.startDate)}</p>
                              <p><span className="font-medium">End Date:</span> {formatDate(certificate.batch.endDate)}</p>
                              <p><span className="font-medium">Max Students:</span> {certificate.batch.maxStudents}</p>
                            </div>
                          </div>

                          {/* Performance Information */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              Performance
                            </h5>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p><span className="font-medium">Grade:</span> {certificate.grade}</p>
                              <p><span className="font-medium">Percentage:</span> {certificate.percentage}%</p>
                              <p><span className="font-medium">CGPA:</span> {certificate.cgpa}</p>
                              <p><span className="font-medium">Academic Year:</span> {certificate.academicYear}</p>
                            </div>
                          </div>
                        </div>

                        {/* Marksheet Information */}
                        {certificate.marksheet && (
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              Related Marksheet
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <p><span className="font-medium">Marksheet #:</span> {certificate.marksheet.marksheetNumber}</p>
                              <p><span className="font-medium">Semester:</span> {certificate.marksheet.semester}</p>
                              <p><span className="font-medium">Exam Type:</span> {certificate.marksheet.examinationType}</p>
                              <p><span className="font-medium">Result:</span> {certificate.marksheet.result}</p>
                            </div>
                          </div>
                        )}

                        {/* Additional Information */}
                        {(certificate.description || certificate.achievements || certificate.deliveryAddress) && (
                          <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              Additional Information
                            </h5>
                            <div className="space-y-3 text-sm text-gray-600">
                              {certificate.description && (
                                <div>
                                  <span className="font-medium">Description:</span>
                                  <p className="mt-1">{certificate.description}</p>
                                </div>
                              )}
                              {certificate.achievements && certificate.achievements.length > 0 && (
                                <div>
                                  <span className="font-medium">Achievements:</span>
                                  <div className="mt-1 space-y-1">
                                    {certificate.achievements.map((achievement) => (
                                      <div key={achievement._id} className="bg-white p-2 rounded border">
                                        <p className="font-medium">{achievement.title}</p>
                                        <p className="text-xs text-gray-500">{achievement.description}</p>
                                        <p className="text-xs text-gray-400">{formatDate(achievement.date)}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {certificate.deliveryAddress && (
                                <div>
                                  <span className="font-medium">Delivery Address:</span>
                                  <p className="mt-1">
                                    {certificate.deliveryAddress.street && `${certificate.deliveryAddress.street}, `}
                                    {certificate.deliveryAddress.city && `${certificate.deliveryAddress.city}, `}
                                    {certificate.deliveryAddress.state && `${certificate.deliveryAddress.state}, `}
                                    {certificate.deliveryAddress.zipCode && `${certificate.deliveryAddress.zipCode}, `}
                                    {certificate.deliveryAddress.country}
                                  </p>
                                </div>
                              )}
                              {certificate.deliveryMethod && (
                                <div>
                                  <span className="font-medium">Delivery Method:</span> {certificate.deliveryMethod}
                                </div>
                              )}
                              {certificate.deliveryStatus && (
                                <div>
                                  <span className="font-medium">Delivery Status:</span> {certificate.deliveryStatus}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-500">
                            <p>Created: {formatDate(certificate.createdAt)}</p>
                            <p>Created by: {certificate.createdBy.firstName} {certificate.createdBy.lastName}</p>
                            {certificate.verifiedBy && (
                              <p>Verified by: {certificate.verifiedBy.firstName} {certificate.verifiedBy.lastName}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-900 text-sm">
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button 
                              onClick={() => handleDownloadPDF(certificate)}
                              className="flex items-center gap-1 px-3 py-1.5 text-green-600 hover:text-green-900 text-sm"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {certificatesData.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={() => fetchCertificates(page - 1)}
                    disabled={!certificatesData.pagination.hasPrevPage}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {page} of {certificatesData.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchCertificates(page + 1)}
                    disabled={!certificatesData.pagination.hasNextPage}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* PDF Generator */}
      {selectedCertificate && (
        <CertificatePDFGenerator
          ref={pdfGeneratorRef}
          certificateData={selectedCertificate}
          onBeforePrint={() => console.log('Starting certificate PDF generation...')}
          onAfterPrint={() => {
            console.log('Certificate PDF generation completed');
            setSelectedCertificate(null);
          }}
        />
      )}
    </div>
  );
};

export default ViewCertificatesModal;
