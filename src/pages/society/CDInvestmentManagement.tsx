import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { CDInvestment, CDInvestmentFilters, CDInvestmentStatistics } from '../../services/types';
import { CDInvestmentService } from '../../services/cdInvestmentService';
import CDInvestmentApprovalModal from '../../components/CDInvestmentApprovalModal';
import CDInvestmentRejectionModal from '../../components/CDInvestmentRejectionModal';
import ErrorDisplay from '../../components/ErrorDisplay';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const CDInvestmentManagement: React.FC = () => {
  console.log('CDInvestmentManagement component rendered');
  
  const [investments, setInvestments] = useState<CDInvestment[]>([]);
  const [statistics, setStatistics] = useState<CDInvestmentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState<CDInvestmentFilters>({
    page: 1,
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('');
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  // Modals
  const [selectedInvestment, setSelectedInvestment] = useState<CDInvestment | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load investments
  const loadInvestments = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const currentFilters: CDInvestmentFilters = {
        ...filters,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        userType: userTypeFilter || undefined,
      };

      console.log('Loading CD investments with filters:', currentFilters);
      const response = await CDInvestmentService.getAllInvestments(currentFilters);
      console.log('CD investments response:', response);
      
      // The service returns response.data, so response is the actual data object
      setInvestments(response.investments);
      setStatistics(response.statistics);
      setPagination(response.pagination);
      
      console.log('Set investments:', response.investments);
      console.log('Set statistics:', response.statistics);
    } catch (err: any) {
      console.error('Error loading CD investments:', err);
      setError(err.response?.data?.message || 'Failed to load CD investments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load pending requests
  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters: CDInvestmentFilters = {
        page: 1,
        limit: 20,
        search: searchTerm || undefined,
        userType: userTypeFilter || undefined,
      };

      const response = await CDInvestmentService.getPendingRequests(currentFilters);
      
      // The service returns response.data, so response is the actual data object
      setInvestments(response.requests);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load pending CD requests');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadInvestments();
  }, []);

  // Handle filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadInvestments();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, userTypeFilter]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadInvestments(false);
  };

  // Handle approval
  const handleApproval = (investment: CDInvestment) => {
    setSelectedInvestment(investment);
    setShowApprovalModal(true);
  };

  // Handle rejection
  const handleRejection = (investment: CDInvestment) => {
    setSelectedInvestment(investment);
    setShowRejectionModal(true);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    loadInvestments(false);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    loadInvestments();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      active: { color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
      matured: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get user type badge
  const getUserTypeBadge = (userType: string) => {
    const isStudent = userType === 'Student';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isStudent ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
      }`}>
        <Users className="w-3 h-3 mr-1" />
        {userType}
      </span>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSkeleton />;
  }

  // Debug information
  console.log('Component state:', {
    loading,
    refreshing,
    error,
    investments: investments.length,
    statistics,
    pagination
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CD Investment Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage Certificate of Deposit investment requests and approvals
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Debug Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Information</h3>
        <div className="text-xs text-yellow-700 space-y-1">
          <p>Loading: {loading ? 'true' : 'false'}</p>
          <p>Refreshing: {refreshing ? 'true' : 'false'}</p>
          <p>Error: {error || 'none'}</p>
          <p>Investments Count: {investments.length}</p>
          <p>Statistics: {statistics ? 'loaded' : 'null'}</p>
          <p>Pagination: {pagination ? `Page ${pagination.currentPage} of ${pagination.totalPages}` : 'null'}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Investments</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.overall.totalInvestments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{statistics.overall.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Interest Rate</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.overall.avgInterestRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Investments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.byStatus.active?.count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by CD ID, name, email..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="active">Active</option>
              <option value="matured">Matured</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="Student">Student</option>
              <option value="SocietyMember">Society Member</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setUserTypeFilter('');
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && <ErrorDisplay message={error} onRetry={handleRefresh} />}

      {/* Investments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CD Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {console.log('Rendering investments:', investments)}
              {investments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No investments found</p>
                      <p className="text-sm">Try adjusting your filters or check back later.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                investments.map((investment) => (
                <tr key={investment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 font-mono">
                        {investment.cdId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {investment.tenureMonths} months @ {investment.interestRate}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {investment.userId.firstName} {investment.userId.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{investment.userEmail}</div>
                      <div className="mt-1">
                        {getUserTypeBadge(investment.userType)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{investment.investmentAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Maturity: ₹{investment.maturityAmount.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(investment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(investment.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedInvestment(investment);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {investment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproval(investment)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejection(investment)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CDInvestmentApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSuccess={handleModalSuccess}
        investment={selectedInvestment}
      />

      <CDInvestmentRejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSuccess={handleModalSuccess}
        investment={selectedInvestment}
      />
    </div>
  );
};

export default CDInvestmentManagement;
