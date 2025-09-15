import React from 'react';
import { AlertTriangle, Plus, Calendar, DollarSign } from 'lucide-react';

const Penalty: React.FC = () => {
  const penalties = [
    { id: 1, member: 'John Doe', type: 'Late Payment', amount: 50, reason: 'Membership fee overdue by 15 days', date: '2024-01-10', dueDate: '2024-01-25', status: 'Unpaid' },
    { id: 2, member: 'Jane Smith', type: 'Violation', amount: 100, reason: 'Facility misuse', date: '2024-01-08', dueDate: '2024-01-23', status: 'Paid' },
    { id: 3, member: 'Mike Johnson', type: 'Late Return', amount: 25, reason: 'Book returned 5 days late', date: '2024-01-05', dueDate: '2024-01-20', status: 'Unpaid' },
    { id: 4, member: 'Sarah Wilson', type: 'Damage', amount: 200, reason: 'Equipment damage during event', date: '2024-01-03', dueDate: '2024-01-18', status: 'Disputed' },
    { id: 5, member: 'David Brown', type: 'Late Payment', amount: 75, reason: 'Course fee overdue by 10 days', date: '2024-01-01', dueDate: '2024-01-16', status: 'Unpaid' }
  ];

  const totalPenalties = penalties.reduce((sum, penalty) => sum + penalty.amount, 0);
  const unpaidPenalties = penalties.filter(p => p.status === 'Unpaid').reduce((sum, p) => sum + p.amount, 0);
  const disputedCount = penalties.filter(p => p.status === 'Disputed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Penalties</h1>
        </div>
        <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Add Penalty</span>
        </button>
      </div>

      {/* Penalty Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Penalties</p>
              <p className="text-2xl font-bold text-gray-800">${totalPenalties}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unpaid Amount</p>
              <p className="text-2xl font-bold text-gray-800">${unpaidPenalties}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-800">{penalties.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disputed</p>
              <p className="text-2xl font-bold text-gray-800">{disputedCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-lg">?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all">
            <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Issue Penalty</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
            <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Record Payment</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Send Reminder</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
            <span className="text-2xl text-gray-400 mx-auto mb-2 block">📊</span>
            <span className="text-sm text-gray-600">Generate Report</span>
          </button>
        </div>
      </div>

      {/* Penalties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Penalties</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalty ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {penalties.map((penalty) => (
                <tr key={penalty.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #P{penalty.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-semibold">
                          {penalty.member.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{penalty.member}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      penalty.type === 'Late Payment' ? 'bg-orange-100 text-orange-800' :
                      penalty.type === 'Violation' ? 'bg-red-100 text-red-800' :
                      penalty.type === 'Damage' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {penalty.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {penalty.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${penalty.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {penalty.dueDate ? new Date(penalty.dueDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      penalty.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      penalty.status === 'Disputed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {penalty.status}
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

export default Penalty;