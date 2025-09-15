import React, { useState } from 'react';
import { X, RotateCcw, AlertCircle, User, BookOpen } from 'lucide-react';

interface SyncResult {
  id: string;
  student: {
    _id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    email: string;
  };
  course: {
    _id: string;
    title: string;
    category: string;
    type: string;
  };
  batch: {
    id: string;
    name: string;
    enrolledStudentsCount: number;
  };
  status: string;
  approvalStatus: string;
  wasInBatch: boolean;
  action: string;
  updated: boolean;
}

interface EnrollmentSyncModalProps {
  enrollment: {
    _id: string;
    studentId: {
      firstName: string;
      lastName: string;
      studentId: string;
      email: string;
    };
    courseId: {
      title: string;
      category: string;
      type: string;
    };
    batchId: {
      name: string;
    };
    status: string;
    approvalStatus: string;
  };
  onClose: () => void;
  onSuccess: (syncResult: SyncResult) => void;
}

const EnrollmentSyncModal: React.FC<EnrollmentSyncModalProps> = ({
  enrollment,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Syncing enrollment:', enrollment._id);
      const response = await import('../services/enrollmentService').then(module => 
        module.enrollmentService.syncEnrollmentWithBatch(enrollment._id)
      );
      
      console.log('Sync response:', response);
      
      if (response.success && response.data) {
        const syncResult = response.data.enrollment;
        console.log('Sync completed:', syncResult);
        onSuccess(syncResult);
        onClose();
      } else {
        console.error('Sync failed:', response.message);
        setError(response.message || 'Failed to sync enrollment');
      }
    } catch (err) {
      console.error('Error syncing enrollment:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Sync Enrollment with Batch</h2>
              <p className="text-sm text-gray-500">Synchronize enrollment status with batch enrollment list</p>
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
                  <p className="text-sm text-gray-500">Current Status</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      enrollment.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {enrollment.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      enrollment.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      enrollment.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {enrollment.approvalStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Information */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Sync Explanation */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <RotateCcw className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-purple-800">What does sync do?</h4>
                <p className="text-sm text-purple-700 mt-1">
                  This operation synchronizes the enrollment status with the batch's enrolled students list:
                </p>
                <ul className="text-sm text-purple-700 mt-2 space-y-1">
                  <li>• <strong>Approved enrollment not in batch:</strong> Adds student to batch's enrolledStudents array</li>
                  <li>• <strong>Rejected enrollment still in batch:</strong> Removes student from batch's enrolledStudents array</li>
                  <li>• <strong>Pending enrollment:</strong> No action needed</li>
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
              onClick={handleSync}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Sync with Batch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSyncModal;
