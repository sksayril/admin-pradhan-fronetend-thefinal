import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Banknote, DollarSign, AlertTriangle, TrendingUp, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { loanService, LoanStatistics, LoanFilters } from '../../services';
import { TableSkeleton, CardSkeleton } from '../../components/LoadingSkeleton';
import ErrorDisplay from '../../components/ErrorDisplay';
import LoanRequestsModal from '../../components/LoanRequestsModal';
import LoanStatisticsModal from '../../components/LoanStatisticsModal';
import MemberLoanSummaryModal from '../../components/MemberLoanSummaryModal';

const LoanManagement: React.FC = React.memo(() => {
  const [statistics, setStatistics] = useState<LoanStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isLoanRequestsModalOpen, setIsLoanRequestsModalOpen] = useState(false);
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
  const [isMemberSummaryModalOpen, setIsMemberSummaryModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Load loan statistics
  const loadStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loanService.getLoanStatistics();
      if (response.success && response.data) {
        setStatistics(response.data);
      } else {
        throw new Error(response.message || 'Failed to load loan statistics');
      }
    } catch (err) {
      console.error('Error loading loan statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load loan statistics');
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
      totalLoanAmount: statistics.totalLoanAmount,
      pendingAmount: statistics.statusBreakdown.find(s => s.status === 'pending')?.totalAmount || 0,
      approvedAmount: statistics.statusBreakdown.find(s => s.status === 'approved')?.totalAmount || 0,
      disbursedAmount: statistics.statusBreakdown.find(s => s.status === 'disbursed')?.totalAmount || 0,
    };
  }, [statistics]);

  const handleViewLoanRequests = useCallback(() => {
    setIsLoanRequestsModalOpen(true);
  }, []);

  const handleViewStatistics = useCallback(() => {
    setIsStatisticsModalOpen(true);
  }, []);

  const handleViewMemberSummary = useCallback((memberId: string) => {
    setSelectedMemberId(memberId);
    setIsMemberSummaryModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setIsLoanRequestsModalOpen(false);
    setIsStatisticsModalOpen(false);
    setIsMemberSummaryModalOpen(false);
    setSelectedMemberId(null);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Banknote className="w-8 h-8 text-sky-600" />
            <h1 className="text-3xl font-bold text-gray-800">Loan Management</h1>
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
          <Banknote className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Loan Management</h1>
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
        title="Failed to load loan data"
      />

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Loan Amount</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loanService.formatCurrency(statistics.totalLoanAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loanService.formatCurrency(statsSummary?.pendingAmount || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Amount</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loanService.formatCurrency(statsSummary?.approvedAmount || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disbursed Amount</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loanService.formatCurrency(statsSummary?.disbursedAmount || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Banknote className="w-6 h-6 text-purple-600" />
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
            onClick={handleViewLoanRequests}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Loan Requests</h3>
                <p className="text-sm text-gray-500">
                  {statistics?.additionalStats.totalPendingRequests || 0} requests pending review
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
                <h3 className="font-medium text-gray-900">Loan Analytics</h3>
                <p className="text-sm text-gray-500">View detailed loan statistics</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleViewLoanRequests}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Approved Loans</h3>
                <p className="text-sm text-gray-500">
                  {statistics?.additionalStats.totalApprovedRequests || 0} loans approved
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Summary */}
      {statistics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Status Overview</h3>
            <div className="space-y-3">
              {statistics.statusBreakdown.map((status) => (
                <div key={status.status} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${loanService.getLoanStatusColor(status.status)}`}>
                      {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-600">({status.count})</span>
                  </div>
                  <span className="font-medium">{loanService.formatCurrency(status.totalAmount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Requests</span>
                <span className="font-medium">{statistics.totalRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Requests</span>
                <span className="font-medium text-yellow-600">{statistics.additionalStats.totalPendingRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved Requests</span>
                <span className="font-medium text-green-600">{statistics.additionalStats.totalApprovedRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Disbursed Loans</span>
                <span className="font-medium text-blue-600">{statistics.additionalStats.totalDisbursedLoans}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LoanRequestsModal
        isOpen={isLoanRequestsModalOpen}
        onClose={handleCloseModals}
      />

      <LoanStatisticsModal
        isOpen={isStatisticsModalOpen}
        onClose={handleCloseModals}
        statistics={statistics}
      />

      {selectedMemberId && (
        <MemberLoanSummaryModal
          isOpen={isMemberSummaryModalOpen}
          onClose={handleCloseModals}
          memberId={selectedMemberId}
        />
      )}
    </div>
  );
});

LoanManagement.displayName = 'LoanManagement';

export default LoanManagement;
