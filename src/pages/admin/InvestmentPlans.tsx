import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, TrendingUp, DollarSign, Calendar, Users, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { investmentService } from '../../services';
import { InvestmentPlan } from '../../services/types';
import CreateInvestmentPlanModal from '../../components/CreateInvestmentPlanModal';

const InvestmentPlans: React.FC = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [planTypeFilter, setPlanTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load investment plans
  const loadPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await investmentService.getInvestmentPlans(
        currentPage,
        10,
        {
          search: searchTerm || undefined,
          planType: planTypeFilter || undefined,
          isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined
        }
      );

      if (response.success && response.data) {
        setPlans(response.data.plans);
        setTotalPages(response.data.pagination.totalPages);
        
        toast.success('📊 Investment plans loaded successfully!', {
          duration: 2000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '14px',
          },
        });
      } else {
        throw new Error(response.message || 'Failed to load investment plans');
      }
    } catch (err) {
      console.error('Error loading investment plans:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast.error(`❌ Failed to load plans: ${errorMessage}`, {
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

  // Load plans on component mount and when filters change
  useEffect(() => {
    loadPlans();
  }, [currentPage, searchTerm, planTypeFilter, statusFilter]);

  // Handle plan status toggle
  const handleToggleStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const response = await investmentService.togglePlanStatus(planId, !currentStatus);
      
      if (response.success) {
        // Update the plan in the local state
        setPlans(prevPlans =>
          prevPlans.map(plan =>
            plan._id === planId ? { ...plan, isActive: !currentStatus } : plan
          )
        );
      }
    } catch (err) {
      console.error('Error toggling plan status:', err);
    }
  };

  // Handle delete plan
  const handleDeletePlan = async (planId: string, planName: string) => {
    if (window.confirm(`Are you sure you want to delete the plan "${planName}"? This action cannot be undone.`)) {
      try {
        const response = await investmentService.deleteInvestmentPlan(planId);
        
        if (response.success) {
          // Remove the plan from the local state
          setPlans(prevPlans => prevPlans.filter(plan => plan._id !== planId));
        }
      } catch (err) {
        console.error('Error deleting plan:', err);
      }
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadPlans();
  };

  // Handle successful plan creation
  const handleCreateSuccess = () => {
    loadPlans(); // Reload the plans list
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setPlanTypeFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Plans</h1>
          <p className="text-gray-600">Manage investment plans for society members</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
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
                placeholder="Search plans..."
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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

      {/* Plans Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading investment plans...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Plans</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Investment Plans Found</h3>
          <p className="text-gray-600 mb-6">Create your first investment plan to get started.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{investmentService.getPlanTypeIcon(plan.planType)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{plan.planName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${investmentService.getPlanTypeColor(plan.planType)}`}>
                      {plan.planType}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStatus(plan._id, plan.isActive)}
                    className={`p-1 rounded-full transition-colors ${
                      plan.isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={plan.isActive ? 'Deactivate Plan' : 'Activate Plan'}
                  >
                    {plan.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Plan Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Interest Rate</span>
                  <span className="font-semibold text-green-600">{investmentService.formatPercentage(plan.interestRate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tenure</span>
                  <span className="font-semibold text-gray-800">{investmentService.formatTenure(plan.tenureMonths)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min Amount</span>
                  <span className="font-semibold text-gray-800">{investmentService.formatCurrency(plan.minimumAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Max Amount</span>
                  <span className="font-semibold text-gray-800">{investmentService.formatCurrency(plan.maximumAmount)}</span>
                </div>
              </div>

              {/* Statistics */}
              {plan.statistics && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{plan.statistics.totalInvestments}</p>
                      <p className="text-xs text-gray-600">Total Investments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{investmentService.formatCurrency(plan.statistics.totalAmountInvested)}</p>
                      <p className="text-xs text-gray-600">Total Amount</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Plan"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan._id, plan.planName)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Plan Modal */}
      <CreateInvestmentPlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default InvestmentPlans;
