import React, { useState, useEffect } from 'react';
import { X, BookOpen, Calendar, Clock, DollarSign, CheckCircle, AlertCircle, User, GraduationCap } from 'lucide-react';
import { enrollmentService } from '../services';
import { Enrollment, EnhancedStudent } from '../services/types';

interface StudentEnrollmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: EnhancedStudent | null;
}

const StudentEnrollmentsModal: React.FC<StudentEnrollmentsModalProps> = ({ 
  isOpen, 
  onClose, 
  student 
}) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && student) {
      loadEnrollments();
    }
  }, [isOpen, student]);

  const loadEnrollments = async () => {
    if (!student) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await enrollmentService.getEnrollmentsByStudentId(student._id);
      if (response.success && response.data) {
        setEnrollments(response.data.enrollments);
      } else {
        throw new Error(response.message || 'Failed to load enrollments');
      }
    } catch (err) {
      console.error('Error loading enrollments:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Student Enrollments</h2>
              <p className="text-sm text-gray-600">
                {student.firstName} {student.lastName} ({student.studentId})
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading enrollments...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-medium">Error loading enrollments</p>
                <p className="text-gray-600 text-sm mt-1">{error}</p>
                <button 
                  onClick={loadEnrollments}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No enrollments found</p>
                <p className="text-gray-500 text-sm mt-1">
                  This student hasn't enrolled in any courses yet.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Student Info Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Department:</span>
                    <p className="text-gray-900">{student.department}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Year:</span>
                    <p className="text-gray-900">{student.year}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total Enrollments:</span>
                    <p className="text-gray-900">{enrollments.length}</p>
                  </div>
                </div>
              </div>

              {/* Enrollments List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                  Course Enrollments
                </h3>
                
                {enrollments.map((enrollment) => (
                  <div key={enrollment._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Course Information */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {enrollment.courseId.title}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-600 w-20">Category:</span>
                              <span className="text-gray-900">{enrollment.courseId.category}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-600 w-20">Type:</span>
                              <span className="text-gray-900 capitalize">{enrollment.courseId.type}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Batch Information</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-600 w-20">Batch:</span>
                              <span className="text-gray-900">{enrollment.batchId.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-gray-900">
                                {formatDate(enrollment.batchId.startDate)} - {formatDate(enrollment.batchId.endDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enrollment Details */}
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Enrollment Details</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-600">Status:</span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${enrollmentService.getEnrollmentStatusColor(enrollment.status)}`}>
                                {enrollment.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-600">Payment:</span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${enrollmentService.getPaymentStatusColor(enrollment.paymentStatus)}`}>
                                {enrollment.paymentStatus}
                              </span>
                            </div>
                            {enrollment.paymentAmount && (
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-600">Amount:</span>
                                <span className="text-gray-900">₹{enrollment.paymentAmount}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Timeline</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-gray-600">Enrolled:</span>
                              <span className="text-gray-900 ml-2">{formatDateTime(enrollment.enrollmentDate)}</span>
                            </div>
                            {enrollment.paymentDate && (
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-gray-600">Paid:</span>
                                <span className="text-gray-900 ml-2">{formatDateTime(enrollment.paymentDate)}</span>
                              </div>
                            )}
                            {enrollment.completionDate && (
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-gray-600">Completed:</span>
                                <span className="text-gray-900 ml-2">{formatDateTime(enrollment.completionDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Additional Info */}
                        {(enrollment.grade || enrollment.certificateIssued) && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Results</h5>
                            <div className="space-y-2 text-sm">
                              {enrollment.grade && (
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-600">Grade:</span>
                                  <span className="text-gray-900">{enrollment.grade}</span>
                                </div>
                              )}
                              {enrollment.certificateIssued && (
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-600">Certificate:</span>
                                  <span className="text-green-600 font-medium">Issued</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollmentsModal;
