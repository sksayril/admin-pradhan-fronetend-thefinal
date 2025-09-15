import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, AlertCircle, CheckCircle, DollarSign, TrendingUp, FileText, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { investmentService } from '../services';
import { CreateInvestmentPlanRequest } from '../services/types';

interface CreateInvestmentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Feature {
  feature: string;
  description: string;
}

interface Term {
  term: string;
}

const CreateInvestmentPlanModal: React.FC<CreateInvestmentPlanModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateInvestmentPlanRequest>({
    planName: '',
    planType: 'FD',
    description: '',
    minimumAmount: 0,
    maximumAmount: 0,
    interestRate: 0,
    tenureMonths: 12,
    compoundingFrequency: 'quarterly',
    penaltyConfig: {
      latePaymentPenalty: 0,
      penaltyPercentage: 0,
      gracePeriodDays: 0,
    },
    emiCostStructure: {
      fd: {
        minimumInvestment: 0,
        maximumInvestment: 0,
        investmentIncrements: 0,
      },
    },
    features: [],
    termsAndConditions: [],
  });

  const [features, setFeatures] = useState<Feature[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [newFeature, setNewFeature] = useState({ feature: '', description: '' });
  const [newTerm, setNewTerm] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      planName: '',
      planType: 'FD',
      description: '',
      minimumAmount: 0,
      maximumAmount: 0,
      interestRate: 0,
      tenureMonths: 12,
      compoundingFrequency: 'quarterly',
      penaltyConfig: {
        latePaymentPenalty: 0,
        penaltyPercentage: 0,
        gracePeriodDays: 0,
      },
      emiCostStructure: {
        fd: {
          minimumInvestment: 0,
          maximumInvestment: 0,
          investmentIncrements: 0,
        },
      },
      features: [],
      termsAndConditions: [],
    });
    setFeatures([]);
    setTerms([]);
    setNewFeature({ feature: '', description: '' });
    setNewTerm('');
    setError(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parentField: string, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof typeof prev] as any),
        [childField]: value,
      },
    }));
  };

  const handleEMICostStructureChange = (planType: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      emiCostStructure: {
        ...prev.emiCostStructure,
        [planType]: {
          ...(prev.emiCostStructure[planType as keyof typeof prev.emiCostStructure] as any),
          [field]: value,
        },
      },
    }));
  };

  const addFeature = () => {
    if (newFeature.feature.trim() && newFeature.description.trim()) {
      const feature = { ...newFeature };
      setFeatures(prev => [...prev, feature]);
      setNewFeature({ feature: '', description: '' });
      
      toast.success('✅ Feature added successfully!', {
        duration: 2000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '14px',
        },
      });
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
    
    toast.success('🗑️ Feature removed successfully!', {
      duration: 2000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
      },
    });
  };

  const addTerm = () => {
    if (newTerm.trim()) {
      setTerms(prev => [...prev, { term: newTerm }]);
      setNewTerm('');
      
      toast.success('✅ Term added successfully!', {
        duration: 2000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '14px',
        },
      });
    }
  };

  const removeTerm = (index: number) => {
    setTerms(prev => prev.filter((_, i) => i !== index));
    
    toast.success('🗑️ Term removed successfully!', {
      duration: 2000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
      },
    });
  };

  const validateForm = (): string | null => {
    // Only basic required field validation - let API handle all business logic validation
    if (!formData.planName.trim()) {
      return 'Plan name is required';
    }
    if (!formData.description.trim()) {
      return 'Description is required';
    }
    if (features.length === 0) {
      return 'At least one feature is required';
    }
    if (terms.length === 0) {
      return 'At least one term and condition is required';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(`❌ ${validationError}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '14px',
        },
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        features,
        termsAndConditions: terms,
      };

      const response = await investmentService.createInvestmentPlan(submitData);
      console.log('Investment plan creation response:', response);
      
      if (response.success) {
        toast.success(`🎉 Investment plan "${formData.planName}" created successfully!`, {
          duration: 4000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '14px',
          },
        });
        
        onSuccess();
        onClose();
      } else {
        // Handle validation errors from API
        if (response.errors && Array.isArray(response.errors)) {
          // Show each validation error as a separate toast
          response.errors.forEach((error: string) => {
            toast.error(`❌ ${error}`, {
              duration: 6000,
              style: {
                background: '#EF4444',
                color: '#fff',
                fontSize: '14px',
              },
            });
          });
          
          // Set the first error as the main error for the form
          setError(response.errors[0]);
        } else {
          // Handle general error message
          const errorMessage = response.message || 'Failed to create investment plan';
          setError(errorMessage);
          toast.error(`❌ ${errorMessage}`, {
            duration: 5000,
            style: {
              background: '#EF4444',
              color: '#fff',
              fontSize: '14px',
            },
          });
        }
      }
    } catch (err) {
      console.error('Error creating investment plan:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast.error(`❌ ${errorMessage}`, {
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

  const renderEMICostStructureFields = () => {
    const planType = formData.planType.toLowerCase();
    
    if (planType === 'fd') {
      return (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">Fixed Deposit Structure</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Investment</label>
              <input
                type="number"
                value={formData.emiCostStructure.fd?.minimumInvestment || 0}
                onChange={(e) => handleEMICostStructureChange('fd', 'minimumInvestment', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Investment</label>
              <input
                type="number"
                value={formData.emiCostStructure.fd?.maximumInvestment || 0}
                onChange={(e) => handleEMICostStructureChange('fd', 'maximumInvestment', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Increments</label>
              <input
                type="number"
                value={formData.emiCostStructure.fd?.investmentIncrements || 0}
                onChange={(e) => handleEMICostStructureChange('fd', 'investmentIncrements', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1000"
              />
            </div>
          </div>
        </div>
      );
    } else if (planType === 'rd') {
      return (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">Recurring Deposit Structure</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Monthly Installment</label>
              <input
                type="number"
                value={formData.emiCostStructure.rd?.minimumMonthlyInstallment || 0}
                onChange={(e) => handleEMICostStructureChange('rd', 'minimumMonthlyInstallment', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Monthly Installment</label>
              <input
                type="number"
                value={formData.emiCostStructure.rd?.maximumMonthlyInstallment || 0}
                onChange={(e) => handleEMICostStructureChange('rd', 'maximumMonthlyInstallment', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Installment Increments</label>
              <input
                type="number"
                value={formData.emiCostStructure.rd?.installmentIncrements || 0}
                onChange={(e) => handleEMICostStructureChange('rd', 'installmentIncrements', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (Days)</label>
              <input
                type="number"
                value={formData.emiCostStructure.rd?.gracePeriodDays || 0}
                onChange={(e) => handleEMICostStructureChange('rd', 'gracePeriodDays', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="7"
              />
            </div>
          </div>
        </div>
      );
    } else if (planType === 'cd') {
      return (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">Certificate of Deposit Structure</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Certificate Value</label>
              <input
                type="number"
                value={formData.emiCostStructure.cd?.minimumCertificateValue || 0}
                onChange={(e) => handleEMICostStructureChange('cd', 'minimumCertificateValue', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Certificate Value</label>
              <input
                type="number"
                value={formData.emiCostStructure.cd?.maximumCertificateValue || 0}
                onChange={(e) => handleEMICostStructureChange('cd', 'maximumCertificateValue', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Increments</label>
              <input
                type="number"
                value={formData.emiCostStructure.cd?.certificateIncrements || 0}
                onChange={(e) => handleEMICostStructureChange('cd', 'certificateIncrements', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Prefix</label>
              <input
                type="text"
                value={formData.emiCostStructure.cd?.certificateNumberPrefix || ''}
                onChange={(e) => handleEMICostStructureChange('cd', 'certificateNumberPrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="CD"
              />
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Create Investment Plan</h2>
              <p className="text-sm text-gray-600">Create a new investment plan for society members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name *</label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => handleInputChange('planName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="High Yield FD Plan"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type *</label>
                <select
                  value={formData.planType}
                  onChange={(e) => handleInputChange('planType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="FD">Fixed Deposit (FD)</option>
                  <option value="RD">Recurring Deposit (RD)</option>
                  <option value="CD">Certificate of Deposit (CD)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="High interest fixed deposit plan for long-term investment"
                required
              />
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Financial Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Amount *</label>
                <input
                  type="number"
                  value={formData.minimumAmount}
                  onChange={(e) => handleInputChange('minimumAmount', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Amount *</label>
                <input
                  type="number"
                  value={formData.maximumAmount}
                  onChange={(e) => handleInputChange('maximumAmount', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="8.5"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Months) *</label>
                <input
                  type="number"
                  value={formData.tenureMonths}
                  onChange={(e) => handleInputChange('tenureMonths', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="24"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency *</label>
              <select
                value={formData.compoundingFrequency}
                onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>

          {/* Penalty Configuration */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Penalty Configuration</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Late Payment Penalty</label>
                <input
                  type="number"
                  value={formData.penaltyConfig.latePaymentPenalty}
                  onChange={(e) => handleNestedInputChange('penaltyConfig', 'latePaymentPenalty', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Penalty Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.penaltyConfig.penaltyPercentage}
                  onChange={(e) => handleNestedInputChange('penaltyConfig', 'penaltyPercentage', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (Days)</label>
                <input
                  type="number"
                  value={formData.penaltyConfig.gracePeriodDays}
                  onChange={(e) => handleNestedInputChange('penaltyConfig', 'gracePeriodDays', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* EMI Cost Structure */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>EMI Cost Structure</span>
            </h3>
            {renderEMICostStructureFields()}
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Plan Features</span>
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature Name</label>
                  <input
                    type="text"
                    value={newFeature.feature}
                    onChange={(e) => setNewFeature(prev => ({ ...prev, feature: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="High Interest Rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature Description</label>
                  <input
                    type="text"
                    value={newFeature.description}
                    onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Competitive interest rate of 8.5%"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Feature</span>
              </button>
              
              {features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-800">Added Features:</h4>
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{feature.feature}</p>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Terms and Conditions</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
                <input
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimum investment period is 12 months"
                />
              </div>
              
              <button
                type="button"
                onClick={addTerm}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Term</span>
              </button>
              
              {terms.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-800">Added Terms:</h4>
                  {terms.map((term, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-800">{term.term}</p>
                      <button
                        type="button"
                        onClick={() => removeTerm(index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Create Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvestmentPlanModal;
