import React, { useState } from 'react';
import { X, XCircle, AlertTriangle, User, DollarSign, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { InvestmentApplication } from '../services/types';
import { investmentService } from '../services';

interface InvestmentApplicationRejectionModalProps {
  application: InvestmentApplication;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InvestmentApplicationRejectionModal: React.FC<InvestmentApplicationRejectionModalProps> = ({
  application,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const rejectionReasons = [
    'Incomplete documentation',
    'Invalid KYC documents',
    'Investment amount exceeds plan limits',
    'Member not eligible for this plan',
    'Missing required information',
    'Document verification failed',
    'Terms and conditions not accepted',
    'Other (specify in notes)'
  ];

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please select a rejection reason', {
        duration: 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '14px',
        },
      });
      return;
    }

    setLoading(true);
    try {
      await investmentService.rejectInvestmentApplication(application.applicationId, {
        rejectionReason: rejectionReason.trim(),
        notes: notes.trim() || undefined
      });
      
      toast.success('✅ Investment application rejected successfully!', {
        duration: 4000,
        style: {
          background: '#F59E0B',
          color: '#fff',
          fontSize: '14px',
        },
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('❌ Failed to reject application. Please try again.', {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-rose-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Reject Investment Application</h2>
              <p className="text-sm text-gray-600">Application ID: {application.applicationId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Application Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Application Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Member:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {application.member.firstName} {application.member.lastName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Member ID:</span>
                  <span className="text-sm font-medium text-gray-900">{application.member.memberId}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Plan:</span>
                  <span className="text-sm font-medium text-gray-900">{application.plan.planName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(application.investmentAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Important Notice</h4>
                <p className="text-sm text-red-700 mt-1">
                  Rejecting this application will:
                </p>
                <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                  <li>Mark the application as rejected</li>
                  <li>Notify the member about the rejection</li>
                  <li>Prevent the investment from being processed</li>
                  <li>Record the rejection reason for future reference</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rejection Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a reason for rejection</option>
              {rejectionReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide additional details about the rejection, steps for resubmission, or any other relevant information..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              These notes will be shared with the member to help them understand the rejection and take corrective action.
            </p>
          </div>

          {/* Rejection Impact */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-orange-800 mb-2">Impact of Rejection</h4>
            <div className="text-sm text-orange-700 space-y-1">
              <p>• The member will be notified via email about the rejection</p>
              <p>• The application will be marked as rejected in the system</p>
              <p>• The member can resubmit the application after addressing the issues</p>
              <p>• All rejection details will be recorded for audit purposes</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReject}
              disabled={loading || !rejectionReason.trim()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Rejecting...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Reject Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentApplicationRejectionModal;
