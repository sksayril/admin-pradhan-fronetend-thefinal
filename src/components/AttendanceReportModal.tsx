import React, { useState, useEffect } from 'react';
import { X, Calendar, User, BookOpen, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, BarChart3, Download } from 'lucide-react';
import { StudentAttendanceSummary, AttendanceReport } from '../services/types';
import { attendanceService } from '../services';

interface AttendanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentAttendanceSummary | null;
  courseId?: string;
  batchId?: string;
}

const AttendanceReportModal: React.FC<AttendanceReportModalProps> = ({
  isOpen,
  onClose,
  student,
  courseId,
  batchId
}) => {
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });

  useEffect(() => {
    if (isOpen && student && courseId && batchId) {
      loadAttendanceReport();
    }
  }, [isOpen, student, courseId, batchId, dateRange]);

  const loadAttendanceReport = async () => {
    if (!student || !courseId || !batchId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await attendanceService.getAttendanceReport(
        courseId,
        batchId,
        dateRange.startDate,
        dateRange.endDate
      );
      
      if (response.success && response.data) {
        setAttendanceReport(response.data);
      } else {
        throw new Error(response.message || 'Failed to load attendance report');
      }
    } catch (err) {
      console.error('Error loading attendance report:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    // Export logic would go here
    console.log('Exporting attendance report...');
  };

  const formatDate = (dateString: string) => {
    return attendanceService.formatDate(dateString);
  };

  const formatDateTime = (dateString: string) => {
    return attendanceService.formatDateTime(dateString);
  };

  const getAttendancePercentageColor = (percentage: number) => {
    return attendanceService.getAttendancePercentageColor(percentage);
  };

  const getAttendanceStatusColor = (status: string) => {
    return attendanceService.getAttendanceStatusColor(status);
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Attendance Report</h2>
              <p className="text-sm text-gray-600">
                {student.studentDetails.firstName} {student.studentDetails.lastName} ({student.studentDetails.studentId})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Date Range Selector */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Report Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading attendance report...</p>
              </div>
            </div>
          ) : attendanceReport ? (
            <div className="space-y-6">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                      <p className="text-2xl font-bold text-gray-800">{attendanceReport.totalSessions}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Present</p>
                      <p className="text-2xl font-bold text-green-600">{student.presentCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Absent</p>
                      <p className="text-2xl font-bold text-red-600">{student.absentCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Attendance %</p>
                      <p className={`text-2xl font-bold ${getAttendancePercentageColor(student.attendancePercentage)}`}>
                        {student.attendancePercentage}%
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course and Batch Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course & Batch Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Course</label>
                    <p className="text-gray-800 font-semibold">
                      {typeof student.courseId === 'object' ? student.courseId.title : 'Unknown Course'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Batch</label>
                    <p className="text-gray-800 font-semibold">
                      {typeof student.batchId === 'object' ? student.batchId.name : 'Unknown Batch'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Attendance Records */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
                  <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {student.attendanceRecords.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            No attendance records found for the selected period
                          </td>
                        </tr>
                      ) : (
                        student.attendanceRecords.map((record) => (
                          <tr key={record._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(record.sessionDate)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {attendanceService.formatTime(record.checkInTime || '00:00')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {record.checkInTime ? formatDateTime(record.checkInTime) : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {record.notes || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No attendance data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportModal;
