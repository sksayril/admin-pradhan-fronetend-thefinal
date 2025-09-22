import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Activity, Server } from 'lucide-react';
import { DashboardData } from '../services/types';
import { DashboardService } from '../services/dashboardService';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import UserGrowthChart from '../components/charts/UserGrowthChart';
import FinancialChart from '../components/charts/FinancialChart';
import DepartmentChart from '../components/charts/DepartmentChart';
import StatusBreakdownChart from '../components/charts/StatusBreakdownChart';
import RecentActivities from '../components/dashboard/RecentActivities';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorDisplay from '../components/ErrorDisplay';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      console.log('Loading dashboard data...');
      const response = await DashboardService.getDashboardData();
      console.log('Dashboard response:', response);
      console.log('Response structure:', {
        hasAdmin: !!response.admin,
        hasOverview: !!response.overview,
        hasInvestments: !!response.investments,
        hasLoans: !!response.loans,
        hasFees: !!response.fees,
        hasAcademics: !!response.academics,
        hasCharts: !!response.charts,
        hasSummary: !!response.summary,
        overviewKeys: response.overview ? Object.keys(response.overview) : 'no overview',
        investmentsKeys: response.investments ? Object.keys(response.investments) : 'no investments'
      });
      setDashboardData(response);
    } catch (err: any) {
      console.error('Dashboard error:', err);
      // For now, set mock data to prevent crashes while API is being developed
      const mockData: DashboardData = {
        admin: {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          lastLogin: new Date().toISOString()
        },
        overview: {
          totalUsers: 0,
          totalStudents: 0,
          totalSocietyMembers: 0,
          totalAdmins: 1,
          activeUsers: 0,
          newUsersThisMonth: 0
        },
        investments: {
          cdInvestments: { total: 0, totalAmount: 0, pending: 0, approved: 0 },
          regularInvestments: { total: 0, totalAmount: 0, pending: 0 },
          combined: { totalInvestments: 0, totalAmount: 0 }
        },
        loans: {
          totalRequests: 0,
          totalAmount: 0,
          pending: 0,
          approved: 0,
          disbursed: 0
        },
        fees: {
          totalRequests: 0,
          totalAmount: 0,
          pending: 0,
          totalPayments: 0,
          totalCollected: 0
        },
        academics: {
          totalCourses: 0,
          totalBatches: 0,
          totalEnrollments: 0,
          activeEnrollments: 0,
          totalAttendanceRecords: 0,
          attendanceThisMonth: 0
        },
        charts: {
          userGrowth: { students: [], societyMembers: [] },
          financial: { cdInvestments: [], loans: [], fees: [] }
        },
        monthlyStats: {
          current: {
            students: 0,
            societyMembers: 0,
            cdInvestments: { count: 0, amount: 0 },
            loans: { count: 0, amount: 0 },
            fees: { count: 0, amount: 0 }
          },
          last: {
            students: 0,
            societyMembers: 0,
            cdInvestments: { count: 0, amount: 0 },
            loans: { count: 0, amount: 0 },
            fees: { count: 0, amount: 0 }
          },
          growth: {
            students: 0,
            societyMembers: 0,
            cdInvestments: 0,
            loans: 0,
            fees: 0
          }
        },
        departmentStats: {
          students: [],
          societyMembers: [],
          courses: []
        },
        statusBreakdowns: {
          cdInvestments: [],
          loans: [],
          feeRequests: [],
          enrollments: []
        },
        recentActivities: {
          students: [],
          societyMembers: [],
          cdInvestments: [],
          loanRequests: [],
          feePayments: []
        },
        summary: {
          totalRevenue: 0,
          totalInvestments: 0,
          totalPendingApprovals: 0,
          systemHealth: {
            activeUsers: 0,
            activeCourses: 0,
            activeBatches: 0,
            systemUptime: 0
          }
        }
      };
      setDashboardData(mockData);
      setError('Dashboard API not available. Showing empty data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={handleRefresh} />;
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {dashboardData.admin.name}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* API Status Warning */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>API Status:</strong> {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <StatisticsCards
        overview={dashboardData.overview}
        investments={dashboardData.investments}
        loans={dashboardData.loans}
        fees={dashboardData.fees}
        academics={dashboardData.academics}
      />

      {/* Summary Cards */}
      {dashboardData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.summary.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.summary.totalPendingApprovals || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Server className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatUptime(dashboardData.summary.systemHealth?.systemUptime || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {dashboardData.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData.charts.userGrowth && (
            <UserGrowthChart data={dashboardData.charts.userGrowth} />
          )}
          {dashboardData.charts.financial && (
            <FinancialChart data={dashboardData.charts.financial} />
          )}
        </div>
      )}

      {/* Department and Status Charts */}
      {dashboardData.departmentStats && dashboardData.statusBreakdowns && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentChart data={dashboardData.departmentStats} type="students" />
          <StatusBreakdownChart data={dashboardData.statusBreakdowns} type="cdInvestments" />
        </div>
      )}

      {/* Additional Charts */}
      {dashboardData.statusBreakdowns && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusBreakdownChart data={dashboardData.statusBreakdowns} type="loans" />
          <StatusBreakdownChart data={dashboardData.statusBreakdowns} type="feeRequests" />
        </div>
      )}

      {/* Recent Activities */}
      {dashboardData.recentActivities && (
        <RecentActivities data={dashboardData.recentActivities} />
      )}

      {/* Monthly Growth Stats */}
      {dashboardData.monthlyStats && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Growth Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-2">Students</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {dashboardData.monthlyStats.current?.students || 0}
                </span>
                <div className={`flex items-center ${
                  (dashboardData.monthlyStats.growth?.students || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(dashboardData.monthlyStats.growth?.students || 0) >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(dashboardData.monthlyStats.growth?.students || 0)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-2">Society Members</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {dashboardData.monthlyStats.current?.societyMembers || 0}
                </span>
                <div className={`flex items-center ${
                  (dashboardData.monthlyStats.growth?.societyMembers || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(dashboardData.monthlyStats.growth?.societyMembers || 0) >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(dashboardData.monthlyStats.growth?.societyMembers || 0)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-2">CD Investments</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {dashboardData.monthlyStats.current?.cdInvestments?.count || 0}
                </span>
                <div className={`flex items-center ${
                  (dashboardData.monthlyStats.growth?.cdInvestments || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(dashboardData.monthlyStats.growth?.cdInvestments || 0) >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(dashboardData.monthlyStats.growth?.cdInvestments || 0)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-2">Loans</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {dashboardData.monthlyStats.current?.loans?.count || 0}
                </span>
                <div className={`flex items-center ${
                  (dashboardData.monthlyStats.growth?.loans || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(dashboardData.monthlyStats.growth?.loans || 0) >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(dashboardData.monthlyStats.growth?.loans || 0)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-2">Fees</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {dashboardData.monthlyStats.current?.fees?.count || 0}
                </span>
                <div className={`flex items-center ${
                  (dashboardData.monthlyStats.growth?.fees || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(dashboardData.monthlyStats.growth?.fees || 0) >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(dashboardData.monthlyStats.growth?.fees || 0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;