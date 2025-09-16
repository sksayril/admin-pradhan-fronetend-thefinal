import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, User, DollarSign, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { InvestmentApplication } from '../services/types';
import { investmentService } from '../services';

interface InvestmentApplicationApprovalModalProps {
  application: InvestmentApplication;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InvestmentApplicationApprovalModal: React.FC<InvestmentApplicationApprovalModalProps> = ({
  application,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!notes.trim()) {
      toast.error('Please provide approval notes', {
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
      await investmentService.approveInvestmentApplication(application.applicationId, {
        notes: notes.trim()
      });
      
      toast.success('✅ Investment application approved successfully!', {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '14px',
        },
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('❌ Failed to approve application. Please try again.', {
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Approve Investment Application</h2>
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  By approving this application, you are confirming that:
                </p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
                  <li>All required documents have been verified</li>
                  <li>The member's KYC is complete and valid</li>
                  <li>The investment amount is within the plan limits</li>
                  <li>All terms and conditions have been accepted</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Approval Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Please provide details about the approval decision, any special conditions, or additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={4}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              These notes will be recorded with the approval and may be visible to the member.
            </p>
          </div>

          {/* Investment Details Preview */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">Investment Details After Approval</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-700">Investment ID:</span>
                <span className="text-green-900 font-medium ml-2">Will be generated</span>
              </div>
              <div>
                <span className="text-green-700">Status:</span>
                <span className="text-green-900 font-medium ml-2">Active</span>
              </div>
              <div>
                <span className="text-green-700">Principal Amount:</span>
                <span className="text-green-900 font-medium ml-2">{formatCurrency(application.investmentAmount)}</span>
              </div>
              <div>
                <span className="text-green-700">Expected Maturity:</span>
                <span className="text-green-900 font-medium ml-2">
                  {formatCurrency(application.investmentAmount * (1 + application.plan.interestRate / 100))}
                </span>
              </div>
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
              onClick={handleApprove}
              disabled={loading || !notes.trim()}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Approving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentApplicationApprovalModal;
