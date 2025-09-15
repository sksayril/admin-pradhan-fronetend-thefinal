import React, { useState, useEffect } from 'react';
import { X, DollarSign, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { RecordPaymentRequest, FeeRequest } from '../services/types';
import './RecordPaymentModal.css';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: RecordPaymentRequest) => Promise<void>;
  feeRequest: FeeRequest | null;
  loading?: boolean;
}

interface FormData {
  amount: string;
  paymentMethod: 'online' | 'cash' | 'bank_transfer' | 'cheque';
  transactionId: string;
  paymentReference: string;
  notes: string;
}

interface FormErrors {
  amount?: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentReference?: string;
  notes?: string;
}

const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  feeRequest,
  loading = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    paymentReference: '',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset form when modal opens/closes or fee request changes
  useEffect(() => {
    if (isOpen && feeRequest) {
      setFormData({
        amount: feeRequest.remainingAmount.toString(),
        paymentMethod: 'cash',
        transactionId: '',
        paymentReference: '',
        notes: ''
      });
      setErrors({});
      setApiError(null);
    }
  }, [isOpen, feeRequest]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    if (!feeRequest) return false;
    
    const newErrors: FormErrors = {};
    const amount = parseFloat(formData.amount);

    if (!formData.amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    } else if (amount > feeRequest.remainingAmount) {
      newErrors.amount = `Amount cannot exceed remaining amount (${feeRequest.remainingAmount})`;
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (formData.paymentMethod === 'online' && !formData.transactionId) {
      newErrors.transactionId = 'Transaction ID is required for online payments';
    }

    if (formData.paymentMethod === 'bank_transfer' && !formData.paymentReference) {
      newErrors.paymentReference = 'Payment reference is required for bank transfers';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feeRequest || !validateForm()) {
      return;
    }

    setApiError(null);

    try {
      const paymentData: RecordPaymentRequest = {
        feeRequestId: feeRequest._id,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId || undefined,
        paymentReference: formData.paymentReference || undefined,
        notes: formData.notes || undefined
      };

      await onSubmit(paymentData);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      paymentMethod: 'cash',
      transactionId: '',
      paymentReference: '',
      notes: ''
    });
    setErrors({});
    setApiError(null);
    onClose();
  };

  if (!isOpen || !feeRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Record Payment</h2>
              <p className="text-sm text-gray-600">
                {typeof feeRequest.studentId === 'object' 
                  ? `${feeRequest.studentId.firstName} ${feeRequest.studentId.lastName}`
                  : 'Student'
                } - {typeof feeRequest.courseId === 'object' ? feeRequest.courseId.title : 'Course'}
              </p>
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

          {/* Fee Request Summary */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fee Request Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Total Amount:</span>
                <p className="text-gray-900">₹{feeRequest.totalAmount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Paid Amount:</span>
                <p className="text-gray-900">₹{feeRequest.paidAmount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Remaining Amount:</span>
                <p className="text-gray-900 font-semibold">₹{feeRequest.remainingAmount}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Payment Amount *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter payment amount"
                min="0"
                max={feeRequest.remainingAmount}
                step="0.01"
                className={`input w-full ${errors.amount ? 'input-error' : ''}`}
                disabled={loading}
              />
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              <p className="text-gray-500 text-sm mt-1">
                Maximum: ₹{feeRequest.remainingAmount}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Cash</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Online</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Bank Transfer</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cheque"
                    checked={formData.paymentMethod === 'cheque'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                    disabled={loading}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Cheque</span>
                </label>
              </div>
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>

            {/* Transaction ID (for online payments) */}
            {formData.paymentMethod === 'online' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID *</label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  placeholder="Enter transaction ID"
                  className={`input w-full ${errors.transactionId ? 'input-error' : ''}`}
                  disabled={loading}
                />
                {errors.transactionId && <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>}
              </div>
            )}

            {/* Payment Reference (for bank transfers) */}
            {formData.paymentMethod === 'bank_transfer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Reference *</label>
                <input
                  type="text"
                  name="paymentReference"
                  value={formData.paymentReference}
                  onChange={handleInputChange}
                  placeholder="Enter payment reference"
                  className={`input w-full ${errors.paymentReference ? 'input-error' : ''}`}
                  disabled={loading}
                />
                {errors.paymentReference && <p className="text-red-500 text-sm mt-1">{errors.paymentReference}</p>}
              </div>
            )}

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
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordPaymentModal;
