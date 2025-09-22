import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  CreditCard,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { DashboardOverview, DashboardInvestments, DashboardLoans, DashboardFees, DashboardAcademics } from '../../services/types';

interface StatisticsCardsProps {
  overview: DashboardOverview;
  investments: DashboardInvestments;
  loans: DashboardLoans;
  fees: DashboardFees;
  academics: DashboardAcademics;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  overview,
  investments,
  loans,
  fees,
  academics
}) => {
  // Safety check - if any required data is missing, show empty state
  if (!overview || !investments || !loans || !fees || !academics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const cards = [
    {
      title: 'Total Users',
      value: formatNumber(overview?.totalUsers || 0),
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Students',
      value: formatNumber(overview?.totalStudents || 0),
      icon: GraduationCap,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Society Members',
      value: formatNumber(overview?.totalSocietyMembers || 0),
      icon: Building2,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Active Users',
      value: formatNumber(overview?.activeUsers || 0),
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Total Investments',
      value: formatCurrency(investments?.combined?.totalAmount || 0),
      icon: DollarSign,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'CD Investments',
      value: formatNumber(investments?.cdInvestments?.total || 0),
      icon: TrendingUp,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Total Loans',
      value: formatCurrency(loans?.totalAmount || 0),
      icon: CreditCard,
      color: 'red',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      title: 'Fee Collection',
      value: formatCurrency(fees?.totalCollected || 0),
      icon: DollarSign,
      color: 'teal',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
    {
      title: 'Total Courses',
      value: formatNumber(academics?.totalCourses || 0),
      icon: BookOpen,
      color: 'orange',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Active Enrollments',
      value: formatNumber(academics?.activeEnrollments || 0),
      icon: Calendar,
      color: 'pink',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
    {
      title: 'Pending Approvals',
      value: formatNumber((investments?.cdInvestments?.pending || 0) + (loans?.pending || 0) + (fees?.pending || 0)),
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'New Users This Month',
      value: formatNumber(overview?.newUsersThisMonth || 0),
      icon: TrendingUp,
      color: 'cyan',
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
