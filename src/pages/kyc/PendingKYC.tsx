import React, { useState, useEffect } from 'react';
import { AlertTriangle, GraduationCap, Users, Clock, FileImage, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { kycService, PendingKYCResponse, StudentKYC, SocietyMemberKYC } from '../../services';
import DocumentPreviewModal from '../../components/DocumentPreviewModal';

const PendingKYC: React.FC = () => {
  const [pendingKYC, setPendingKYC] = useState<PendingKYCResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Document preview state
  const [previewDocument, setPreviewDocument] = useState<{
    url: string;
    type: string;
    name?: string;
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Action state
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedKYC, setSelectedKYC] = useState<StudentKYC | SocietyMemberKYC | null>(null);
  const [selectedKYCType, setSelectedKYCType] = useState<'student' | 'society-member' | null>(null);
  const [showActionModal, setShowActionModal] = useState<'approve' | 'reject' | null>(null);

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

  const handleApprove = async (kyc: StudentKYC | SocietyMemberKYC, type: 'student' | 'society-member') => {
    setSelectedKYC(kyc);
    setSelectedKYCType(type);
    setShowActionModal('approve');
    setRemarks('');
  };

  const handleReject = async (kyc: StudentKYC | SocietyMemberKYC, type: 'student' | 'society-member') => {
    setSelectedKYC(kyc);
    setSelectedKYCType(type);
    setShowActionModal('reject');
    setRejectionReason('');
    setRemarks('');
  };

  const confirmApprove = async () => {
    if (!selectedKYC || !selectedKYCType) return;
    
    setActionLoading(selectedKYC._id);
    try {
      if (selectedKYCType === 'student') {
        await kycService.approveStudentKYC({
          kycId: selectedKYC._id,
          remarks: remarks || 'Documents verified successfully'
        });
      } else {
        await kycService.approveSocietyMemberKYC({
          kycId: selectedKYC._id,
          remarks: remarks || 'All documents verified successfully'
        });
      }
      
      setShowActionModal(null);
      setSelectedKYC(null);
      setSelectedKYCType(null);
      setRemarks('');
      await loadPendingKYC();
    } catch (err) {
      console.error('Error approving KYC:', err);
      setError('Failed to approve KYC. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmReject = async () => {
    if (!selectedKYC || !selectedKYCType || !rejectionReason) return;
    
    setActionLoading(selectedKYC._id);
    try {
      if (selectedKYCType === 'student') {
        await kycService.rejectStudentKYC({
          kycId: selectedKYC._id,
          rejectionReason,
          remarks: remarks || 'Please resubmit with correct documents'
        });
      } else {
        await kycService.rejectSocietyMemberKYC({
          kycId: selectedKYC._id,
          rejectionReason,
          remarks: remarks || 'Please resubmit with correct documents'
        });
      }
      
      setShowActionModal(null);
      setSelectedKYC(null);
      setSelectedKYCType(null);
      setRejectionReason('');
      setRemarks('');
      await loadPendingKYC();
    } catch (err) {
      console.error('Error rejecting KYC:', err);
      setError('Failed to reject KYC. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePreviewDocument = (url: string, type: string, name?: string) => {
    setPreviewDocument({ url, type, name });
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-800">Pending KYC Requests</h1>
        </div>
        <button
          onClick={loadPendingKYC}
          disabled={loading}
          className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      {/* Pending KYC List */}
      <div className="space-y-6">
        {/* Student KYC */}
        {pendingKYC?.studentKyc && pendingKYC.studentKyc.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Student KYC Requests</h2>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  {pendingKYC.studentKyc.length} Pending
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingKYC.studentKyc.map((kyc) => (
                    <tr key={kyc._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {kyc.studentId.firstName.charAt(0)}{kyc.studentId.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {kyc.studentId.firstName} {kyc.studentId.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{kyc.studentId.studentId}</div>
                            <div className="text-sm text-gray-500">{kyc.studentId.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{kyc.aadharNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(kyc.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePreviewDocument(
                            kyc.aadharCardImage,
                            'Aadhar Card',
                            `${kyc.studentId.firstName}_${kyc.studentId.lastName}_Aadhar.jpg`
                          )}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <FileImage className="w-4 h-4" />
                          <span className="text-sm">View Aadhar</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApprove(kyc, 'student')}
                            disabled={actionLoading === kyc._id}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(kyc, 'student')}
                            disabled={actionLoading === kyc._id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Society Member KYC */}
        {pendingKYC?.societyMemberKyc && pendingKYC.societyMemberKyc.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Society Member KYC Requests</h2>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  {pendingKYC.societyMemberKyc.length} Pending
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Documents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingKYC.societyMemberKyc.map((kyc) => (
                    <tr key={kyc._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {kyc.memberId.firstName.charAt(0)}{kyc.memberId.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {kyc.memberId.firstName} {kyc.memberId.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{kyc.memberId.memberId}</div>
                            <div className="text-sm text-gray-500">{kyc.memberId.email}</div>
                            <div className="text-sm text-gray-500">{kyc.memberId.societyName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 font-mono">{kyc.aadharNumber}</div>
                          {kyc.panNumber && (
                            <div className="text-sm text-gray-900 font-mono">{kyc.panNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(kyc.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePreviewDocument(
                              kyc.aadharCardImage,
                              'Aadhar Card',
                              `${kyc.memberId.firstName}_${kyc.memberId.lastName}_Aadhar.jpg`
                            )}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                          >
                            <FileImage className="w-4 h-4" />
                            <span className="text-sm">Aadhar</span>
                          </button>
                          {kyc.panCardImage && (
                            <button
                              onClick={() => handlePreviewDocument(
                                kyc.panCardImage!,
                                'PAN Card',
                                `${kyc.memberId.firstName}_${kyc.memberId.lastName}_PAN.jpg`
                              )}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                            >
                              <FileImage className="w-4 h-4" />
                              <span className="text-sm">PAN</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApprove(kyc, 'society-member')}
                            disabled={actionLoading === kyc._id}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(kyc, 'society-member')}
                            disabled={actionLoading === kyc._id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Pending Requests */}
        {pendingKYC && pendingKYC.totalPending === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">All Caught Up!</h3>
              <p className="text-gray-500">No pending KYC requests at the moment.</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedKYC && selectedKYCType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {showActionModal === 'approve' ? 'Approve KYC' : 'Reject KYC'}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {selectedKYCType === 'student' ? 'Student' : 'Member'}:
                </p>
                <p className="font-medium text-gray-800">
                  {'studentId' in selectedKYC 
                    ? `${selectedKYC.studentId.firstName} ${selectedKYC.studentId.lastName}`
                    : `${selectedKYC.memberId.firstName} ${selectedKYC.memberId.lastName}`
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {'studentId' in selectedKYC 
                    ? selectedKYC.studentId.studentId
                    : selectedKYC.memberId.memberId
                  }
                </p>
              </div>

              {showActionModal === 'reject' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter reason for rejection..."
                    required
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder={showActionModal === 'approve' ? 'Optional remarks...' : 'Additional comments...'}
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowActionModal(null);
                    setSelectedKYC(null);
                    setSelectedKYCType(null);
                    setRemarks('');
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showActionModal === 'approve' ? confirmApprove : confirmReject}
                  disabled={actionLoading === selectedKYC._id || (showActionModal === 'reject' && !rejectionReason)}
                  className={`px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                    showActionModal === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionLoading === selectedKYC._id ? 'Processing...' : 
                   showActionModal === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocument && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          documentUrl={previewDocument.url}
          documentType={previewDocument.type}
          documentName={previewDocument.name}
        />
      )}
    </div>
  );
};

export default PendingKYC;
