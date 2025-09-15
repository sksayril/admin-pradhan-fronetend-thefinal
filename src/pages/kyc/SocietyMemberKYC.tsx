import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, FileImage, AlertTriangle, RefreshCw, Filter, Search } from 'lucide-react';
import { kycService, SocietyMemberKYC } from '../../services';
import DocumentPreviewModal from '../../components/DocumentPreviewModal';

const SocietyMemberKYCPage: React.FC = () => {
  const [societyMemberKYC, setSocietyMemberKYC] = useState<SocietyMemberKYC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
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
  const [selectedKYC, setSelectedKYC] = useState<SocietyMemberKYC | null>(null);
  const [showActionModal, setShowActionModal] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    loadSocietyMemberKYC();
  }, [selectedStatus]);

  const loadSocietyMemberKYC = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await kycService.getSocietyMemberKYCByStatus(selectedStatus);
      setSocietyMemberKYC(data);
    } catch (err) {
      console.error('Error loading society member KYC:', err);
      setError('Failed to load society member KYC requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (kyc: SocietyMemberKYC) => {
    setSelectedKYC(kyc);
    setShowActionModal('approve');
    setRemarks('');
  };

  const handleReject = async (kyc: SocietyMemberKYC) => {
    setSelectedKYC(kyc);
    setShowActionModal('reject');
    setRejectionReason('');
    setRemarks('');
  };

  const confirmApprove = async () => {
    if (!selectedKYC) return;
    
    setActionLoading(selectedKYC._id);
    try {
      await kycService.approveSocietyMemberKYC({
        kycId: selectedKYC._id,
        remarks: remarks || 'All documents verified successfully'
      });
      
      setShowActionModal(null);
      setSelectedKYC(null);
      setRemarks('');
      await loadSocietyMemberKYC();
    } catch (err) {
      console.error('Error approving KYC:', err);
      setError('Failed to approve KYC. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const confirmReject = async () => {
    if (!selectedKYC || !rejectionReason) return;
    
    setActionLoading(selectedKYC._id);
    try {
      await kycService.rejectSocietyMemberKYC({
        kycId: selectedKYC._id,
        rejectionReason,
        remarks: remarks || 'Please resubmit with correct documents'
      });
      
      setShowActionModal(null);
      setSelectedKYC(null);
      setRejectionReason('');
      setRemarks('');
      await loadSocietyMemberKYC();
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

  const filteredKYC = societyMemberKYC.filter(kyc =>
    kyc.memberId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kyc.memberId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kyc.memberId.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kyc.memberId.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Society Member KYC Management</h1>
        </div>
        <button
          onClick={loadSocietyMemberKYC}
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

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, member ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'pending' | 'approved' | 'rejected')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* KYC List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Society Member KYC Requests ({filteredKYC.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading KYC requests...</p>
              </div>
            </div>
          ) : filteredKYC.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500">No {selectedStatus} KYC requests found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Documents</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKYC.map((kyc) => (
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
                        {getStatusIcon(kyc.status)}
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(kyc.status)}`}>
                          {kyc.status}
                        </span>
                      </div>
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
                      {kyc.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleApprove(kyc)}
                            disabled={actionLoading === kyc._id}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(kyc)}
                            disabled={actionLoading === kyc._id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                      {kyc.status !== 'pending' && (
                        <div className="text-sm text-gray-500">
                          {kyc.reviewedAt && `Reviewed: ${new Date(kyc.reviewedAt).toLocaleDateString()}`}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedKYC && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {showActionModal === 'approve' ? 'Approve KYC' : 'Reject KYC'}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Member:</p>
                <p className="font-medium text-gray-800">
                  {selectedKYC.memberId.firstName} {selectedKYC.memberId.lastName}
                </p>
                <p className="text-sm text-gray-500">{selectedKYC.memberId.memberId}</p>
                <p className="text-sm text-gray-500">{selectedKYC.memberId.societyName}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder={showActionModal === 'approve' ? 'Optional remarks...' : 'Additional comments...'}
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowActionModal(null);
                    setSelectedKYC(null);
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

export default SocietyMemberKYCPage;
