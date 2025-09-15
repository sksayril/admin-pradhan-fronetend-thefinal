import React from 'react';
import { Banknote, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

const Loans: React.FC = () => {
  const loans = [
    { id: 1, member: 'John Doe', amount: 10000, purpose: 'Education', interestRate: 5.5, term: 24, status: 'Active', nextDue: '2024-02-15', remainingBalance: 8500 },
    { id: 2, member: 'Jane Smith', amount: 15000, purpose: 'Business', interestRate: 6.0, term: 36, status: 'Pending', nextDue: null, remainingBalance: 15000 },
    { id: 3, member: 'Mike Johnson', amount: 5000, purpose: 'Emergency', interestRate: 4.5, term: 12, status: 'Completed', nextDue: null, remainingBalance: 0 },
    { id: 4, member: 'Sarah Wilson', amount: 8000, purpose: 'Home Improvement', interestRate: 5.0, term: 18, status: 'Overdue', nextDue: '2024-01-10', remainingBalance: 6200 },
    { id: 5, member: 'David Brown', amount: 12000, purpose: 'Vehicle', interestRate: 7.0, term: 30, status: 'Active', nextDue: '2024-02-20', remainingBalance: 9800 }
  ];

  const totalLoaned = loans.reduce((sum, loan) => sum + (loan.amount || 0), 0);
  const totalOutstanding = loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);
  const activeLoans = loans.filter(loan => loan.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Banknote className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Loans</h1>
        </div>
        <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>New Loan</span>
        </button>
      </div>

      {/* Loan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Loaned</p>
              <p className="text-2xl font-bold text-gray-800">${totalLoaned.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-800">${totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-800">{activeLoans}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-800">{loans.filter(l => l.status === 'Overdue').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Loan Applications</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #L{loan.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-semibold">
                          {loan.member.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{loan.member}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loan.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${loan.amount ? loan.amount.toLocaleString() : '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loan.interestRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${loan.remainingBalance ? loan.remainingBalance.toLocaleString() : '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loan.nextDue ? new Date(loan.nextDue).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      loan.status === 'Active' ? 'bg-green-100 text-green-800' :
                      loan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      loan.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {loan.status}
                    </span>
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

export default Loans;