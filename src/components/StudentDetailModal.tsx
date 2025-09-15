import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, GraduationCap, Shield, FileText, Download, Edit, CheckCircle, XCircle, Clock, Eye, FileImage, Lock } from 'lucide-react';
import { userManagementService, EnhancedStudent, KYCInfo } from '../services';
import DocumentPreviewModal from './DocumentPreviewModal';

interface StudentDetailModalProps {
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ studentId, isOpen, onClose }) => {
  const [student, setStudent] = useState<EnhancedStudent | null>(null);
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
    if (isOpen && studentId) {
      loadStudentDetails();
    }
  }, [isOpen, studentId]);

  const loadStudentDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const studentData = await userManagementService.getStudentById(studentId);
      setStudent(studentData);
    } catch (err) {
      console.error('Error loading student details:', err);
      setError('Failed to load student details. Please try again.');
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
              <p className="text-sm text-gray-500">Complete student information and KYC status</p>
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
                <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading student details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-700">{error}</p>
                <button
                  onClick={loadStudentDetails}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : student ? (
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="w-5 h-5 mr-2 text-sky-600" />
                    Basic Information
                  </h3>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-lg font-semibold text-gray-800">
                        {student.firstName} {student.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Student ID</label>
                      <p className="text-lg font-semibold text-sky-600">{student.studentId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-800">{student.email}</p>
                      </div>
                    </div>
                    {student.originalPassword && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Original Password</label>
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                            {student.originalPassword}
                          </p>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-800">{student.phoneNumber || student.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-800">
                          {new Date(student.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <p className="text-gray-800">{formatAddress(student.address)}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Login</label>
                      <p className="text-gray-800">
                        {student.lastLogin 
                          ? new Date(student.lastLogin).toLocaleString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <GraduationCap className="w-5 h-5 mr-2 text-sky-600" />
                  Academic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-lg font-semibold text-gray-800">{student.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Course</label>
                      <p className="text-lg font-semibold text-gray-800">{student.courseName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Year</label>
                      <p className="text-lg font-semibold text-gray-800">{student.year || student.academicYear}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Batch</label>
                      <p className="text-lg font-semibold text-gray-800">{student.batchName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                      <p className="text-gray-800">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KYC Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <Shield className="w-5 h-5 mr-2 text-sky-600" />
                  KYC Information
                </h3>
                
                {student.kyc ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getKYCStatusIcon(student.kyc)}
                        <div>
                          <p className="font-semibold text-gray-800">KYC Status</p>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getKYCStatusColor(student.kyc)}`}>
                            {student.kyc.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {student.kyc.status === 'approved' && student.kyc.approvedBy && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Approved by</p>
                          <p className="font-semibold text-gray-800">
                            {student.kyc.approvedBy.firstName} {student.kyc.approvedBy.lastName}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {student.kyc.submittedAt && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Submitted At</label>
                            <p className="text-gray-800">
                              {new Date(student.kyc.submittedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                        {student.kyc.approvedAt && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Approved At</label>
                            <p className="text-gray-800">
                              {new Date(student.kyc.approvedAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                        {student.kyc.rejectionReason && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                            <p className="text-red-600">{student.kyc.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {student.kyc.aadharNumber && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Aadhar Number</label>
                            <p className="text-gray-800 font-mono">{student.kyc.aadharNumber}</p>
                          </div>
                        )}
                        {student.kyc.aadharCardImage && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Aadhar Card</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <FileImage className="w-4 h-4 text-gray-400" />
                              <button 
                                onClick={() => student.kyc?.aadharCardImage && handlePreviewDocument(
                                  student.kyc.aadharCardImage, 
                                  'Aadhar Card',
                                  `${student.firstName}_${student.lastName}_Aadhar.jpg`
                                )}
                                className="text-sky-600 hover:text-sky-800 flex items-center space-x-1 mr-3"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">Preview</span>
                              </button>
                              <button 
                                onClick={() => {
                                  if (student.kyc?.aadharCardImage) {
                                    const link = document.createElement('a');
                                    link.href = student.kyc.aadharCardImage;
                                    link.download = `${student.firstName}_${student.lastName}_Aadhar.jpg`;
                                    link.target = '_blank';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }
                                }}
                                className="text-sky-600 hover:text-sky-800 flex items-center space-x-1"
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
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No KYC information available</p>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              {(student.interests || student.achievements || student.registeredSocieties) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                    <FileText className="w-5 h-5 mr-2 text-sky-600" />
                    Additional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {student.interests && student.interests.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Interests</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {student.interests.map((interest, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {student.achievements && student.achievements.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Achievements</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {student.achievements.map((achievement, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {student.registeredSocieties && student.registeredSocieties.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Registered Societies</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {student.registeredSocieties.map((society, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                              {society}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
          <button className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
            Edit Student
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

export default StudentDetailModal;
