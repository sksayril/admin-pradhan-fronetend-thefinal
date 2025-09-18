import React, { useState, useEffect, useCallback } from 'react';
import { X, Banknote, User, Calendar, CheckCircle, XCircle, Clock, Eye, DollarSign } from 'lucide-react';
import { loanService, LoanRequest, LoanRequestsResponse, LoanFilters, LoanApprovalRequest, LoanRejectionRequest, LoanDisbursementRequest } from '../services';
import { TableSkeleton } from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';
import toast from 'react-hot-toast';

interface LoanRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoanRequestsModal: React.FC<LoanRequestsModalProps> = ({ isOpen, onClose }) => {
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLoans, setTotalLoans] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState<LoanFilters>({
    page: 1,
    limit: 10,
  });

  // Action modal states
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'disburse' | null>(null);
  const [actionData, setActionData] = useState<{
    approvalNotes?: string;
    rejectionReason?: string;
    disbursedAmount?: number;
    disbursementMethod?: string;
    disbursementReference?: string;
  }>({});

  const loadLoans = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.getLoanRequests(filters);
      if (response.success && response.data) {
        setLoans(response.data.loanRequests);
        setTotalPages(response.data.pagination.totalPages);
        setTotalLoans(response.data.pagination.totalRequests);
        setHasNextPage(response.data.pagination.totalPages > currentPage);
        setHasPrevPage(currentPage > 1);
        setCurrentPage(response.data.pagination.currentPage);
      } else {
        throw new Error(response.message || 'Failed to load loan requests');
      }
    } catch (err) {
      console.error('Error loading loan requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to load loan requests');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    if (isOpen) {
      loadLoans();
    }
  }, [isOpen, loadLoans]);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value === '' ? undefined : value,
      page: 1 
    }));
  }, []);

  const handleApproveLoan = useCallback((loan: LoanRequest) => {
    setSelectedLoan(loan);
    setActionType('approve');
    setActionData({ approvalNotes: '' });
  }, []);

  const handleRejectLoan = useCallback((loan: LoanRequest) => {
    setSelectedLoan(loan);
    setActionType('reject');
    setActionData({ rejectionReason: '' });
  }, []);

  const handleDisburseLoan = useCallback((loan: LoanRequest) => {
    setSelectedLoan(loan);
    setActionType('disburse');
    setActionData({ 
      disbursedAmount: loan.loanAmount,
      disbursementMethod: 'bank_transfer',
      disbursementReference: ''
    });
  }, []);

  const handleSubmitAction = useCallback(async () => {
    if (!selectedLoan || !actionType) return;

    try {
      let response;
      switch (actionType) {
        case 'approve':
          response = await loanService.approveLoanRequest(selectedLoan.requestId, {
            approvalNotes: actionData.approvalNotes || ''
          });
          break;
        case 'reject':
          response = await loanService.rejectLoanRequest(selectedLoan.requestId, {
            rejectionReason: actionData.rejectionReason || ''
          });
          break;
        case 'disburse':
          response = await loanService.disburseLoan(selectedLoan.requestId, {
            disbursedAmount: actionData.disbursedAmount || 0,
            disbursementMethod: actionData.disbursementMethod || 'bank_transfer',
            disbursementReference: actionData.disbursementReference || ''
          });
          break;
      }

      if (response?.success) {
        toast.success(`Loan ${actionType} successful`);
        setActionType(null);
        setSelectedLoan(null);
        setActionData({});
        loadLoans(); // Refresh the list
      } else {
        throw new Error(response?.message || `Failed to ${actionType} loan`);
      }
    } catch (err) {
      console.error(`Error ${actionType}ing loan:`, err);
      toast.error(err instanceof Error ? err.message : `Failed to ${actionType} loan`);
    }
  }, [selectedLoan, actionType, actionData, loadLoans]);

  const getActionButtons = useCallback((loan: LoanRequest) => {
    switch (loan.status) {
      case 'pending':
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleApproveLoan(loan)}
              className="text-green-600 hover:text-green-900"
              aria-label={`Approve loan for ${loan.memberId.firstName} ${loan.memberId.lastName}`}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRejectLoan(loan)}
              className="text-red-600 hover:text-red-900"
              aria-label={`Reject loan for ${loan.memberId.firstName} ${loan.memberId.lastName}`}
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        );
      case 'approved':
        return (
          <button
            onClick={() => handleDisburseLoan(loan)}
            className="text-blue-600 hover:text-blue-900"
            aria-label={`Disburse loan for ${loan.memberId.firstName} ${loan.memberId.lastName}`}
          >
            <DollarSign className="w-4 h-4" />
          </button>
        );
      default:
        return (
          <span className="text-gray-400">
            <Eye className="w-4 h-4" />
          </span>
        );
    }
  }, [handleApproveLoan, handleRejectLoan, handleDisburseLoan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Banknote className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Loan Requests</h2>
              <p className="text-sm text-gray-600">
                {totalLoans} loan requests
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

        {/* Filters */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
              <input
                type="text"
                placeholder="Filter by member ID"
                onChange={(e) => handleFilterChange('memberId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by member ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter from date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter to date"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <ErrorDisplay
            error={error}
            onRetry={loadLoans}
            onDismiss={() => setError(null)}
            title="Failed to load loan requests"
          />

          {loading ? (
            <TableSkeleton rows={5} columns={7} />
          ) : loans.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No loan requests found</p>
                <p className="text-gray-500 text-sm mt-1">All loan requests have been processed</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="Loan requests table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loans.map((loan) => (
                    <tr key={loan.requestId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {loan.memberId.firstName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {loan.memberId.firstName} {loan.memberId.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{loan.memberId.memberId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {loanService.formatCurrency(loan.loanAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${loanService.getLoanPurposeColor(loan.loanPurpose)}`}>
                          {loan.loanPurpose}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${loanService.getLoanStatusColor(loan.status)}`}>
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loanService.formatDate(loan.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {getActionButtons(loan)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {loans.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {loans.length} of {totalLoans} loan requests
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="Go to previous page"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm" aria-live="polite">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="Go to next page"
                >
                  Next
                </button>
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

      {/* Action Modal */}
      {actionType && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'approve' && 'Approve Loan'}
              {actionType === 'reject' && 'Reject Loan'}
              {actionType === 'disburse' && 'Disburse Loan'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member: {selectedLoan.memberId.firstName} {selectedLoan.memberId.lastName}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount: {loanService.formatCurrency(selectedLoan.loanAmount)}
                </label>
              </div>

              {actionType === 'approve' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approval Notes
                  </label>
                  <textarea
                    value={actionData.approvalNotes || ''}
                    onChange={(e) => setActionData(prev => ({ ...prev, approvalNotes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter approval notes..."
                    aria-label="Approval notes"
                  />
                </div>
              )}

              {actionType === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    value={actionData.rejectionReason || ''}
                    onChange={(e) => setActionData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter rejection reason..."
                    aria-label="Rejection reason"
                  />
                </div>
              )}

              {actionType === 'disburse' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disbursed Amount
                    </label>
                    <input
                      type="number"
                      value={actionData.disbursedAmount || 0}
                      onChange={(e) => setActionData(prev => ({ 
                        ...prev, 
                        disbursedAmount: parseFloat(e.target.value) || 0 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Disbursed amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Disbursement Method
                    </label>
                    <select
                      value={actionData.disbursementMethod || 'bank_transfer'}
                      onChange={(e) => setActionData(prev => ({ ...prev, disbursementMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="Disbursement method"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      value={actionData.disbursementReference || ''}
                      onChange={(e) => setActionData(prev => ({ ...prev, disbursementReference: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter reference number..."
                      aria-label="Reference number"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {actionType === 'approve' && 'Approve'}
                {actionType === 'reject' && 'Reject'}
                {actionType === 'disburse' && 'Disburse'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanRequestsModal;
