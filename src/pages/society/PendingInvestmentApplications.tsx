import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, Eye, CheckCircle, XCircle, Calendar, DollarSign, User, TrendingUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { investmentService } from '../../services';
import { InvestmentApplication, InvestmentApplicationFilters } from '../../services/types';
import InvestmentApplicationDetailModal from '../../components/InvestmentApplicationDetailModal';
import InvestmentApplicationApprovalModal from '../../components/InvestmentApplicationApprovalModal';
import InvestmentApplicationRejectionModal from '../../components/InvestmentApplicationRejectionModal';

const PendingInvestmentApplications: React.FC = () => {
  const [applications, setApplications] = useState<InvestmentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [planTypeFilter, setPlanTypeFilter] = useState('');
  const [memberIdFilter, setMemberIdFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<InvestmentApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Load pending investment applications
  const loadApplications = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const filters: InvestmentApplicationFilters = {
        page,
        limit: 10,
        planType: planTypeFilter || undefined,
        memberId: memberIdFilter || undefined,
        search: searchTerm || undefined,
        status: 'pending'
      };

      const response = await investmentService.getPendingInvestmentApplications(filters);

      if (response.success && response.data) {
        setApplications(response.data.applications);
        setPagination(response.data.pagination);
        
        toast.success('📋 Pending investment applications loaded successfully!', {
          duration: 2000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '14px',
          },
        });
      } else {
        throw new Error(response.message || 'Failed to load pending applications');
      }
    } catch (err) {
      console.error('Error loading pending applications:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast.error(`❌ Failed to load applications: ${errorMessage}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '14px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Load applications on component mount and when filters change
  useEffect(() => {
    loadApplications(1);
  }, [planTypeFilter, memberIdFilter]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        loadApplications(1);
      } else {
        loadApplications(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle application selection
  const handleViewApplication = (application: InvestmentApplication) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
    
    toast.success(`📋 Opening details for ${application.applicationId}`, {
      duration: 2000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontSize: '14px',
      },
    });
  };

  // Handle approval
  const handleApproveApplication = (application: InvestmentApplication) => {
    setSelectedApplication(application);
    setShowApprovalModal(true);
  };

  // Handle rejection
  const handleRejectApplication = (application: InvestmentApplication) => {
    setSelectedApplication(application);
    setShowRejectionModal(true);
  };

  // Handle successful approval/rejection
  const handleActionSuccess = () => {
    loadApplications(pagination.currentPage);
    setShowDetailModal(false);
    setShowApprovalModal(false);
    setShowRejectionModal(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadApplications(pagination.currentPage);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setPlanTypeFilter('');
    setMemberIdFilter('');
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    loadApplications(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Investment Applications</h1>
          <p className="text-gray-600">Review and manage pending investment applications from society members</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by member name, email, or ID..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
            <select
              value={planTypeFilter}
              onChange={(e) => setPlanTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="FD">Fixed Deposit (FD)</option>
              <option value="RD">Recurring Deposit (RD)</option>
              <option value="CD">Certificate of Deposit (CD)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member ID</label>
            <input
              type="text"
              value={memberIdFilter}
              onChange={(e) => setMemberIdFilter(e.target.value)}
              placeholder="Member ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {investmentService.formatCurrency(
                  applications.reduce((sum, app) => sum + app.investmentAmount, 0)
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.length > 0 
                  ? investmentService.formatCurrency(
                      applications.reduce((sum, app) => sum + app.investmentAmount, 0) / applications.length
                    )
                  : '₹0'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(applications.map(app => app.member.memberId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading pending applications...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Applications</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Pending Applications</h3>
          <p className="text-gray-600">There are currently no pending investment applications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.applicationId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-semibold text-blue-600">
                            {investmentService.getApplicationStatusIcon(application.status)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.applicationId}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${investmentService.getApplicationStatusColor(application.status)}`}>
                            {application.status}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.member.firstName} {application.member.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{application.member.email}</div>
                        <div className="text-xs text-gray-400">ID: {application.member.memberId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.plan.planName}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${investmentService.getPlanTypeColor(application.plan.planType)}`}>
                          {application.plan.planType}
                        </div>
                        <div className="text-xs text-gray-500">
                          {investmentService.formatPercentage(application.plan.interestRate)} • {investmentService.formatTenure(application.plan.tenureMonths)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {investmentService.formatCurrency(application.investmentAmount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        EMI: {application.monthlyEMI ? investmentService.formatCurrency(application.monthlyEMI) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(application.applicationDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(application.applicationDate).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApproveApplication(application)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Approve Application"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRejectApplication(application)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Reject Application"
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * 10, pagination.totalApplications)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{pagination.totalApplications}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showDetailModal && selectedApplication && (
        <InvestmentApplicationDetailModal
          application={selectedApplication}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onApprove={() => {
            setShowDetailModal(false);
            handleApproveApplication(selectedApplication);
          }}
          onReject={() => {
            setShowDetailModal(false);
            handleRejectApplication(selectedApplication);
          }}
        />
      )}

      {showApprovalModal && selectedApplication && (
        <InvestmentApplicationApprovalModal
          application={selectedApplication}
          isOpen={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {showRejectionModal && selectedApplication && (
        <InvestmentApplicationRejectionModal
          application={selectedApplication}
          isOpen={showRejectionModal}
          onClose={() => setShowRejectionModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
};

export default PendingInvestmentApplications;
