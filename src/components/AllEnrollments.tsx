import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Download, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { enrollmentService, Enrollment } from '../services/enrollmentService';

const AllEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    courseId: '',
    batchId: '',
    sortBy: 'enrollmentDate',
    sortOrder: 'desc' as 'asc' | 'desc',
    startDate: '',
    endDate: ''
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEnrollments: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Load all enrollments
  const loadEnrollments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await enrollmentService.getAllEnrollments(filters);
      
      if (response.success && response.data) {
        setEnrollments(response.data.enrollments);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to load enrollments');
      }
    } catch (err) {
      console.error('Error loading enrollments:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, [filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      courseId: '',
      batchId: '',
      sortBy: 'enrollmentDate',
      sortOrder: 'desc',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Reset
            </button>
            <button
              onClick={loadEnrollments}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course ID</label>
            <input
              type="text"
              value={filters.courseId}
              onChange={(e) => handleFilterChange('courseId', e.target.value)}
              placeholder="Enter course ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batch ID</label>
            <input
              type="text"
              value={filters.batchId}
              onChange={(e) => handleFilterChange('batchId', e.target.value)}
              placeholder="Enter batch ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="enrollmentDate">Enrollment Date</option>
              <option value="studentId">Student Name</option>
              <option value="courseId">Course</option>
              <option value="batchId">Batch</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">All Enrollments</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course & Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-500">Loading enrollments...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 text-red-300 mb-2" />
                      <p className="text-red-600 font-medium">Error loading enrollments</p>
                      <p className="text-gray-500 text-sm">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-gray-300 mb-2" />
                      <p>No enrollments found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment) => (
                  <tr key={enrollment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {enrollment.studentId.firstName.charAt(0)}{enrollment.studentId.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.studentId.firstName} {enrollment.studentId.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{enrollment.studentId.studentId}</div>
                          <div className="text-sm text-gray-500">{enrollment.studentId.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{enrollment.courseId.title}</div>
                        <div className="text-gray-500">{enrollment.batchId.name}</div>
                        <div className="text-xs text-gray-400">
                          {enrollment.courseId.category} • {enrollment.courseId.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${enrollmentService.getEnrollmentStatusColor(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                        <div className="text-xs text-gray-500">
                          {enrollment.approvalStatus}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {enrollmentService.formatCurrency(enrollment.paymentAmount, enrollment.currency)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Status: <span className="capitalize">{enrollment.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {enrollmentService.formatDate(enrollment.enrollmentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => console.log('View details:', enrollment._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
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
        {enrollments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {enrollments.length} of {pagination.totalEnrollments} enrollments
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNextPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEnrollments;
