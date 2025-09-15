import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { attendanceService } from '../services';
import { StudentWithEnrollments, MarkSimpleAttendanceRequest } from '../services/types';

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentWithEnrollments | null;
  onSuccess: () => void;
}

const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess
}) => {
  const [formData, setFormData] = useState<MarkSimpleAttendanceRequest>({
    studentId: '',
    attendanceDate: new Date().toISOString().split('T')[0],
    status: 'present',
    timeSlot: {
      startTime: '09:00',
      endTime: '11:00'
    },
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill form data when student changes
  useEffect(() => {
    if (student && isOpen) {
      // Set default values
      const defaultFormData: MarkSimpleAttendanceRequest = {
        studentId: student.studentId,
        attendanceDate: new Date().toISOString().split('T')[0],
        status: 'present',
        timeSlot: {
          startTime: '09:00',
          endTime: '11:00'
        },
        remarks: ''
      };

      setFormData(defaultFormData);
      setError(null);
    }
  }, [student, isOpen]);

  const handleInputChange = (field: keyof MarkSimpleAttendanceRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeSlotChange = (field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      timeSlot: {
        ...prev.timeSlot,
        [field]: value
      }
    }));
  };


  const validateForm = (): string | null => {

    if (!formData.attendanceDate) {
      return 'Please select an attendance date';
    }

    if (!formData.timeSlot.startTime || !formData.timeSlot.endTime) {
      return 'Please provide both start and end times';
    }

    // Validate time slot
    const startTime = new Date(`2000-01-01T${formData.timeSlot.startTime}`);
    const endTime = new Date(`2000-01-01T${formData.timeSlot.endTime}`);
    
    if (startTime >= endTime) {
      return 'End time must be after start time';
    }

    // Validate date is not in the future
    const selectedDate = new Date(formData.attendanceDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (selectedDate > today) {
      return 'Attendance date cannot be in the future';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await attendanceService.markSimpleAttendance(formData);
      
      if (response.success) {
        // Show success toast with student and attendance details
        const studentName = student?.studentDetails.fullName || 'Student';
        const status = formData.status.charAt(0).toUpperCase() + formData.status.slice(1);
        const date = new Date(formData.attendanceDate).toLocaleDateString();
        
        toast.success(
          `✅ Attendance marked successfully!\n${studentName} - ${status} on ${date}`,
          {
            duration: 4000,
            style: {
              background: '#10B981',
              color: '#fff',
              fontSize: '14px',
              lineHeight: '1.4',
            },
          }
        );
        
        onSuccess();
        onClose();
      } else {
        const errorMessage = response.message || 'Failed to mark attendance';
        toast.error(`❌ ${errorMessage}`, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
          },
        });
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      
      toast.error(`❌ ${errorMessage}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '14px',
        },
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      studentId: '',
      attendanceDate: new Date().toISOString().split('T')[0],
      status: 'present',
      timeSlot: {
        startTime: '09:00',
        endTime: '11:00'
      },
      remarks: ''
    });
    setError(null);
    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Mark Attendance</h2>
              <p className="text-sm text-gray-500">Record attendance for student</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}


          {/* Date and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Attendance Date
              </label>
              <input
                type="date"
                value={formData.attendanceDate}
                onChange={(e) => handleInputChange('attendanceDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Time Slot
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.timeSlot.startTime}
                  onChange={(e) => handleTimeSlotChange('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.timeSlot.endTime}
                  onChange={(e) => handleTimeSlotChange('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              placeholder="Add any additional notes or remarks..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Marking...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark Attendance</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkAttendanceModal;
