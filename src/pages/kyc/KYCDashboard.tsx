import React, { useState, useEffect } from 'react';
import { Shield, Users, GraduationCap, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { kycService, PendingKYCResponse, StudentKYC, SocietyMemberKYC } from '../../services';

const KYCDashboard: React.FC = () => {
  const [pendingKYC, setPendingKYC] = useState<PendingKYCResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPendingKYC();
  }, []);

  const loadPendingKYC = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await kycService.getPendingKYC();
      setPendingKYC(data);
    } catch (err) {
      console.error('Error loading pending KYC:', err);
      setError('Failed to load pending KYC requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">KYC Management</h1>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* KYC Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : pendingKYC?.totalPending || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Student KYC</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : pendingKYC?.studentKyc.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Society Member KYC</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : pendingKYC?.societyMemberKyc.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Action Required</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : (pendingKYC?.totalPending || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending KYC Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student KYC */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Student KYC</h2>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                {pendingKYC?.studentKyc.length || 0} Pending
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-500">Loading...</span>
              </div>
            ) : pendingKYC?.studentKyc.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending student KYC requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingKYC?.studentKyc.slice(0, 5).map((kyc) => (
                  <div key={kyc._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {kyc.studentId.firstName.charAt(0)}{kyc.studentId.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {kyc.studentId.firstName} {kyc.studentId.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{kyc.studentId.studentId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(kyc.status)}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(kyc.status)}`}>
                        {kyc.status}
                      </span>
                    </div>
                  </div>
                ))}
                {pendingKYC && pendingKYC.studentKyc.length > 5 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      And {pendingKYC.studentKyc.length - 5} more pending requests
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Society Member KYC */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">Society Member KYC</h2>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                {pendingKYC?.societyMemberKyc.length || 0} Pending
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-500">Loading...</span>
              </div>
            ) : pendingKYC?.societyMemberKyc.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending society member KYC requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingKYC?.societyMemberKyc.slice(0, 5).map((kyc) => (
                  <div key={kyc._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {kyc.memberId.firstName.charAt(0)}{kyc.memberId.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {kyc.memberId.firstName} {kyc.memberId.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{kyc.memberId.memberId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(kyc.status)}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(kyc.status)}`}>
                        {kyc.status}
                      </span>
                    </div>
                  </div>
                ))}
                {pendingKYC && pendingKYC.societyMemberKyc.length > 5 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      And {pendingKYC.societyMemberKyc.length - 5} more pending requests
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Review Pending</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">View Approved</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">View Rejected</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <span className="text-gray-800 font-medium">KYC Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCDashboard;
