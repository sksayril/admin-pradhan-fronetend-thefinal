import React from 'react';
import { Users, CreditCard, GraduationCap, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '2,543',
      change: '+12%',
      changeType: 'positive',
      icon: GraduationCap,
      color: 'bg-sky-500'
    },
    {
      title: 'Society Members',
      value: '1,234',
      change: '+5%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Total Payments',
      value: '$45,678',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Loans',
      value: '123',
      change: '-3%',
      changeType: 'negative',
      icon: CreditCard,
      color: 'bg-orange-500'
    },
    {
      title: 'Penalties',
      value: '45',
      change: '+2%',
      changeType: 'positive',
      icon: AlertCircle,
      color: 'bg-red-500'
    },
    {
      title: 'Revenue Growth',
      value: '23.5%',
      change: '+1.2%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New student enrollment', user: 'John Doe', time: '2 minutes ago' },
    { id: 2, action: 'Payment received', user: 'Jane Smith', time: '15 minutes ago' },
    { id: 3, action: 'Loan application submitted', user: 'Mike Johnson', time: '1 hour ago' },
    { id: 4, action: 'Certificate issued', user: 'Sarah Wilson', time: '2 hours ago' },
    { id: 5, action: 'Penalty imposed', user: 'David Brown', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-16 h-16 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Trends</h2>
          <div className="h-64 bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-sky-500 mx-auto mb-3" />
              <p className="text-gray-600">Chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Add Member</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all">
            <GraduationCap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Add Student</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all">
            <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Process Payment</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all">
            <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;