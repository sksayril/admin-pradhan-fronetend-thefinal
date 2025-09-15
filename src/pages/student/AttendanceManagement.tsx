import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Download, AlertCircle, RefreshCw, Eye, Edit, Users, Clock, CheckCircle, XCircle, FileText, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceService } from '../../services';
import { StudentWithEnrollments } from '../../services/types';
import MarkAttendanceModal from '../../components/MarkAttendanceModal';
import StudentAttendanceReportModal from '../../components/StudentAttendanceReportModal';

const AttendanceManagement: React.FC = () => {
  // State for students with enrollments
  const [studentsWithEnrollments, setStudentsWithEnrollments] = useState<StudentWithEnrollments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  // State for pagination
  const [currentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // State for attendance tracking
  const [attendanceStatus, setAttendanceStatus] = useState<{[key: string]: 'present' | 'absent'}>({});

  // State for attendance marking modal
  const [isMarkAttendanceModalOpen, setIsMarkAttendanceModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithEnrollments | null>(null);

  // State for attendance report modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<StudentWithEnrollments | null>(null);

  // Load students with enrollments data
  const loadStudentsWithEnrollments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await attendanceService.getStudentsWithEnrollments();
      if (response.success && response.data) {
        setStudentsWithEnrollments(response.data.students);
        setTotalStudents(response.data.overallStats.totalStudents);
      } else {
        throw new Error(response.message || 'Failed to load students with enrollments');
      }
    } catch (err) {
      console.error('Error loading students with enrollments:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      // Show error toast
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

  // Load data on component mount
  useEffect(() => {
    loadStudentsWithEnrollments();
  }, [currentPage]);



  // Handle export
  const handleExport = async () => {
    try {
      // Export logic would go here
      console.log('Exporting attendance data...');
    } catch (err) {
      console.error('Error exporting attendance data:', err);
      setError('Failed to export attendance data. Please try again.');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadStudentsWithEnrollments();
  };

  // Handle view attendance report
  const handleViewAttendanceReport = (student: StudentWithEnrollments) => {
    // This would open a modal with detailed attendance report
    console.log('Viewing attendance report for:', student);
  };

  // Handle attendance status change
  const handleAttendanceStatusChange = (studentId: string, status: 'present' | 'absent') => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Handle mark attendance button click
  const handleMarkAttendance = (student: StudentWithEnrollments) => {
    setSelectedStudent(student);
    setIsMarkAttendanceModalOpen(true);
    
    // Show info toast
    toast.success(`📝 Opening attendance form for ${student.studentDetails.fullName}`, {
      duration: 2000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontSize: '14px',
      },
    });
  };

  // Handle attendance marking success
  const handleAttendanceMarked = () => {
    // Show success toast
    toast.success('📊 Attendance data refreshed successfully!', {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
      },
    });
    
    // Refresh the data to show updated attendance
    loadStudentsWithEnrollments();
  };

  // Handle close attendance modal
  const handleCloseAttendanceModal = () => {
    setIsMarkAttendanceModalOpen(false);
    setSelectedStudent(null);
    
    // Show info toast
    toast.success('📋 Attendance form closed', {
      duration: 1500,
      style: {
        background: '#6B7280',
        color: '#fff',
        fontSize: '14px',
      },
    });
  };

  // Handle report button click
  const handleViewReport = (student: StudentWithEnrollments) => {
    setSelectedStudentForReport(student);
    setIsReportModalOpen(true);
    
    // Show info toast
    toast.success(`📊 Opening attendance report for ${student.studentDetails.fullName}`, {
      duration: 2000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontSize: '14px',
      },
    });
  };

  // Handle close report modal
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedStudentForReport(null);
    
    // Show info toast
    toast.success('📊 Attendance report closed', {
      duration: 1500,
      style: {
        background: '#6B7280',
        color: '#fff',
        fontSize: '14px',
      },
    });
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => console.log('Create session clicked')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Session</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Enrollments</p>
              <p className="text-2xl font-bold text-gray-800">
                {studentsWithEnrollments.reduce((sum, student) => sum + student.enrollmentStats.activeEnrollments, 0)}
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
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-800">
                {studentsWithEnrollments.length > 0 ? studentsWithEnrollments[0].enrollmentStats.totalCourses : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-gray-800">
                {studentsWithEnrollments.length > 0 ? studentsWithEnrollments[0].enrollmentStats.totalBatches : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>


      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Students with Enrollments ({studentsWithEnrollments.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses & Batches</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-500">Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 text-red-300 mb-2" />
                      <p className="text-red-600 font-medium">Error loading students</p>
                      <p className="text-gray-500 text-sm">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : studentsWithEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-gray-300 mb-2" />
                      <p>No students found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                studentsWithEnrollments.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {student.studentDetails.firstName.charAt(0)}{student.studentDetails.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.studentDetails.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentDetails.studentId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentDetails.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            {student.enrollmentStats.activeEnrollments} Active
                          </span>
                          <span className="flex items-center">
                            <XCircle className="w-4 h-4 text-gray-400 mr-1" />
                            {student.enrollmentStats.completedEnrollments} Completed
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {student.enrollmentStats.totalEnrollments}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {student.enrollments.slice(0, 2).map((enrollment, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium text-gray-900">
                              {enrollment.course.title}
                            </div>
                            <div className="text-gray-500">
                              {enrollment.batch.name}
                            </div>
                          </div>
                        ))}
                        {student.enrollments.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{student.enrollments.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.studentId}`}
                            value="present"
                            checked={attendanceStatus[student.studentId] === 'present'}
                            onChange={() => handleAttendanceStatusChange(student.studentId, 'present')}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-green-600 font-medium">Present</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student.studentId}`}
                            value="absent"
                            checked={attendanceStatus[student.studentId] === 'absent'}
                            onChange={() => handleAttendanceStatusChange(student.studentId, 'absent')}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-red-600 font-medium">Absent</span>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        student.studentDetails.kycStatus === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : student.studentDetails.kycStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.studentDetails.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewAttendanceReport(student)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="View Attendance Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMarkAttendance(student)}
                          className="text-blue-600 hover:text-blue-900" 
                          title="Mark Attendance"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleViewReport(student)}
                          className="text-green-600 hover:text-green-900" 
                          title="View Attendance Report"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit">
                          <Edit className="w-4 h-4" />
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
        {studentsWithEnrollments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {studentsWithEnrollments.length} of {totalStudents} students
            </div>
          </div>
        )}
      </div>

      {/* Mark Attendance Modal */}
      <MarkAttendanceModal
        isOpen={isMarkAttendanceModalOpen}
        onClose={handleCloseAttendanceModal}
        student={selectedStudent}
        onSuccess={handleAttendanceMarked}
      />

      {/* Student Attendance Report Modal */}
      <StudentAttendanceReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        student={selectedStudentForReport}
      />
    </div>
  );
};

export default AttendanceManagement;
