import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CreditCard, DollarSign, AlertTriangle, TrendingUp, Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { paymentService, PaymentStatistics, PaymentFilters } from '../../services';
import { TableSkeleton, CardSkeleton } from '../../components/LoadingSkeleton';
import ErrorDisplay from '../../components/ErrorDisplay';
import PendingCashPaymentsModal from '../../components/PendingCashPaymentsModal';
import PendingEMIsModal from '../../components/PendingEMIsModal';
import PaymentStatisticsModal from '../../components/PaymentStatisticsModal';
import MemberPaymentSummaryModal from '../../components/MemberPaymentSummaryModal';

const PaymentManagement: React.FC = React.memo(() => {
  const [statistics, setStatistics] = useState<PaymentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isPendingCashModalOpen, setIsPendingCashModalOpen] = useState(false);
  const [isPendingEMIsModalOpen, setIsPendingEMIsModalOpen] = useState(false);
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
  const [isMemberSummaryModalOpen, setIsMemberSummaryModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Load payment statistics
  const loadStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentService.getPaymentStatistics();
      if (response.success && response.data) {
        setStatistics(response.data);
      } else {
        throw new Error(response.message || 'Failed to load payment statistics');
      }
    } catch (err) {
      console.error('Error loading payment statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load payment statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  // Memoized statistics calculations
  const statsSummary = useMemo(() => {
    if (!statistics) return null;
    
    return {
      totalRevenue: statistics.paymentStatistics.totalAmount,
      pendingAmount: statistics.paymentStatistics.pendingAmount,
      overdueEMIs: statistics.emiStatistics.overdueEMIs,
      completionRate: Math.round((statistics.paymentStatistics.completedPayments / statistics.paymentStatistics.totalPayments) * 100),
    };
  }, [statistics]);

  const handleViewPendingCashPayments = useCallback(() => {
    setIsPendingCashModalOpen(true);
  }, []);

  const handleViewPendingEMIs = useCallback(() => {
    setIsPendingEMIsModalOpen(true);
  }, []);

  const handleViewStatistics = useCallback(() => {
    setIsStatisticsModalOpen(true);
  }, []);

  const handleViewMemberSummary = useCallback((memberId: string) => {
    setSelectedMemberId(memberId);
    setIsMemberSummaryModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setIsPendingCashModalOpen(false);
    setIsPendingEMIsModalOpen(false);
    setIsStatisticsModalOpen(false);
    setIsMemberSummaryModalOpen(false);
    setSelectedMemberId(null);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-8 h-8 text-sky-600" />
            <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
          </div>
        </div>
        <CardSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleViewStatistics}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            aria-label="View detailed statistics"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Statistics</span>
          </button>
          <button
            onClick={loadStatistics}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            aria-label="Refresh statistics"
          >
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      <ErrorDisplay
        error={error}
        onRetry={loadStatistics}
        onDismiss={() => setError(null)}
        title="Failed to load payment data"
      />

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  {paymentService.formatCurrency(statistics.paymentStatistics.totalAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-800">
                  {paymentService.formatCurrency(statistics.paymentStatistics.pendingAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue EMIs</p>
                <p className="text-2xl font-bold text-gray-800">
                  {statistics.emiStatistics.overdueEMIs}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-800">
                  {statsSummary?.completionRate || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={handleViewPendingCashPayments}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Pending Cash Payments</h3>
                <p className="text-sm text-gray-500">
                  {statistics?.insights.pendingCashPayments || 0} payments pending verification
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleViewPendingEMIs}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Pending EMIs</h3>
                <p className="text-sm text-gray-500">
                  {statistics?.emiStatistics.pendingEMIs || 0} EMIs pending payment
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleViewStatistics}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Payment Analytics</h3>
                <p className="text-sm text-gray-500">View detailed payment statistics</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Summary */}
      {statistics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Payments</span>
                <span className="font-medium">{statistics.paymentStatistics.totalPayments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Payments</span>
                <span className="font-medium text-green-600">{statistics.paymentStatistics.completedPayments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Payments</span>
                <span className="font-medium text-yellow-600">{statistics.paymentStatistics.pendingPayments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Failed Payments</span>
                <span className="font-medium text-red-600">{statistics.paymentStatistics.failedPayments}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">EMI Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total EMIs</span>
                <span className="font-medium">{statistics.emiStatistics.totalEMIs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Paid EMIs</span>
                <span className="font-medium text-green-600">{statistics.emiStatistics.paidEMIs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending EMIs</span>
                <span className="font-medium text-yellow-600">{statistics.emiStatistics.pendingEMIs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overdue EMIs</span>
                <span className="font-medium text-red-600">{statistics.emiStatistics.overdueEMIs}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PendingCashPaymentsModal
        isOpen={isPendingCashModalOpen}
        onClose={handleCloseModals}
      />

      <PendingEMIsModal
        isOpen={isPendingEMIsModalOpen}
        onClose={handleCloseModals}
      />

      <PaymentStatisticsModal
        isOpen={isStatisticsModalOpen}
        onClose={handleCloseModals}
        statistics={statistics}
      />

      {selectedMemberId && (
        <MemberPaymentSummaryModal
          isOpen={isMemberSummaryModalOpen}
          onClose={handleCloseModals}
          memberId={selectedMemberId}
        />
      )}
    </div>
  );
});

PaymentManagement.displayName = 'PaymentManagement';

export default PaymentManagement;
