import React from 'react';
import { X, TrendingUp, DollarSign, CheckCircle, AlertTriangle, XCircle, BarChart3, Clock } from 'lucide-react';
import { loanService, LoanStatistics } from '../services';

interface LoanStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: LoanStatistics | null;
}

const LoanStatisticsModal: React.FC<LoanStatisticsModalProps> = ({ isOpen, onClose, statistics }) => {
  if (!isOpen || !statistics) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Loan Statistics</h2>
              <p className="text-sm text-gray-600">Comprehensive loan analytics and insights</p>
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
          <div className="space-y-8">
            {/* Overview Statistics */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                Overview Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Requests</p>
                      <p className="text-2xl font-bold text-gray-800">{statistics.totalRequests}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Loan Amount</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {loanService.formatCurrency(statistics.totalLoanAmount)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                      <p className="text-2xl font-bold text-yellow-600">{statistics.additionalStats.totalPendingRequests}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approved Requests</p>
                      <p className="text-2xl font-bold text-green-600">{statistics.additionalStats.totalApprovedRequests}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                Status Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statistics.statusBreakdown.map((status) => (
                  <div key={status.status} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${loanService.getLoanStatusColor(status.status)}`}>
                        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                      </span>
                      <span className="text-sm font-medium text-gray-600">{status.count} requests</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium">{loanService.formatCurrency(status.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Average Amount:</span>
                        <span className="font-medium">{loanService.formatCurrency(status.averageAmount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Request Status Summary</h4>
                <div className="space-y-3">
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Requests</span>
                    <span className="font-medium">{statistics.totalRequests}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-md font-semibold text-gray-800 mb-4">Amount Summary</h4>
                <div className="space-y-3">
                  {statistics.statusBreakdown.map((status) => (
                    <div key={status.status} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{status.status} Amount</span>
                      <span className="font-medium">{loanService.formatCurrency(status.totalAmount)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-800">Total Loan Amount</span>
                      <span className="font-bold text-lg">{loanService.formatCurrency(statistics.totalLoanAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Distribution Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-md font-semibold text-gray-800 mb-4">Status Distribution</h4>
              <div className="space-y-3">
                {statistics.statusBreakdown.map((status) => {
                  const percentage = Math.round((status.count / statistics.totalRequests) * 100);
                  return (
                    <div key={status.status} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 capitalize">{status.status}</span>
                        <span className="text-sm text-gray-600">{status.count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            status.status === 'pending' ? 'bg-yellow-500' :
                            status.status === 'approved' ? 'bg-green-500' :
                            status.status === 'disbursed' ? 'bg-blue-500' :
                            status.status === 'rejected' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Key Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p>• Average loan amount: {loanService.formatCurrency(statistics.totalLoanAmount / statistics.totalRequests)}</p>
                  <p>• Approval rate: {Math.round((statistics.additionalStats.totalApprovedRequests / statistics.totalRequests) * 100)}%</p>
                </div>
                <div>
                  <p>• Disbursement rate: {Math.round((statistics.additionalStats.totalDisbursedLoans / statistics.totalRequests) * 100)}%</p>
                  <p>• Pending rate: {Math.round((statistics.additionalStats.totalPendingRequests / statistics.totalRequests) * 100)}%</p>
                </div>
              </div>
            </div>
          </div>
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

export default LoanStatisticsModal;
