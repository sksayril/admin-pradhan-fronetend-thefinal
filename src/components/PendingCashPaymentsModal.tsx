import React, { useState, useEffect, useCallback } from 'react';
import { X, DollarSign, User, Calendar, CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';
import { paymentService, PendingCashPayment, PendingCashPaymentsResponse, PaymentFilters, CashPaymentVerificationRequest } from '../services';
import { TableSkeleton } from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';
import toast from 'react-hot-toast';

interface PendingCashPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PendingCashPaymentsModal: React.FC<PendingCashPaymentsModalProps> = ({ isOpen, onClose }) => {
  const [payments, setPayments] = useState<PendingCashPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 1,
    limit: 10,
  });

  // Verification modal state
  const [selectedPayment, setSelectedPayment] = useState<PendingCashPayment | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationData, setVerificationData] = useState<CashPaymentVerificationRequest>({
    verificationStatus: 'verified',
    remarks: '',
    receivedAmount: 0,
  });

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentService.getPendingCashPayments(filters);
      if (response.success && response.data) {
        setPayments(response.data.pendingPayments);
        setTotalPages(response.data.pagination.totalPages);
        setTotalPayments(response.data.pagination.totalPendingPayments);
        setHasNextPage(response.data.pagination.hasNext);
        setHasPrevPage(response.data.pagination.hasPrev);
        setCurrentPage(response.data.pagination.currentPage);
      } else {
        throw new Error(response.message || 'Failed to load pending cash payments');
      }
    } catch (err) {
      console.error('Error loading pending cash payments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pending cash payments');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (isOpen) {
      loadPayments();
    }
  }, [isOpen, loadPayments]);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleVerifyPayment = useCallback((payment: PendingCashPayment) => {
    setSelectedPayment(payment);
    setVerificationData({
      verificationStatus: 'verified',
      remarks: '',
      receivedAmount: payment.amount,
    });
    setIsVerificationModalOpen(true);
  }, []);

  const handleSubmitVerification = useCallback(async () => {
    if (!selectedPayment) return;

    try {
      const response = await paymentService.verifyCashPayment(selectedPayment.paymentId, verificationData);
      if (response.success) {
        toast.success('Payment verified successfully');
        setIsVerificationModalOpen(false);
        setSelectedPayment(null);
        loadPayments(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to verify payment');
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to verify payment');
    }
  }, [selectedPayment, verificationData, loadPayments]);

  const handleRejectPayment = useCallback((payment: PendingCashPayment) => {
    setSelectedPayment(payment);
    setVerificationData({
      verificationStatus: 'rejected',
      remarks: '',
      receivedAmount: 0,
    });
    setIsVerificationModalOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pending Cash Payments</h2>
              <p className="text-sm text-gray-600">
                {totalPayments} payments pending verification
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
            onRetry={loadPayments}
            onDismiss={() => setError(null)}
            title="Failed to load payments"
          />

          {loading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : payments.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No pending cash payments</p>
                <p className="text-gray-500 text-sm mt-1">All cash payments have been verified</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="Pending cash payments table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.paymentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {payment.memberDetails.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.memberDetails.name}
                            </div>
                            <div className="text-sm text-gray-500">{payment.memberDetails.memberId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.investmentDetails.planName}</div>
                        <div className="text-sm text-gray-500">{payment.investmentDetails.planType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {paymentService.formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.emiNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paymentService.formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {payment.remarks || 'No remarks'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleVerifyPayment(payment)}
                            className="text-green-600 hover:text-green-900"
                            aria-label={`Verify payment for ${payment.memberDetails.name}`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectPayment(payment)}
                            className="text-red-600 hover:text-red-900"
                            aria-label={`Reject payment for ${payment.memberDetails.name}`}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {payments.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {payments.length} of {totalPayments} payments
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

      {/* Verification Modal */}
      {isVerificationModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {verificationData.verificationStatus === 'verified' ? 'Verify Payment' : 'Reject Payment'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member: {selectedPayment.memberDetails.name}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount: {paymentService.formatCurrency(selectedPayment.amount)}
                </label>
              </div>

              {verificationData.verificationStatus === 'verified' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Received Amount
                  </label>
                  <input
                    type="number"
                    value={verificationData.receivedAmount}
                    onChange={(e) => setVerificationData(prev => ({ 
                      ...prev, 
                      receivedAmount: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Received amount"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={verificationData.remarks}
                  onChange={(e) => setVerificationData(prev => ({ ...prev, remarks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter verification remarks..."
                  aria-label="Verification remarks"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitVerification}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  verificationData.verificationStatus === 'verified'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {verificationData.verificationStatus === 'verified' ? 'Verify' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingCashPaymentsModal;
