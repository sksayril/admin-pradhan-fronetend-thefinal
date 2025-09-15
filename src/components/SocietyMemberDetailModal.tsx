import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Phone, MapPin, Calendar, Shield, FileText, Download, Edit, CheckCircle, XCircle, Clock, Award, Star, Eye, FileImage } from 'lucide-react';
import { userManagementService, EnhancedSocietyMember, KYCInfo } from '../services';
import DocumentPreviewModal from './DocumentPreviewModal';

interface SocietyMemberDetailModalProps {
  memberId: string;
  isOpen: boolean;
  onClose: () => void;
}

const SocietyMemberDetailModal: React.FC<SocietyMemberDetailModalProps> = ({ memberId, isOpen, onClose }) => {
  const [member, setMember] = useState<EnhancedSocietyMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Document preview state
  const [previewDocument, setPreviewDocument] = useState<{
    url: string;
    type: string;
    name?: string;
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (isOpen && memberId) {
      loadMemberDetails();
    }
  }, [isOpen, memberId]);

  const loadMemberDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const memberData = await userManagementService.getSocietyMemberById(memberId);
      setMember(memberData);
    } catch (err) {
      console.error('Error loading member details:', err);
      setError('Failed to load member details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string | any) => {
    if (typeof address === 'string') {
      return address;
    }
    if (address && typeof address === 'object') {
      return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
    }
    return 'Address not available';
  };

  const getKYCStatusIcon = (kyc: KYCInfo | undefined) => {
    if (!kyc) return <Clock className="w-4 h-4 text-gray-400" />;
    
    switch (kyc.status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getKYCStatusColor = (kyc: KYCInfo | undefined) => {
    if (!kyc) return 'bg-gray-100 text-gray-800';
    
    switch (kyc.status) {
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

  // Handle document preview
  const handlePreviewDocument = (url: string, type: string, name?: string) => {
    setPreviewDocument({ url, type, name });
    setIsPreviewOpen(true);
  };

  // Handle close document preview
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Society Member Details</h2>
              <p className="text-sm text-gray-500">Complete member information and KYC status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading member details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700">{error}</p>
                <button
                  onClick={loadMemberDetails}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : member ? (
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Basic Information
                  </h3>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-lg font-semibold text-gray-800">
                        {member.firstName} {member.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Member ID</label>
                      <p className="text-lg font-semibold text-green-600">{member.memberId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-800">{member.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-800">{member.phoneNumber || member.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-800">
                          {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <p className="text-gray-800">{formatAddress(member.address)}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Login</label>
                      <p className="text-gray-800">
                        {member.lastLogin 
                          ? new Date(member.lastLogin).toLocaleString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Society Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Society Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Society Name</label>
                      <p className="text-lg font-semibold text-gray-800">{member.societyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Position</label>
                      <p className="text-lg font-semibold text-gray-800">{member.position}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Contribution</label>
                      <p className="text-lg font-semibold text-green-600">
                        ₹{member.totalContribution ? member.totalContribution.toLocaleString() : '0'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Membership Date</label>
                      <p className="text-gray-800">
                        {member.membershipDate ? new Date(member.membershipDate).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KYC Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  KYC Information
                </h3>
                
                {member.kyc ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getKYCStatusIcon(member.kyc)}
                        <div>
                          <p className="font-semibold text-gray-800">KYC Status</p>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getKYCStatusColor(member.kyc)}`}>
                            {member.kyc.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {member.kyc.status === 'approved' && member.kyc.approvedBy && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Approved by</p>
                          <p className="font-semibold text-gray-800">
                            {member.kyc.approvedBy.firstName} {member.kyc.approvedBy.lastName}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {member.kyc.submittedAt && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Submitted At</label>
                            <p className="text-gray-800">
                              {member.kyc.submittedAt ? new Date(member.kyc.submittedAt).toLocaleString() : 'Not available'}
                            </p>
                          </div>
                        )}
                        {member.kyc.approvedAt && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Approved At</label>
                            <p className="text-gray-800">
                              {member.kyc.approvedAt ? new Date(member.kyc.approvedAt).toLocaleString() : 'Not available'}
                            </p>
                          </div>
                        )}
                        {member.kyc.rejectionReason && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                            <p className="text-red-600">{member.kyc.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {member.kyc.aadharNumber && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Aadhar Number</label>
                            <p className="text-gray-800 font-mono">{member.kyc.aadharNumber}</p>
                          </div>
                        )}
                        {member.kyc.panNumber && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">PAN Number</label>
                            <p className="text-gray-800 font-mono">{member.kyc.panNumber}</p>
                          </div>
                        )}
                        <div className="space-y-4">
                          {member.kyc.aadharCardImage && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Aadhar Card</label>
                              <div className="flex items-center space-x-2 mt-1">
                                <FileImage className="w-4 h-4 text-gray-400" />
                                <button 
                                  onClick={() => member.kyc?.aadharCardImage && handlePreviewDocument(
                                    member.kyc.aadharCardImage, 
                                    'Aadhar Card',
                                    `${member.firstName}_${member.lastName}_Aadhar.jpg`
                                  )}
                                  className="text-green-600 hover:text-green-800 flex items-center space-x-1 mr-3"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="text-sm">Preview</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    if (member.kyc?.aadharCardImage) {
                                      const link = document.createElement('a');
                                      link.href = member.kyc.aadharCardImage;
                                      link.download = `${member.firstName}_${member.lastName}_Aadhar.jpg`;
                                      link.target = '_blank';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }
                                  }}
                                  className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                                >
                                  <Download className="w-4 h-4" />
                                  <span className="text-sm">Download</span>
                                </button>
                              </div>
                            </div>
                          )}
                          {member.kyc.panCardImage && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">PAN Card</label>
                              <div className="flex items-center space-x-2 mt-1">
                                <FileImage className="w-4 h-4 text-gray-400" />
                                <button 
                                  onClick={() => member.kyc?.panCardImage && handlePreviewDocument(
                                    member.kyc.panCardImage, 
                                    'PAN Card',
                                    `${member.firstName}_${member.lastName}_PAN.jpg`
                                  )}
                                  className="text-green-600 hover:text-green-800 flex items-center space-x-1 mr-3"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="text-sm">Preview</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    if (member.kyc?.panCardImage) {
                                      const link = document.createElement('a');
                                      link.href = member.kyc.panCardImage;
                                      link.download = `${member.firstName}_${member.lastName}_PAN.jpg`;
                                      link.target = '_blank';
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }
                                  }}
                                  className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                                >
                                  <Download className="w-4 h-4" />
                                  <span className="text-sm">Download</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No KYC information available</p>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              {(member.skills || member.responsibilities || member.achievements || member.eventsOrganized) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                    <Star className="w-5 h-5 mr-2 text-green-600" />
                    Additional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {member.skills && member.skills.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Skills</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {member.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {member.responsibilities && member.responsibilities.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Responsibilities</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {member.responsibilities.map((responsibility, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                              {responsibility}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {member.achievements && member.achievements.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Achievements</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {member.achievements.map((achievement, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {member.eventsOrganized && member.eventsOrganized.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Events Organized</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {member.eventsOrganized.map((event, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment History */}
              {member.paymentHistory && member.paymentHistory.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Recent Payment History
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {member.paymentHistory.slice(0, 5).map((payment, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">{payment.type || 'N/A'}</td>
                            <td className="px-4 py-2 text-sm font-semibold text-green-600">
                              ₹{payment.amount ? payment.amount.toLocaleString() : '0'}
                            </td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {payment.status || 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Edit Member
          </button>
        </div>
      </div>

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

export default SocietyMemberDetailModal;
