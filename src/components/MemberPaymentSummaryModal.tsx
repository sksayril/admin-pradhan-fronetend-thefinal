import React, { useState, useEffect, useCallback } from 'react';
import { X, User, DollarSign, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { paymentService, MemberPaymentSummary } from '../services';
import { TableSkeleton } from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';

interface MemberPaymentSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
}

const MemberPaymentSummaryModal: React.FC<MemberPaymentSummaryModalProps> = ({ 
  isOpen, 
  onClose, 
  memberId 
}) => {
  const [summary, setSummary] = useState<MemberPaymentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    if (!memberId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentService.getMemberPaymentSummary(memberId);
      if (response.success && response.data) {
        setSummary(response.data);
      } else {
        throw new Error(response.message || 'Failed to load member payment summary');
      }
    } catch (err) {
      console.error('Error loading member payment summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load member payment summary');
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    if (isOpen && memberId) {
      loadSummary();
    }
  }, [isOpen, memberId, loadSummary]);

  if (!isOpen) return null;

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
              <h2 className="text-xl font-semibold text-gray-900">Member Payment Summary</h2>
              <p className="text-sm text-gray-600">
                {summary?.memberDetails.name || 'Loading...'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <ErrorDisplay
            error={error}
            onRetry={loadSummary}
            onDismiss={() => setError(null)}
            title="Failed to load member summary"
          />

          {loading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : summary ? (
            <div className="space-y-6">
              {/* Member Details */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  Member Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-lg font-semibold text-gray-900">{summary.memberDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Member ID</p>
                    <p className="text-lg font-semibold text-gray-900">{summary.memberDetails.memberId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg text-gray-900">{summary.memberDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-lg text-gray-900">{summary.memberDetails.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  Payment Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Total Payments</p>
                    <p className="text-2xl font-bold text-gray-800">{summary.paymentSummary.totalPayments}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Cash Payments</p>
                    <p className="text-2xl font-bold text-green-600">{summary.paymentSummary.cashPayments}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Online Payments</p>
                    <p className="text-2xl font-bold text-blue-600">{summary.paymentSummary.onlinePayments}</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                    <p className="text-2xl font-bold text-yellow-600">{summary.paymentSummary.pendingPayments}</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-gray-600">Total Paid Amount</p>
                  <p className="text-3xl font-bold text-green-600">
                    {paymentService.formatCurrency(summary.paymentSummary.totalPaidAmount)}
                  </p>
                </div>
              </div>

              {/* Investment Summary */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                  Investment Summary
                </h3>
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600">Total Investments</p>
                  <p className="text-2xl font-bold text-gray-800">{summary.investmentSummary.totalInvestments}</p>
                </div>
                
                <div className="space-y-4">
                  {summary.investmentSummary.investments.map((investment) => (
                    <div key={investment.investmentId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{investment.planName}</h4>
                          <p className="text-sm text-gray-600">{investment.planType}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          investment.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {investment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Principal Amount</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {paymentService.formatCurrency(investment.principalAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Expected Maturity</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {paymentService.formatCurrency(investment.expectedMaturityAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Paid</p>
                          <p className="text-lg font-semibold text-green-600">
                            {paymentService.formatCurrency(investment.paymentSummary.totalPaid)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Completion</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {investment.paymentSummary.completionPercentage}%
                          </p>
                        </div>
                      </div>

                      {/* EMI Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-600">EMI Progress</p>
                          <p className="text-sm text-gray-600">
                            {investment.emiProgress.paid} of {investment.emiProgress.total} EMIs paid
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(investment.emiProgress.paid / investment.emiProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Paid: {investment.emiProgress.paid}</span>
                          <span>Pending: {investment.emiProgress.pending}</span>
                          <span>Overdue: {investment.emiProgress.overdue}</span>
                        </div>
                      </div>

                      {/* Next Due Date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">Next Due Date:</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {paymentService.formatDate(investment.nextDueDate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No data available</p>
                <p className="text-gray-500 text-sm mt-1">Unable to load member payment summary</p>
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

export default MemberPaymentSummaryModal;
