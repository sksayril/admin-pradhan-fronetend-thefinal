import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Eye, Download, FileText, Calendar, Award, CheckCircle, XCircle, User } from 'lucide-react';
import { marksheetService } from '../services';
import toast from 'react-hot-toast';
import MarksheetPDFGenerator, { MarksheetPDFGeneratorRef } from './MarksheetPDFGenerator';

interface ViewMarksheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    email: string;
    department?: string;
    year?: string
  };
}

interface MarksheetData {
  marksheetNumber: string;
  academicYear: string;
  semester: string;
  examinationType: string;
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  cgpa: number;
  overallGrade: string;
  result: string;
  examinationDate: string;
  resultDate: string;
  status: string;
  isVerified: boolean;
  verificationCode: string;
  course: {
    courseId: string;
    title: string;
    category: string;
    instructor: string;
    duration: string;
  };
  batch: {
    batchId: string;
    name: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
  };
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
  subjects: Array<{
    subjectName: string;
    subjectCode: string;
    credits: number;
    marksObtained: number;
    maxMarks: number;
    grade: string;
    gradePoints: number;
  }>;
  remarks: string;
  printHistory: any[];
  downloadHistory: any[];
  digitalSignature: string;
}

interface StudentMarksheetsResponse {
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    studentId: string;
    email: string;
    department: string;
    year: string;
    phoneNumber: string;
    address: string;
  };
  statistics: {
    totalMarksheets: number;
    verifiedMarksheets: number;
    publishedMarksheets: number;
    averagePercentage: number;
    averageCGPA: number;
    passCount: number;
    failCount: number;
  };
  marksheets: MarksheetData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMarksheets: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const ViewMarksheetsModal: React.FC<ViewMarksheetsModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const [loading, setLoading] = useState(false);
  const [marksheetsData, setMarksheetsData] = useState<StudentMarksheetsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    academicYear: '',
    semester: '',
    examinationType: '',
    result: '',
    status: ''
  });
  const [selectedMarksheet, setSelectedMarksheet] = useState<MarksheetData | null>(null);
  const [showMarksheetDetail, setShowMarksheetDetail] = useState(false);
  const pdfGeneratorRef = useRef<MarksheetPDFGeneratorRef>(null);

  const loadMarksheets = useCallback(async () => {
    if (!student?._id) return;

    setLoading(true);
    try {
      const response = await marksheetService.getStudentMarksheets(
        student._id,
        currentPage,
        10,
        filters
      );

      if (response.success && response.data) {
        setMarksheetsData(response.data);
      } else {
        toast.error('Failed to load marksheets');
      }
    } catch (error) {
      console.error('Error loading marksheets:', error);
      toast.error('Error loading marksheets');
    } finally {
      setLoading(false);
    }
  }, [student?._id, currentPage, filters]);

  useEffect(() => {
    if (isOpen && student?._id) {
      loadMarksheets();
    }
  }, [isOpen, student?._id, loadMarksheets]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleViewMarksheet = (marksheet: MarksheetData) => {
    setSelectedMarksheet(marksheet);
    setShowMarksheetDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedMarksheet(null);
    setShowMarksheetDetail(false);
  };

  const handleDownloadPDF = (marksheet: MarksheetData) => {
    try {
      console.log('Download PDF clicked for marksheet:', marksheet.marksheetNumber);
      
      // Set the selected marksheet first
      setSelectedMarksheet(marksheet);
      
      // Wait for the component to mount, then trigger download
      setTimeout(() => {
        console.log('PDF generator ref:', pdfGeneratorRef.current);
        if (pdfGeneratorRef.current) {
          console.log('Triggering PDF download...');
          pdfGeneratorRef.current.downloadPDF();
          toast.success('PDF download started!');
        } else {
          console.error('PDF generator ref is null');
          toast.error('PDF generator not ready. Please try again.');
        }
      }, 500); // Increased timeout to ensure component is mounted
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A+') || grade.includes('A')) {
      return 'text-green-600 font-semibold';
    } else if (grade.includes('B')) {
      return 'text-blue-600 font-semibold';
    } else if (grade.includes('C')) {
      return 'text-yellow-600 font-semibold';
    } else {
      return 'text-red-600 font-semibold';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <FileText className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                View Marksheets
              </h2>
              <p className="text-sm text-gray-600">
                {student.firstName} {student.lastName} ({student.studentId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Statistics */}
        {marksheetsData?.statistics && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {marksheetsData.statistics.totalMarksheets}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Verified</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {marksheetsData.statistics.verifiedMarksheets}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {marksheetsData.statistics.publishedMarksheets}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Passed</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {marksheetsData.statistics.passCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Failed</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {marksheetsData.statistics.failCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Avg %</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {marksheetsData.statistics.averagePercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Avg CGPA</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {marksheetsData.statistics.averageCGPA.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <select
                value={filters.academicYear}
                onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
                <option value="2022-23">2022-23</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Semesters</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="3rd">3rd Semester</option>
                <option value="4th">4th Semester</option>
                <option value="5th">5th Semester</option>
                <option value="6th">6th Semester</option>
                <option value="7th">7th Semester</option>
                <option value="8th">8th Semester</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Type
              </label>
              <select
                value={filters.examinationType}
                onChange={(e) => handleFilterChange('examinationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Regular">Regular</option>
                <option value="Supplementary">Supplementary</option>
                <option value="Backlog">Backlog</option>
                <option value="Improvement">Improvement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Result
              </label>
              <select
                value={filters.result}
                onChange={(e) => handleFilterChange('result', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Results</option>
                <option value="PASS">Pass</option>
                <option value="FAIL">Fail</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-600">Loading marksheets...</span>
              </div>
            </div>
          ) : marksheetsData?.marksheets && marksheetsData.marksheets.length > 0 ? (
            <div className="p-6">
              <div className="space-y-4">
                {marksheetsData.marksheets.map((marksheet) => (
                  <div
                    key={marksheet.marksheetNumber}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {marksheet.marksheetNumber}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(marksheet.status)}`}>
                            {marksheet.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(marksheet.result)}`}>
                            {marksheet.result}
                          </span>
                          {marksheet.isVerified && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Course</p>
                            <p className="font-medium text-gray-900">{marksheet.course.title}</p>
                            <p className="text-sm text-gray-500">{marksheet.course.category}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Batch</p>
                            <p className="font-medium text-gray-900">{marksheet.batch.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(marksheet.batch.startDate)} - {formatDate(marksheet.batch.endDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Academic Year & Semester</p>
                            <p className="font-medium text-gray-900">
                              {marksheet.academicYear} - {marksheet.semester}
                            </p>
                            <p className="text-sm text-gray-500">{marksheet.examinationType}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Total Marks</p>
                            <p className="font-semibold text-gray-900">
                              {marksheet.totalMarks}/{marksheet.maxTotalMarks}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Percentage</p>
                            <p className="font-semibold text-gray-900">{marksheet.percentage.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">CGPA</p>
                            <p className="font-semibold text-gray-900">{marksheet.cgpa.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Grade</p>
                            <p className={`font-semibold ${getGradeColor(marksheet.overallGrade)}`}>
                              {marksheet.overallGrade}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Exam: {formatDate(marksheet.examinationDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Result: {formatDate(marksheet.resultDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Created by: {marksheet.createdBy.firstName} {marksheet.createdBy.lastName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewMarksheet(marksheet)}
                          className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(marksheet)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {marksheetsData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, marksheetsData.pagination.totalMarksheets)} of {marksheetsData.pagination.totalMarksheets} marksheets
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!marksheetsData.pagination.hasPrevPage}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-700">
                      Page {currentPage} of {marksheetsData.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!marksheetsData.pagination.hasNextPage}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No marksheets found</h3>
              <p className="text-gray-500 text-center max-w-md">
                {student.firstName} {student.lastName} doesn't have any marksheets yet.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Marksheet Detail Modal */}
      {showMarksheetDetail && selectedMarksheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Marksheet Details - {selectedMarksheet.marksheetNumber}
              </h3>
              <button
                onClick={handleCloseDetail}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Student Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{marksheetsData?.student.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Student ID</p>
                      <p className="font-medium">{marksheetsData?.student.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{marksheetsData?.student.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-medium">{marksheetsData?.student.year}</p>
                    </div>
                  </div>
                </div>

                {/* Course & Batch Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Course & Batch Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Course</p>
                      <p className="font-medium">{selectedMarksheet.course.title}</p>
                      <p className="text-sm text-gray-500">{selectedMarksheet.course.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Batch</p>
                      <p className="font-medium">{selectedMarksheet.batch.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(selectedMarksheet.batch.startDate)} - {formatDate(selectedMarksheet.batch.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Instructor</p>
                      <p className="font-medium">{selectedMarksheet.course.instructor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{selectedMarksheet.course.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Academic Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Academic Year</p>
                      <p className="font-medium">{selectedMarksheet.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Semester</p>
                      <p className="font-medium">{selectedMarksheet.semester}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Exam Type</p>
                      <p className="font-medium">{selectedMarksheet.examinationType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Result</p>
                      <p className={`font-medium ${selectedMarksheet.result === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedMarksheet.result}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Performance Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Marks</p>
                      <p className="font-semibold text-lg">{selectedMarksheet.totalMarks}/{selectedMarksheet.maxTotalMarks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Percentage</p>
                      <p className="font-semibold text-lg">{selectedMarksheet.percentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CGPA</p>
                      <p className="font-semibold text-lg">{selectedMarksheet.cgpa.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Grade</p>
                      <p className={`font-semibold text-lg ${getGradeColor(selectedMarksheet.overallGrade)}`}>
                        {selectedMarksheet.overallGrade}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Subject-wise Performance</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Subject</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Code</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Credits</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Marks</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Grade</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMarksheet.subjects.map((subject, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 text-sm font-medium">{subject.subjectName}</td>
                            <td className="py-2 text-sm text-gray-600">{subject.subjectCode}</td>
                            <td className="py-2 text-sm text-gray-600">{subject.credits}</td>
                            <td className="py-2 text-sm text-gray-600">
                              {subject.marksObtained}/{subject.maxMarks}
                            </td>
                            <td className={`py-2 text-sm font-medium ${getGradeColor(subject.grade)}`}>
                              {subject.grade}
                            </td>
                            <td className="py-2 text-sm text-gray-600">{subject.gradePoints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Remarks */}
                {selectedMarksheet.remarks && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Remarks</h4>
                    <p className="text-gray-700">{selectedMarksheet.remarks}</p>
                  </div>
                )}

                {/* Verification Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Verification Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{selectedMarksheet.isVerified ? 'Verified' : 'Not Verified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Verification Code</p>
                      <p className="font-medium font-mono text-sm">{selectedMarksheet.verificationCode}</p>
                    </div>
                    {selectedMarksheet.verifiedBy && (
                      <div>
                        <p className="text-sm text-gray-600">Verified By</p>
                        <p className="font-medium">
                          {selectedMarksheet.verifiedBy.firstName} {selectedMarksheet.verifiedBy.lastName}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">{formatDate(selectedMarksheet.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseDetail}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Generator - Hidden Component */}
      {selectedMarksheet && marksheetsData && (
        <MarksheetPDFGenerator
          ref={pdfGeneratorRef}
          marksheetData={{
            marksheetNumber: selectedMarksheet.marksheetNumber,
            student: {
              firstName: marksheetsData.student.firstName,
              lastName: marksheetsData.student.lastName,
              studentId: marksheetsData.student.studentId,  
              dateOfBirth: '',
              email: marksheetsData.student.email,
              department: marksheetsData.student.department,
              year: marksheetsData.student.year
            },
            course: {
              title: selectedMarksheet.course.title,
              category: selectedMarksheet.course.category,
              duration: selectedMarksheet.course.duration
            },
            batch: {
              name: selectedMarksheet.batch.name,
              startDate: selectedMarksheet.batch.startDate,
              endDate: selectedMarksheet.batch.endDate
            },
            academicYear: selectedMarksheet.academicYear,
            semester: selectedMarksheet.semester,
            examinationType: selectedMarksheet.examinationType,
            subjects: selectedMarksheet.subjects,
            totalMarks: selectedMarksheet.totalMarks,
            maxTotalMarks: selectedMarksheet.maxTotalMarks,
            percentage: selectedMarksheet.percentage,
            cgpa: selectedMarksheet.cgpa,
            overallGrade: selectedMarksheet.overallGrade,
            result: selectedMarksheet.result,
            examinationDate: selectedMarksheet.examinationDate,
            resultDate: selectedMarksheet.resultDate,
            remarks: selectedMarksheet.remarks,
            verificationCode: selectedMarksheet.verificationCode,
            isVerified: selectedMarksheet.isVerified
          }}
          onAfterPrint={async () => {
            console.log('PDF download completed');
          }}
          onBeforePrint={async () => {
            console.log('PDF download starting');
            console.log('Selected marksheet:', selectedMarksheet);
            console.log('Student data:', marksheetsData.student);
          }}
        />
      )}
    </div>
  );
};

export default ViewMarksheetsModal;
