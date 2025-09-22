import React from 'react';
import { 
  User, 
  Building2, 
  DollarSign, 
  CreditCard, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { RecentActivities as RecentActivitiesType } from '../../services/types';

interface RecentActivitiesProps {
  data: RecentActivitiesType;
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ data }) => {
  // Safety check - if data is missing, show empty state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-center">No recent activities available</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'paid':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return Clock;
      case 'approved':
      case 'paid':
        return CheckCircle;
      case 'rejected':
        return AlertCircle;
      case 'active':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Recent Students */}
      {data.students && data.students.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
          </div>
          <div className="space-y-3">
            {data.students.slice(0, 5).map((student) => (
              <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                    {student.studentId && (
                      <p className="text-xs text-blue-600 font-mono">{student.studentId}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(student.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Society Members */}
      {data.societyMembers && data.societyMembers.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Building2 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Society Members</h3>
          </div>
          <div className="space-y-3">
            {data.societyMembers.slice(0, 5).map((member) => (
              <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    {member.memberId && (
                      <p className="text-xs text-green-600 font-mono">{member.memberId}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(member.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent CD Investments */}
      {data.cdInvestments && data.cdInvestments.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent CD Investments</h3>
          </div>
          <div className="space-y-3">
            {data.cdInvestments.slice(0, 5).map((investment) => {
              const StatusIcon = getStatusIcon(investment.status);
              return (
                <div key={investment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {investment.userDisplayName || `${investment.userEmail || 'Unknown User'}`}
                      </p>
                      <p className="text-sm text-gray-500">{investment.cdId}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(investment.investmentAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {investment.status}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(investment.requestDate)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Loan Requests */}
      {data.loanRequests && data.loanRequests.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Loan Requests</h3>
          </div>
          <div className="space-y-3">
            {data.loanRequests.slice(0, 5).map((loan) => {
              const StatusIcon = getStatusIcon(loan.status);
              return (
                <div key={loan._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Loan Request #{loan._id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {loan._id}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(loan.loanAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {loan.status}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(loan.requestDate)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Fee Payments */}
      {data.feePayments && data.feePayments.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Fee Payments</h3>
          </div>
          <div className="space-y-3">
            {data.feePayments.slice(0, 5).map((payment) => (
              <div key={payment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-teal-600" />
                  </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Payment #{payment._id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {payment._id}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Paid
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(payment.paymentDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
