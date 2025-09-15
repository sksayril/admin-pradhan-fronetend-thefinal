import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Filter, Download, AlertCircle, RefreshCw, Eye, Edit, Trash2, CreditCard } from 'lucide-react';
import { feeService } from '../../services';
import { FeeRequest, FeeRequestFilters, CreateFeeRequestRequest, StudentWithEnrollments, RecordPaymentRequest } from '../../services/types';
import CreateFeeRequestModal from '../../components/CreateFeeRequestModal';
import RecordPaymentModal from '../../components/RecordPaymentModal';

const FeeManagement: React.FC = () => {
  // State for fee requests data
  const [feeRequests, setFeeRequests] = useState<FeeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters and search
  const [filters] = useState<FeeRequestFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFeeRequests, setTotalFeeRequests] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [selectedFeeRequest, setSelectedFeeRequest] = useState<FeeRequest | null>(null);

  // State for dropdown data
  const [studentsWithEnrollments, setStudentsWithEnrollments] = useState<StudentWithEnrollments[]>([]);

  // Load fee requests data
  const loadFeeRequests = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters: FeeRequestFilters = {
        ...filters,
        search: searchTerm || undefined,
        status: selectedStatus === 'all' ? undefined : selectedStatus as any,
        paymentMethod: selectedPaymentMethod === 'all' ? undefined : selectedPaymentMethod as any,
      };

      // Remove undefined values
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key as keyof FeeRequestFilters] === undefined) {
          delete currentFilters[key as keyof FeeRequestFilters];
        }
      });

      const response = await feeService.getAllFeeRequests(page, 10, currentFilters);
      
      if (response.success && response.data) {
        setFeeRequests(response.data.feeRequests);
        setTotalPages(response.data.pagination.totalPages);
        setTotalFeeRequests(response.data.pagination.totalItems);
        setHasNextPage(response.data.pagination.hasNextPage);
        setHasPrevPage(response.data.pagination.hasPrevPage);
      } else {
        throw new Error(response.message || 'Failed to load fee requests');
      }
    } catch (err) {
      console.error('Error loading fee requests:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load dropdown data
  const loadDropdownData = async () => {
    try {
      const response = await feeService.getStudentsWithEnrollments();
      if (response.success && response.data) {
        setStudentsWithEnrollments(response.data.students);
      }
    } catch (err) {
      console.error('Error loading students with enrollments:', err);
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    loadFeeRequests(currentPage);
  }, [currentPage, searchTerm, selectedStatus, selectedPaymentMethod]);

  useEffect(() => {
    loadDropdownData();
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadFeeRequests(1);
  };

  // Handle export
  const handleExport = async () => {
    try {
      await feeService.getAllFeeRequests(1, 1000, filters);
      // Export logic would go here
    } catch (err) {
      console.error('Error exporting fee requests:', err);
      setError('Failed to export fee requests. Please try again.');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadFeeRequests(currentPage);
  };

  // Handle create fee request
  const handleCreateFeeRequest = async (feeRequestData: CreateFeeRequestRequest) => {
    try {
      setIsCreating(true);
      const response = await feeService.createFeeRequest(feeRequestData);
      if (response.success) {
        setIsCreateModalOpen(false);
        loadFeeRequests(currentPage); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to create fee request');
      }
    } catch (error) {
      console.error("Failed to create fee request from page:", error);
      throw error; // Re-throw for modal to catch and display
    } finally {
      setIsCreating(false);
    }
  };

  // Handle record payment
  const handleRecordPayment = async (paymentData: RecordPaymentRequest) => {
    try {
      setIsRecordingPayment(true);
      const response = await feeService.recordPayment(paymentData);
      if (response.success) {
        setIsPaymentModalOpen(false);
        setSelectedFeeRequest(null);
        loadFeeRequests(currentPage); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to record payment');
      }
    } catch (error) {
      console.error("Failed to record payment from page:", error);
      throw error; // Re-throw for modal to catch and display
    } finally {
      setIsRecordingPayment(false);
    }
  };

  // Handle open payment modal
  const handleOpenPaymentModal = (feeRequest: FeeRequest) => {
    setSelectedFeeRequest(feeRequest);
    setIsPaymentModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return feeService.formatCurrency(amount, currency);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Fee Request</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{totalFeeRequests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">
                {feeRequests.filter(fr => fr.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-lg">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-800">
                {feeRequests.filter(fr => fr.status === 'paid').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-800">
                {feeRequests.filter(fr => fr.status === 'overdue').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student name, course, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select 
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Payment Methods</option>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </form>
      </div>

      {/* Fee Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Fee Requests ({feeRequests.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course & Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-500">Loading fee requests...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 text-red-300 mb-2" />
                      <p className="text-red-600 font-medium">Error loading fee requests</p>
                      <p className="text-gray-500 text-sm">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : feeRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <DollarSign className="w-12 h-12 text-gray-300 mb-2" />
                      <p>No fee requests found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                feeRequests.map((feeRequest) => (
                  <tr key={feeRequest._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {typeof feeRequest.studentId === 'object' 
                              ? `${feeRequest.studentId.firstName.charAt(0)}${feeRequest.studentId.lastName.charAt(0)}`
                              : '??'
                            }
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {typeof feeRequest.studentId === 'object' 
                              ? `${feeRequest.studentId.firstName} ${feeRequest.studentId.lastName}`
                              : 'Unknown Student'
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            {typeof feeRequest.studentId === 'object' 
                              ? feeRequest.studentId.studentId
                              : 'N/A'
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {typeof feeRequest.courseId === 'object' ? feeRequest.courseId.title : 'Unknown Course'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {typeof feeRequest.batchId === 'object' ? feeRequest.batchId.name : 'Unknown Batch'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(feeRequest.totalAmount, feeRequest.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Paid: {formatCurrency(feeRequest.paidAmount, feeRequest.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${feeService.getPaymentMethodColor(feeRequest.paymentMethod)}`}>
                        {feeRequest.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${feeService.getFeeStatusColor(feeRequest.status)}`}>
                        {feeRequest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(feeRequest.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-green-600 hover:text-green-900" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {feeRequest.remainingAmount > 0 && (
                          <button 
                            onClick={() => handleOpenPaymentModal(feeRequest)}
                            className="text-blue-600 hover:text-blue-900" 
                            title="Record Payment"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {feeRequests.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {feeRequests.length} of {totalFeeRequests} fee requests
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Fee Request Modal */}
      <CreateFeeRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateFeeRequest}
        studentsWithEnrollments={studentsWithEnrollments}
        loading={isCreating}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedFeeRequest(null);
        }}
        onSubmit={handleRecordPayment}
        feeRequest={selectedFeeRequest}
        loading={isRecordingPayment}
      />
    </div>
  );
};

export default FeeManagement;
