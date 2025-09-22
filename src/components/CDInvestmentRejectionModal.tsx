import React, { useState } from 'react';
import { X, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CDInvestment, RejectCDRequestRequest } from '../services/types';
import { CDInvestmentService } from '../services/cdInvestmentService';

interface CDInvestmentRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  investment: CDInvestment | null;
}

const CDInvestmentRejectionModal: React.FC<CDInvestmentRejectionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  investment,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investment || !rejectionReason.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const request: RejectCDRequestRequest = {
        rejectionReason: rejectionReason.trim(),
        adminNotes: adminNotes.trim() || undefined,
      };

      await CDInvestmentService.rejectRequest(investment.cdId, request);
      onSuccess();
      onClose();
      setRejectionReason('');
      setAdminNotes('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject CD investment request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setRejectionReason('');
      setAdminNotes('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen || !investment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reject CD Investment</h2>
              <p className="text-sm text-gray-500">Review and reject this CD investment request</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Investment Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">CD ID</label>
                <p className="text-sm text-gray-900 font-mono">{investment.cdId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">User Type</label>
                <p className="text-sm text-gray-900">{investment.userType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Investor Name</label>
                <p className="text-sm text-gray-900">
                  {investment.userId.firstName} {investment.userId.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{investment.userEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Investment Amount</label>
                <p className="text-sm text-gray-900 font-semibold">
                  ₹{investment.investmentAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tenure</label>
                <p className="text-sm text-gray-900">{investment.tenureMonths} months</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Interest Rate</label>
                <p className="text-sm text-gray-900">{investment.interestRate}%</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Maturity Amount</label>
                <p className="text-sm text-gray-900 font-semibold text-green-600">
                  ₹{investment.maturityAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Interest</label>
                <p className="text-sm text-gray-900 font-semibold text-blue-600">
                  ₹{investment.totalInterest.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Request Date</label>
                <p className="text-sm text-gray-900">
                  {new Date(investment.requestDate).toLocaleDateString()}
                </p>
              </div>
              {investment.purpose && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Purpose</label>
                  <p className="text-sm text-gray-900">{investment.purpose}</p>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <select
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
                disabled={isLoading}
              >
                <option value="">Select a reason for rejection</option>
                <option value="Insufficient documentation provided">Insufficient documentation provided</option>
                <option value="KYC verification failed">KYC verification failed</option>
                <option value="Investment amount below minimum threshold">Investment amount below minimum threshold</option>
                <option value="Investment amount above maximum threshold">Investment amount above maximum threshold</option>
                <option value="Invalid tenure period">Invalid tenure period</option>
                <option value="Duplicate application">Duplicate application</option>
                <option value="Policy violation">Policy violation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                placeholder="Add any additional notes or instructions for the applicant..."
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !rejectionReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Reject Investment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CDInvestmentRejectionModal;
