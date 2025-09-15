import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, User, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { CreateFeeRequestRequest, StudentWithEnrollments, StudentEnrollment } from '../services/types';
import './CreateFeeRequestModal.css';

interface CreateFeeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feeRequestData: CreateFeeRequestRequest) => Promise<void>;
  studentsWithEnrollments: StudentWithEnrollments[];
  loading?: boolean;
}

interface FormData {
  studentId: string;
  courseId: string;
  batchId: string;
  totalAmount: string;
  currency: string;
  paymentMethod: 'online' | 'cash';
  dueDate: string;
  notes: string;
}

interface FormErrors {
  studentId?: string;
  courseId?: string;
  batchId?: string;
  totalAmount?: string;
  paymentMethod?: string;
  dueDate?: string;
  notes?: string;
}

const CreateFeeRequestModal: React.FC<CreateFeeRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  studentsWithEnrollments,
  loading = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    studentId: '',
    courseId: '',
    batchId: '',
    totalAmount: '',
    currency: 'INR',
    paymentMethod: 'online',
    dueDate: '',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [availableEnrollments, setAvailableEnrollments] = useState<StudentEnrollment[]>([]);

  // Filter enrollments based on selected student
  useEffect(() => {
    if (formData.studentId) {
      const selectedStudent = studentsWithEnrollments.find(student => student.studentId === formData.studentId);
      if (selectedStudent) {
        setAvailableEnrollments(selectedStudent.enrollments);
      } else {
        setAvailableEnrollments([]);
      }
      
      // Reset course and batch selection when student changes
      setFormData(prev => ({ ...prev, courseId: '', batchId: '' }));
    } else {
      setAvailableEnrollments([]);
      setFormData(prev => ({ ...prev, courseId: '', batchId: '' }));
    }
  }, [formData.studentId, studentsWithEnrollments]);

  // Filter enrollments based on selected course
  useEffect(() => {
    if (formData.courseId && formData.studentId) {
      const selectedStudent = studentsWithEnrollments.find(student => student.studentId === formData.studentId);
      if (selectedStudent) {
        const courseEnrollments = selectedStudent.enrollments.filter(enrollment => enrollment.course.id === formData.courseId);
        setAvailableEnrollments(courseEnrollments);
        
        // Reset batch selection if current batch doesn't belong to selected course
        if (formData.batchId && !courseEnrollments.some(enrollment => enrollment.batch.id === formData.batchId)) {
          setFormData(prev => ({ ...prev, batchId: '' }));
        }
      }
    }
  }, [formData.courseId, formData.studentId, studentsWithEnrollments]);

  // Set default due date to 30 days from now
  useEffect(() => {
    if (isOpen && !formData.dueDate) {
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        dueDate: defaultDueDate.toISOString().split('T')[0]
      }));
    }
  }, [isOpen, formData.dueDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Please select a student';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Please select a course';
    }

    if (!formData.batchId) {
      newErrors.batchId = 'Please select a batch';
    }

    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Please select a due date';
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setApiError(null);

    try {
      const feeRequestData: CreateFeeRequestRequest = {
        studentId: formData.studentId,
        courseId: formData.courseId,
        batchId: formData.batchId,
        totalAmount: parseFloat(formData.totalAmount),
        currency: formData.currency,
        paymentMethod: formData.paymentMethod,
        dueDate: new Date(formData.dueDate).toISOString(),
        notes: formData.notes || undefined
      };

      await onSubmit(feeRequestData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleClose = () => {
    setFormData({
      studentId: '',
      courseId: '',
      batchId: '',
      totalAmount: '',
      currency: 'INR',
      paymentMethod: 'online',
      dueDate: '',
      notes: ''
    });
    setErrors({});
    setApiError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Fee Request</h2>
              <p className="text-sm text-gray-600">Generate a new fee request for a student</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700 text-sm">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Student *
              </label>
              <select
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                className={`input w-full ${errors.studentId ? 'input-error' : ''}`}
                disabled={loading}
              >
                <option value="">Select a student</option>
                {studentsWithEnrollments.map((student) => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.studentDetails.fullName} ({student.studentDetails.studentId}) - {student.enrollmentStats.totalEnrollments} enrollments
                  </option>
                ))}
              </select>
              {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>}
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Course *
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                className={`input w-full ${errors.courseId ? 'input-error' : ''}`}
                disabled={loading || !formData.studentId}
              >
                <option value="">
                  {!formData.studentId ? 'Select a student first' : 'Select a course'}
                </option>
                {availableEnrollments.map((enrollment) => (
                  <option key={enrollment.course.id} value={enrollment.course.id}>
                    {enrollment.course.title} ({enrollment.course.category}) - {enrollment.course.type}
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
            </div>

            {/* Batch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Batch *
              </label>
              <select
                name="batchId"
                value={formData.batchId}
                onChange={handleInputChange}
                className={`input w-full ${errors.batchId ? 'input-error' : ''}`}
                disabled={loading || !formData.courseId}
              >
                <option value="">
                  {!formData.courseId ? 'Select a course first' : 'Select a batch'}
                </option>
                {availableEnrollments
                  .filter(enrollment => enrollment.course.id === formData.courseId)
                  .map((enrollment) => (
                    <option key={enrollment.batch.id} value={enrollment.batch.id}>
                      {enrollment.batch.name} ({new Date(enrollment.batch.startDate).toLocaleDateString()})
                    </option>
                  ))}
              </select>
              {errors.batchId && <p className="text-red-500 text-sm mt-1">{errors.batchId}</p>}
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Total Amount *
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  className={`input w-full ${errors.totalAmount ? 'input-error' : ''}`}
                  disabled={loading}
                />
                {errors.totalAmount && <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="input w-full"
                  disabled={loading}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Online</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Cash</span>
                </label>
              </div>
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`input w-full ${errors.dueDate ? 'input-error' : ''}`}
                disabled={loading}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes (optional)"
                rows={3}
                maxLength={500}
                className={`input w-full ${errors.notes ? 'input-error' : ''}`}
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
                <p className="text-gray-500 text-sm ml-auto">{formData.notes.length}/500</p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Fee Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeeRequestModal;
