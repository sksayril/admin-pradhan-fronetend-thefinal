import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Clock, BarChart3, Search, Filter, Download, RefreshCw } from 'lucide-react';
import EnrollmentStatusCheck from '../../components/EnrollmentStatusCheck';
import PendingEnrollments from '../../components/PendingEnrollments';
import EnrollmentStatistics from '../../components/EnrollmentStatistics';
import AllEnrollments from '../../components/AllEnrollments';

const EnrollmentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'pending' | 'all' | 'statistics'>('status');

  const tabs = [
    {
      id: 'status' as const,
      label: 'Student Status',
      icon: Search,
      description: 'Check individual student enrollment status'
    },
    {
      id: 'pending' as const,
      label: 'Pending Requests',
      icon: Clock,
      description: 'Review and approve pending enrollments'
    },
    {
      id: 'all' as const,
      label: 'All Enrollments',
      icon: Users,
      description: 'View and manage all enrollments'
    },
    {
      id: 'statistics' as const,
      label: 'Statistics',
      icon: BarChart3,
      description: 'View enrollment analytics and reports'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'status':
        return <EnrollmentStatusCheck />;
      case 'pending':
        return <PendingEnrollments />;
      case 'all':
        return <AllEnrollments />;
      case 'statistics':
        return <EnrollmentStatistics />;
      default:
        return <EnrollmentStatusCheck />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Enrollment Management</h1>
            <p className="text-gray-600">Manage student enrollments, approvals, and analytics</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => console.log('Export data')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Description */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {(() => {
              const activeTabData = tabs.find(tab => tab.id === activeTab);
              const Icon = activeTabData?.icon;
              return (
                <>
                  {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                  <p className="text-sm text-gray-600">{activeTabData?.description}</p>
                </>
              );
            })()}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentManagement;
