import React, { useState } from 'react';
import { X, CheckCircle, User, BookOpen, AlertCircle } from 'lucide-react';
import { enrollmentService, Enrollment } from '../services/enrollmentService';

interface EnrollmentApprovalModalProps {
  enrollment: Enrollment;
  onClose: () => void;
  onSuccess: () => void;
}

const EnrollmentApprovalModal: React.FC<EnrollmentApprovalModalProps> = ({
  enrollment,
  onClose,
  onSuccess
}) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting approval for enrollment:', enrollment._id);
      console.log('Admin notes:', adminNotes);
      
      const response = await enrollmentService.approveEnrollment(
        enrollment._id,
        adminNotes.trim() || undefined
      );
      
      console.log('Approval response:', response);
      
      if (response.success) {
        console.log('Approval successful, calling onSuccess');
        onSuccess();
        onClose();
      } else {
        console.error('Approval failed:', response.message);
        setError(response.message || 'Failed to approve enrollment');
      }
    } catch (err) {
      console.error('Error approving enrollment:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAdminNotes('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Approve Enrollment</h2>
              <p className="text-sm text-gray-500">Confirm enrollment approval for student</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Enrollment Details */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Student Information
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">
                    {enrollment.studentId.firstName} {enrollment.studentId.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium text-gray-800">{enrollment.studentId.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{enrollment.studentId.email}</p>
                </div>
                {enrollment.studentId.phoneNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{enrollment.studentId.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Course & Batch Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Course & Batch Details
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Course</p>
                  <p className="font-medium text-gray-800">{enrollment.courseId.title}</p>
                  <p className="text-xs text-gray-500">{enrollment.courseId.category} • {enrollment.courseId.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Batch</p>
                  <p className="font-medium text-gray-800">{enrollment.batchId.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-800">
                    {enrollmentService.formatDate(enrollment.batchId.startDate)} - {enrollmentService.formatDate(enrollment.batchId.endDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium text-gray-800">
                    {enrollmentService.formatCurrency(enrollment.paymentAmount, enrollment.currency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any notes or comments about this approval..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              These notes will be visible to the student and other administrators.
            </p>
          </div>

          {/* Confirmation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Approval Confirmation</h4>
                <p className="text-sm text-green-700 mt-1">
                  By approving this enrollment, the student will be:
                </p>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Added to the course batch</li>
                  <li>• Granted access to course materials</li>
                  <li>• Notified of the approval via email</li>
                  <li>• Able to start attending classes</li>
                </ul>
              </div>
            </div>
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
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Approving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Enrollment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentApprovalModal;
