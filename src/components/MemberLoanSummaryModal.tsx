import React, { useState, useEffect, useCallback } from 'react';
import { X, User, DollarSign, TrendingUp, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { loanService, MemberLoanSummary } from '../services';
import { TableSkeleton } from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';

interface MemberLoanSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
}

const MemberLoanSummaryModal: React.FC<MemberLoanSummaryModalProps> = ({ 
  isOpen, 
  onClose, 
  memberId 
}) => {
  const [summary, setSummary] = useState<MemberLoanSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    if (!memberId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.getMemberLoanSummary(memberId);
      if (response.success && response.data) {
        setSummary(response.data);
      } else {
        throw new Error(response.message || 'Failed to load member loan summary');
      }
    } catch (err) {
      console.error('Error loading member loan summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load member loan summary');
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
              <h2 className="text-xl font-semibold text-gray-900">Member Loan Summary</h2>
              <p className="text-sm text-gray-600">
                {summary?.member.name || 'Loading...'}
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
                    <p className="text-lg font-semibold text-gray-900">{summary.member.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Member ID</p>
                    <p className="text-lg font-semibold text-gray-900">{summary.member.memberId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg text-gray-900">{summary.member.email}</p>
                  </div>
                </div>
              </div>

              {/* Loan Summary */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  Loan Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Total Loans</p>
                    <p className="text-2xl font-bold text-gray-800">{summary.totalLoans}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Total Loan Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {loanService.formatCurrency(summary.totalLoanAmount)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Disbursed Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      {loanService.formatCurrency(summary.totalDisbursedAmount)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {loanService.formatCurrency(summary.totalLoanAmount - summary.totalDisbursedAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                  Status Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">{summary.statusBreakdown.pending}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-xl font-bold text-green-600">{summary.statusBreakdown.approved}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Disbursed</p>
                    <p className="text-xl font-bold text-blue-600">{summary.statusBreakdown.disbursed}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-xl font-bold text-gray-600">{summary.statusBreakdown.completed}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                    <p className="text-xl font-bold text-red-600">{summary.statusBreakdown.rejected}</p>
                  </div>
                </div>
              </div>

              {/* Loan Requests */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                  Loan Requests
                </h3>
                
                <div className="space-y-4">
                  {summary.loanRequests.map((loan) => (
                    <div key={loan.requestId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Request #{loan.requestId}</h4>
                          <p className="text-sm text-gray-600">Loan Amount: {loanService.formatCurrency(loan.loanAmount)}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${loanService.getLoanStatusColor(loan.status)}`}>
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Disbursed Amount</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {loanService.formatCurrency(loan.disbursedAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total EMIs</p>
                          <p className="text-lg font-semibold text-gray-900">{loan.emiCount}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Paid EMIs</p>
                          <p className="text-lg font-semibold text-green-600">{loan.paidEMIs}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pending EMIs</p>
                          <p className="text-lg font-semibold text-yellow-600">{loan.pendingEMIs}</p>
                        </div>
                      </div>

                      {/* EMI Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-600">EMI Progress</p>
                          <p className="text-sm text-gray-600">
                            {loan.paidEMIs} of {loan.emiCount} EMIs paid
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${loanService.calculateEMIProgress(loan.paidEMIs, loan.emiCount)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Paid: {loan.paidEMIs}</span>
                          <span>Pending: {loan.pendingEMIs}</span>
                          <span>Progress: {loanService.calculateEMIProgress(loan.paidEMIs, loan.emiCount)}%</span>
                        </div>
                      </div>

                      {/* Status Indicators */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-gray-600">Paid EMIs: {loan.paidEMIs}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-600">Pending EMIs: {loan.pendingEMIs}</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                          <span className="text-sm text-gray-600">
                            Completion: {loanService.calculateEMIProgress(loan.paidEMIs, loan.emiCount)}%
                          </span>
                        </div>
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
                <p className="text-gray-500 text-sm mt-1">Unable to load member loan summary</p>
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

export default MemberLoanSummaryModal;
