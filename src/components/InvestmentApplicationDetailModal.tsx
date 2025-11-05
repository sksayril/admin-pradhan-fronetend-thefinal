import React from 'react';
import { X, User, Calendar, TrendingUp, FileText, CheckCircle, XCircle, Phone, Mail, Clock, CreditCard } from 'lucide-react';
import { InvestmentApplication } from '../services/types';
import { investmentService } from '../services';

interface InvestmentApplicationDetailModalProps {
  application: InvestmentApplication;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

const InvestmentApplicationDetailModal: React.FC<InvestmentApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{investmentService.getApplicationStatusIcon(application.status)}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Investment Application Details
              </h2>
              <p className="text-sm text-gray-600">Application ID: {application.applicationId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Application Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  application.status === 'approved' ? 'bg-green-500' :
                  application.status === 'rejected' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}></div>
                <span className="text-lg font-semibold text-gray-800">Application Status</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${investmentService.getApplicationStatusColor(application.status)}`}>
                {application.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Member Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Member Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-sm text-gray-900">
                    {application.member.firstName} {application.member.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member ID</label>
                  <p className="text-sm text-gray-900">{application.member.memberId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{application.member.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {application.member.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900">{application.member.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Investment Plan Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Investment Plan Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                  <p className="text-sm text-gray-900">{application.plan.planName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan Type</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${investmentService.getPlanTypeColor(application.plan.planType)}`}>
                    {application.plan.planType}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Interest Rate</label>
                  <p className="text-sm text-gray-900">{investmentService.formatPercentage(application.plan.interestRate)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tenure</label>
                  <p className="text-sm text-gray-900">{investmentService.formatTenure(application.plan.tenureMonths)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
                  <p className="text-lg font-semibold text-green-600">
                    {investmentService.formatCurrency(application.investmentAmount)}
                  </p>
                </div>
                {application.monthlyEMI && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly EMI</label>
                    <p className="text-sm text-gray-900">{investmentService.formatCurrency(application.monthlyEMI)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Payment Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <p className="text-lg font-semibold text-gray-900">
                  {investmentService.formatCurrency(application.investmentAmount)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                <p className="text-lg font-semibold text-green-600">
                  {investmentService.formatCurrency(application.totalAmountPaid)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Remaining Amount</label>
                <p className="text-lg font-semibold text-orange-600">
                  {investmentService.formatCurrency(application.remainingAmount)}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${
                  application.paymentStatus === 'completed' ? 'bg-green-500' :
                  application.paymentStatus === 'partial' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {application.paymentStatus}
                </span>
              </div>
            </div>
            {application.paymentMethod && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <p className="text-sm text-gray-900 capitalize">{application.paymentMethod}</p>
              </div>
            )}
          </div>

          {/* EMI Progress */}
          {application.emiProgress && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">EMI Progress</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{application.emiProgress.total}</p>
                  <p className="text-sm text-gray-600">Total EMIs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{application.emiProgress.paid}</p>
                  <p className="text-sm text-gray-600">Paid</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{application.emiProgress.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{application.emiProgress.overdue}</p>
                  <p className="text-sm text-gray-600">Overdue</p>
                </div>
              </div>
            </div>
          )}

          {/* EMI Schedule */}
          {application.emiSchedule && application.emiSchedule.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">EMI Schedule</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">EMI #</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {application.emiSchedule.map((emi) => (
                      <tr key={emi.emiNumber}>
                        <td className="px-4 py-2 text-sm text-gray-900">{emi.emiNumber}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{formatDate(emi.dueDate)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{investmentService.formatCurrency(emi.amount)}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            emi.status === 'paid' ? 'bg-green-100 text-green-800' :
                            emi.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {emi.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Application Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Application Timeline</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                  <p className="text-xs text-gray-500">{formatDateTime(application.applicationDate)}</p>
                </div>
              </div>
              {application.approvalDate && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Approved</p>
                    <p className="text-xs text-gray-500">{formatDateTime(application.approvalDate)}</p>
                    {application.approvedBy && (
                      <p className="text-xs text-gray-400">
                        Approved by: {typeof application.approvedBy === 'string' 
                          ? application.approvedBy 
                          : application.approvedBy.firstName 
                            ? `${application.approvedBy.firstName} ${application.approvedBy.lastName || ''} (${application.approvedBy.email || ''})`
                            : application.approvedBy.email || 'Unknown'}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {application.rejectionDate && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Rejected</p>
                    <p className="text-xs text-gray-500">{formatDateTime(application.rejectionDate)}</p>
                    {application.rejectedBy && (
                      <p className="text-xs text-gray-400">
                        Rejected by: {typeof application.rejectedBy === 'string' 
                          ? application.rejectedBy 
                          : application.rejectedBy.firstName 
                            ? `${application.rejectedBy.firstName} ${application.rejectedBy.lastName || ''} (${application.rejectedBy.email || ''})`
                            : application.rejectedBy.email || 'Unknown'}
                      </p>
                    )}
                    {application.rejectionReason && (
                      <p className="text-xs text-red-600">Reason: {application.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {application.notes && application.notes.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
              </div>
              <div className="space-y-2">
                {application.notes.map((note, index) => {
                  // Handle both string and object formats
                  const noteText = typeof note === 'string' ? note : note.note || '';
                  const addedBy = typeof note === 'object' && note.addedBy 
                    ? (typeof note.addedBy === 'string' 
                      ? note.addedBy 
                      : `${note.addedBy.firstName || ''} ${note.addedBy.lastName || ''}`.trim() || note.addedBy.email || 'Unknown')
                    : null;
                  const noteDate = typeof note === 'object' && note.date 
                    ? formatDateTime(note.date)
                    : null;
                  
                  return (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{noteText}</p>
                      {(addedBy || noteDate) && (
                        <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
                          {addedBy && <span>Added by: {addedBy}</span>}
                          {noteDate && <span>• {noteDate}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
          {application.status === 'pending' && (
            <div className="flex items-center space-x-3">
              <button
                onClick={onReject}
                className="px-6 py-2 text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={onApprove}
                className="px-6 py-2 text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentApplicationDetailModal;
