import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { enrollmentService, EnrollmentStatistics as EnrollmentStatisticsType } from '../services/enrollmentService';

const EnrollmentStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<EnrollmentStatisticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    courseId: '',
    batchId: ''
  });

  const loadStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading enrollment statistics with filters:', filters);
      const response = await enrollmentService.getEnrollmentStatistics(filters);
      console.log('Statistics response:', response);
      
      if (response.success && response.data) {
        setStatistics(response.data);
      } else {
        console.error('Failed to load statistics:', response);
        // Show mock data for testing if API fails
        const mockStatistics: EnrollmentStatisticsType = {
          overall: {
            totalEnrollments: 150,
            pendingEnrollments: 25,
            approvedEnrollments: 100,
            rejectedEnrollments: 10,
            activeEnrollments: 80,
            completedEnrollments: 20,
            totalRevenue: 750000,
            averageRating: 4.2
          },
          byCourse: [
            {
              _id: 'course1',
              courseName: 'Introduction to Python',
              courseType: 'online',
              totalEnrollments: 50,
              pendingEnrollments: 8,
              approvedEnrollments: 35,
              rejectedEnrollments: 3,
              totalRevenue: 175000
            },
            {
              _id: 'course2',
              courseName: 'Advanced JavaScript',
              courseType: 'online',
              totalEnrollments: 40,
              pendingEnrollments: 5,
              approvedEnrollments: 30,
              rejectedEnrollments: 2,
              totalRevenue: 200000
            }
          ],
          byBatch: [
            {
              _id: 'batch1',
              batchName: 'Python Morning Batch',
              courseName: 'Introduction to Python',
              totalEnrollments: 25,
              pendingEnrollments: 3,
              approvedEnrollments: 20,
              rejectedEnrollments: 1,
              totalRevenue: 100000
            },
            {
              _id: 'batch2',
              batchName: 'JS Evening Batch',
              courseName: 'Advanced JavaScript',
              totalEnrollments: 20,
              pendingEnrollments: 2,
              approvedEnrollments: 15,
              rejectedEnrollments: 1,
              totalRevenue: 120000
            }
          ],
          recentEnrollments: [
            {
              _id: 'enrollment1',
              studentId: {
                _id: 'student1',
                firstName: 'John',
                lastName: 'Doe',
                studentId: 'STU001',
                email: 'john.doe@example.com'
              },
              courseId: {
                _id: 'course1',
                title: 'Introduction to Python',
                category: 'Programming',
                type: 'online',
                price: 5000,
                currency: 'INR'
              },
              batchId: {
                _id: 'batch1',
                name: 'Python Morning Batch',
                startDate: '2024-01-01T00:00:00.000Z',
                endDate: '2024-03-01T00:00:00.000Z',
                maxStudents: 30
              },
              status: 'enrolled',
              approvalStatus: 'approved',
              enrollmentDate: '2024-01-15T10:00:00.000Z',
              paymentAmount: 5000,
              currency: 'INR',
              paymentStatus: 'paid',
              createdAt: '2024-01-15T10:00:00.000Z',
              updatedAt: '2024-01-15T10:00:00.000Z'
            }
          ]
        };
        
        setStatistics(mockStatistics);
        setError('Using mock data - API not available');
      }
    } catch (err) {
      console.error('Error loading statistics:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, [filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      courseId: '',
      batchId: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-300 mb-4" />
        <p className="text-red-600 font-medium">Error loading statistics</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <button
          onClick={loadStatistics}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Reset
            </button>
            <button
              onClick={loadStatistics}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.overall.totalEnrollments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.overall.pendingEnrollments}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.overall.activeEnrollments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                {enrollmentService.formatCurrency(statistics.overall.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Statistics by Course</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statistics.byCourse.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {course.courseType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.totalEnrollments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.pendingEnrollments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.approvedEnrollments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollmentService.formatCurrency(course.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Statistics by Batch</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statistics.byBatch.map((batch) => (
                <tr key={batch._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{batch.courseName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {batch.totalEnrollments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {batch.pendingEnrollments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {batch.approvedEnrollments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollmentService.formatCurrency(batch.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Enrollments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statistics.recentEnrollments.map((enrollment) => (
                <tr key={enrollment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.studentId.firstName} {enrollment.studentId.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{enrollment.studentId.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{enrollment.courseId.title}</div>
                    <div className="text-sm text-gray-500">{enrollment.courseId.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollment.batchId.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${enrollmentService.getEnrollmentStatusColor(enrollment.status)}`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enrollmentService.formatDate(enrollment.enrollmentDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {enrollmentService.formatCurrency(enrollment.paymentAmount, enrollment.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentStatistics;
