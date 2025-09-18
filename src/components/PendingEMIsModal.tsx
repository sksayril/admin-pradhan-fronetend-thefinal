import React, { useState, useEffect, useCallback } from 'react';
import { X, AlertTriangle, DollarSign, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { paymentService, PendingEMI, PaymentFilters } from '../services';
import { TableSkeleton } from './LoadingSkeleton';
import ErrorDisplay from './ErrorDisplay';

interface PendingEMIsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PendingEMIsModal: React.FC<PendingEMIsModalProps> = ({ isOpen, onClose }) => {
  const [emis, setEmis] = useState<PendingEMI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmis, setTotalEmis] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  
  // Filters
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 1,
    limit: 10,
  });

  const loadEMIs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await paymentService.getPendingEMIs(filters);
      if (response.success && response.data) {
        setEmis(response.data.pendingEMIs);
        setTotalPages(response.data.pagination.totalPages);
        setTotalEmis(response.data.pagination.totalPendingEMIs);
        setHasNextPage(response.data.pagination.hasNext);
        setHasPrevPage(response.data.pagination.hasPrev);
        setCurrentPage(response.data.pagination.currentPage);
        setSummary(response.data.summary);
      } else {
        throw new Error(response.message || 'Failed to load pending EMIs');
      }
    } catch (err) {
      console.error('Error loading pending EMIs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pending EMIs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (isOpen) {
      loadEMIs();
    }
  }, [isOpen, loadEMIs]);

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

  const getEMIStatusColor = useCallback((emi: PendingEMI) => {
    return paymentService.getEMIStatusColor(emi);
  }, []);

  const getEMIStatusText = useCallback((emi: PendingEMI) => {
    if (emi.isOverdue) return 'Overdue';
    if (emi.isInGracePeriod) return 'Grace Period';
    return 'Pending';
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pending EMIs</h2>
              <p className="text-sm text-gray-600">
                {totalEmis} EMIs pending payment
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

        {/* Summary Cards */}
        {summary && (
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Pending</p>
                    <p className="text-2xl font-bold text-gray-800">{summary.totalPendingEMIs}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {paymentService.formatCurrency(summary.totalPendingAmount)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue EMIs</p>
                    <p className="text-2xl font-bold text-red-600">{summary.overdueEMIs}</p>
                  </div>
                  <Clock className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Grace Period</p>
                    <p className="text-2xl font-bold text-orange-600">{summary.gracePeriodEMIs}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment ID</label>
              <input
                type="text"
                placeholder="Filter by investment ID"
                onChange={(e) => handleFilterChange('investmentId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by investment ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Show Overdue Only</label>
              <select
                onChange={(e) => handleFilterChange('overdue', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by overdue status"
              >
                <option value="">All EMIs</option>
                <option value="true">Overdue Only</option>
                <option value="false">Not Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <ErrorDisplay
            error={error}
            onRetry={loadEMIs}
            onDismiss={() => setError(null)}
            title="Failed to load EMIs"
          />

          {loading ? (
            <TableSkeleton rows={5} columns={7} />
          ) : emis.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No pending EMIs</p>
                <p className="text-gray-500 text-sm mt-1">All EMIs have been paid</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" role="table" aria-label="Pending EMIs table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalty</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emis.map((emi) => (
                    <tr key={emi.emiId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {emi.memberDetails.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {emi.memberDetails.name}
                            </div>
                            <div className="text-sm text-gray-500">{emi.memberDetails.memberId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{emi.investmentDetails.planName}</div>
                        <div className="text-sm text-gray-500">{emi.investmentDetails.planType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {emi.emiNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {paymentService.formatCurrency(emi.emiAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paymentService.formatDate(emi.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEMIStatusColor(emi)}`}>
                          {getEMIStatusText(emi)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {emi.penaltyAmount > 0 ? paymentService.formatCurrency(emi.penaltyAmount) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {emis.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {emis.length} of {totalEmis} EMIs
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
    </div>
  );
};

export default PendingEMIsModal;
