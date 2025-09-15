import React from 'react';
import { Filter, Calendar, User, BookOpen, Users, CreditCard, X } from 'lucide-react';
import { EnrollmentFilters as EnrollmentFiltersType } from '../services/enrollmentService';

interface EnrollmentFiltersProps {
  filters: EnrollmentFiltersType;
  onFiltersChange: (filters: EnrollmentFiltersType) => void;
  onReset: () => void;
  courses?: Array<{ _id: string; title: string }>;
  batches?: Array<{ _id: string; name: string; courseId: string }>;
}

const EnrollmentFilters: React.FC<EnrollmentFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  courses = [],
  batches = []
}) => {
  const handleFilterChange = (field: keyof EnrollmentFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== 1 && value !== 10
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Advanced Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Student ID Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <User className="w-4 h-4 inline mr-1" />
            Student ID
          </label>
          <input
            type="text"
            placeholder="Search by student ID..."
            value={filters.studentId || ''}
            onChange={(e) => handleFilterChange('studentId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Course Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <BookOpen className="w-4 h-4 inline mr-1" />
            Course
          </label>
          <select
            value={filters.courseId || ''}
            onChange={(e) => handleFilterChange('courseId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 inline mr-1" />
            Batch
          </label>
          <select
            value={filters.batchId || ''}
            onChange={(e) => handleFilterChange('batchId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Batches</option>
            {batches
              .filter(batch => !filters.courseId || batch.courseId === filters.courseId)
              .map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
          </select>
        </div>

        {/* Enrollment Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 inline mr-1" />
            Enrollment Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="enrolled">Enrolled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Approval Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Users className="w-4 h-4 inline mr-1" />
            Approval Status
          </label>
          <select
            value={filters.approvalStatus || ''}
            onChange={(e) => handleFilterChange('approvalStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Approval Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Payment Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <CreditCard className="w-4 h-4 inline mr-1" />
            Payment Status
          </label>
          <select
            value={filters.paymentStatus || ''}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 inline mr-1" />
            From Date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 inline mr-1" />
            To Date
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={filters.sortBy || 'enrollmentDate'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="enrollmentDate">Enrollment Date</option>
              <option value="studentId">Student ID</option>
              <option value="courseId">Course</option>
              <option value="batchId">Batch</option>
              <option value="status">Status</option>
              <option value="paymentAmount">Payment Amount</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Order:</label>
            <select
              value={filters.sortOrder || 'desc'}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Per page:</label>
          <select
            value={filters.limit || 10}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.studentId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Student: {filters.studentId}
                <button
                  onClick={() => handleFilterChange('studentId', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.courseId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Course: {courses.find(c => c._id === filters.courseId)?.title || filters.courseId}
                <button
                  onClick={() => handleFilterChange('courseId', '')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.batchId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Batch: {batches.find(b => b._id === filters.batchId)?.name || filters.batchId}
                <button
                  onClick={() => handleFilterChange('batchId', '')}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.approvalStatus && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Approval: {filters.approvalStatus}
                <button
                  onClick={() => handleFilterChange('approvalStatus', '')}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.paymentStatus && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                Payment: {filters.paymentStatus}
                <button
                  onClick={() => handleFilterChange('paymentStatus', '')}
                  className="ml-1 text-pink-600 hover:text-pink-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.startDate && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                From: {new Date(filters.startDate).toLocaleDateString()}
                <button
                  onClick={() => handleDateChange('startDate', '')}
                  className="ml-1 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.endDate && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                To: {new Date(filters.endDate).toLocaleDateString()}
                <button
                  onClick={() => handleDateChange('endDate', '')}
                  className="ml-1 text-gray-600 hover:text-gray-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentFilters;
