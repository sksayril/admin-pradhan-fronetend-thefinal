import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, DollarSign, Calendar, Users, RefreshCw, Calculator, Info, CheckCircle, Plus } from 'lucide-react';
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
  const [minAmountFilter, setMinAmountFilter] = useState('');
  const [maxAmountFilter, setMaxAmountFilter] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load available investment plans
  const loadPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await investmentService.getAvailablePlans({
        planType: planTypeFilter || undefined,
        minAmount: minAmountFilter ? parseInt(minAmountFilter) : undefined,
        maxAmount: maxAmountFilter ? parseInt(maxAmountFilter) : undefined
      });

      if (response.success && response.data) {
        let filteredPlans = response.data.plans || [];
        
        // Ensure plans is an array
        if (!Array.isArray(filteredPlans)) {
          console.warn('Expected plans to be an array, got:', typeof filteredPlans);
          filteredPlans = [];
        }
        
        // Apply search filter
        if (searchTerm) {
          filteredPlans = filteredPlans.filter((plan: InvestmentPlan) =>
            plan.planName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setPlans(filteredPlans);
        
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
  }, [planTypeFilter, minAmountFilter, maxAmountFilter]);

  // Handle plan selection
  const handleSelectPlan = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setShowPlanDetails(true);
    
    toast.success(`📋 Opening details for ${plan.planName}`, {
      duration: 2000,
      style: {
        background: '#3B82F6',
        color: '#fff',
        fontSize: '14px',
      },
    });
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
    setMinAmountFilter('');
    setMaxAmountFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Plans</h1>
          <p className="text-gray-600">Create and manage investment plans for society members</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
            <input
              type="number"
              value={minAmountFilter}
              onChange={(e) => setMinAmountFilter(e.target.value)}
              placeholder="Min amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
            <input
              type="number"
              value={maxAmountFilter}
              onChange={(e) => setMaxAmountFilter(e.target.value)}
              placeholder="Max amount"
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
          <p className="text-gray-600">Try adjusting your filters to see more plans.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{investmentService.getPlanTypeIcon(plan.planType)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{plan.planName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${investmentService.getPlanTypeColor(plan.planType)}`}>
                      {plan.planType}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>

              {/* Plan Highlights */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Interest Rate</span>
                  <span className="font-bold text-green-600 text-lg">{investmentService.formatPercentage(plan.interestRate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tenure</span>
                  <span className="font-semibold text-gray-800">{investmentService.formatTenure(plan.tenureMonths)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min Investment</span>
                  <span className="font-semibold text-gray-800">{investmentService.formatCurrency(plan.minimumAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Max Investment</span>
                  <span className="font-semibold text-gray-800">{investmentService.formatCurrency(plan.maximumAmount)}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

              {/* Key Features */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Key Features</h4>
                <div className="space-y-1">
                  {plan.features && plan.features.length > 0 ? (
                    <>
                      {plan.features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600">{feature.feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 2 && (
                        <span className="text-xs text-blue-600">+{plan.features.length - 2} more features</span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-gray-500 italic">No features available</span>
                  )}
                </div>
              </div>

              {/* Statistics */}
              {plan.statistics && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{plan.statistics.totalInvestments}</p>
                      <p className="text-xs text-gray-600">Active Investors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{investmentService.formatCurrency(plan.statistics.totalAmountInvested)}</p>
                      <p className="text-xs text-gray-600">Total Invested</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Info className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => {
                    toast.success('🧮 EMI Calculator coming soon!', {
                      duration: 3000,
                      style: {
                        background: '#3B82F6',
                        color: '#fff',
                        fontSize: '14px',
                      },
                    });
                  }}
                  className="px-4 py-2 text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  title="Calculate EMI"
                >
                  <Calculator className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Details Modal */}
      {showPlanDetails && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{investmentService.getPlanTypeIcon(selectedPlan.planType)}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{selectedPlan.planName}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${investmentService.getPlanTypeColor(selectedPlan.planType)}`}>
                    {selectedPlan.planType}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowPlanDetails(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Plan Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Interest Rate</p>
                      <p className="text-2xl font-bold text-green-800">{investmentService.formatPercentage(selectedPlan.interestRate)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Tenure</p>
                      <p className="text-2xl font-bold text-blue-800">{investmentService.formatTenure(selectedPlan.tenureMonths)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Min Amount</p>
                      <p className="text-2xl font-bold text-purple-800">{investmentService.formatCurrency(selectedPlan.minimumAmount)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Max Amount</p>
                      <p className="text-2xl font-bold text-orange-800">{investmentService.formatCurrency(selectedPlan.maximumAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{selectedPlan.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPlan.features && selectedPlan.features.length > 0 ? (
                    selectedPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-800">{feature.feature}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic col-span-2">No features available for this plan.</p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Terms & Conditions</h3>
                <div className="space-y-2">
                  {selectedPlan.termsAndConditions && selectedPlan.termsAndConditions.length > 0 ? (
                    selectedPlan.termsAndConditions.map((term, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <p className="text-sm text-gray-600">{term.term}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No terms and conditions available for this plan.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPlanDetails(false)}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPlanDetails(false);
                  toast.success('📝 Investment application form coming soon!', {
                    duration: 3000,
                    style: {
                      background: '#3B82F6',
                      color: '#fff',
                      fontSize: '14px',
                    },
                  });
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
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
