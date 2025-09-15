import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, BookOpen, Users, TrendingUp, Download, Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceService } from '../services';
import { StudentWithEnrollments, StudentAttendanceReportRequest, StudentAttendanceReportResponse } from '../services/types';

interface StudentAttendanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithEnrollments | null;
}

const StudentAttendanceReportModal: React.FC<StudentAttendanceReportModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const [reportData, setReportData] = useState<StudentAttendanceReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentAttendanceReportRequest>({
    studentId: '',
    year: new Date().getFullYear().toString(),
    month: '',
    startDate: '',
    endDate: ''
  });

  // Auto-fill student ID when student changes
  useEffect(() => {
    if (student && isOpen) {
      setFilters(prev => ({
        ...prev,
        studentId: student.studentId
      }));
      setError(null);
    }
  }, [student, isOpen]);

  // Load report data when filters change
  useEffect(() => {
    if (filters.studentId && isOpen) {
      loadReport();
    }
  }, [filters, isOpen]);

  const loadReport = async () => {
    if (!filters.studentId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await attendanceService.getStudentAttendanceReport(filters);
      
      if (response.success && response.data) {
        setReportData(response.data);
        toast.success('📊 Attendance report loaded successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '14px',
          },
        });
      } else {
        throw new Error(response.message || 'Failed to load attendance report');
      }
    } catch (err) {
      console.error('Error loading attendance report:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast.error(`❌ ${errorMessage}`, {
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

  const handleFilterChange = (field: keyof StudentAttendanceReportRequest, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      studentId: student?.studentId || '',
      year: new Date().getFullYear().toString(),
      month: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleClose = () => {
    setReportData(null);
    setError(null);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    if (rate >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Attendance Report</h2>
              <p className="text-sm text-gray-500">Detailed attendance analysis for student</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Student Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {student.studentDetails.firstName.charAt(0)}{student.studentDetails.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {student.studentDetails.fullName}
              </h3>
              <p className="text-sm text-gray-500">{student.studentDetails.studentId}</p>
              <p className="text-sm text-gray-500">{student.studentDetails.email}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Report Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!filters.year}
              >
                <option value="">All Months</option>
                {filters.year && Array.from({ length: 12 }, (_, i) => {
                  const month = i + 1;
                  const monthName = new Date(parseInt(filters.year), i).toLocaleString('default', { month: 'long' });
                  return (
                    <option key={month} value={month.toString()}>
                      {monthName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={loadReport}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Report</span>
                </>
              )}
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading attendance report...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {reportData && !loading && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Days</p>
                      <p className="text-2xl font-bold text-blue-800">{reportData.summary.totalDays}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Present</p>
                      <p className="text-2xl font-bold text-green-800">{reportData.summary.present}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <X className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-sm text-red-600 font-medium">Absent</p>
                      <p className="text-2xl font-bold text-red-800">{reportData.summary.absent}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Attendance Rate</p>
                      <p className={`text-2xl font-bold ${getAttendanceRateColor(reportData.summary.overallAttendanceRate)}`}>
                        {reportData.summary.overallAttendanceRate}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Enrollments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportData.enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <BookOpen className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{enrollment.course.title}</h4>
                          <p className="text-sm text-gray-600">{enrollment.course.category} • {enrollment.course.type}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            <Users className="w-4 h-4 inline mr-1" />
                            {enrollment.batch.name}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              enrollment.status === 'enrolled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              enrollment.approvalStatus === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {enrollment.approvalStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Reports */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Breakdown</h3>
                <div className="space-y-4">
                  {reportData.monthlyReport.map((month) => (
                    <div key={month.monthKey} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">{month.month}</h4>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            {month.present}/{month.totalDays} days
                          </span>
                          <span className={`font-semibold ${getAttendanceRateColor(month.attendanceRate)}`}>
                            {month.attendanceRate}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{month.present}</p>
                          <p className="text-sm text-gray-600">Present</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{month.absent}</p>
                          <p className="text-sm text-gray-600">Absent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-600">{month.late}</p>
                          <p className="text-sm text-gray-600">Late</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{month.excused}</p>
                          <p className="text-sm text-gray-600">Excused</p>
                        </div>
                      </div>

                      {month.records.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-700 mb-2">Attendance Records</h5>
                          <div className="space-y-2">
                            {month.records.map((record) => (
                              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Calendar className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">
                                    {new Date(record.date).toLocaleDateString()}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                    {record.status}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    {record.timeSlot.startTime} - {record.timeSlot.endTime}
                                  </span>
                                  <span>{record.course.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Close
          </button>
          {reportData && (
            <button
              onClick={() => {
                toast.success('📄 Report export feature coming soon!', {
                  duration: 3000,
                  style: {
                    background: '#3B82F6',
                    color: '#fff',
                    fontSize: '14px',
                  },
                });
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceReportModal;
