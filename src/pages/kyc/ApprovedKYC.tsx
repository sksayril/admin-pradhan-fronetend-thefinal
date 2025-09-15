import React, { useState, useEffect } from 'react';
import { Shield, GraduationCap, Users, CheckCircle, Eye, FileImage, RefreshCw, Filter, Search, Calendar } from 'lucide-react';
import { userManagementService, ApprovedKYCStudent, ApprovedKYCSocietyMember } from '../../services';
import DocumentPreviewModal from '../../components/DocumentPreviewModal';

const ApprovedKYC: React.FC = () => {
  const [studentKYC, setStudentKYC] = useState<ApprovedKYCStudent[]>([]);
  const [societyMemberKYC, setSocietyMemberKYC] = useState<ApprovedKYCSocietyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'student' | 'society-member'>('all');
  
  // Document preview state
  const [previewDocument, setPreviewDocument] = useState<{
    url: string;
    type: string;
    name?: string;
  } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    loadApprovedKYC();
  }, []);

  const loadApprovedKYC = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [studentsData, membersData] = await Promise.all([
        userManagementService.getApprovedKYCStudents({
          page: 1,
          limit: 100,
          search: searchTerm
        }),
        userManagementService.getApprovedKYCSocietyMembers({
          page: 1,
          limit: 100,
          search: searchTerm
        })
      ]);
      
      setStudentKYC(studentsData.students);
      setSocietyMemberKYC(membersData.societyMembers);
    } catch (err) {
      console.error('Error loading approved KYC:', err);
      setError('Failed to load approved KYC requests. Please try again.');
    } finally {
      setLoading(false);
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
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  // Filter data based on search and type
  const filteredStudentKYC = studentKYC.filter(kyc =>
    kyc.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kyc.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kyc.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kyc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSocietyMemberKYC = societyMemberKYC.filter(kyc =>
    kyc.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kyc.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kyc.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kyc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalApproved = filteredStudentKYC.length + filteredSocietyMemberKYC.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Approved KYC Documents</h1>
        </div>
        <button
          onClick={loadApprovedKYC}
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
          <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
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
              <p className="text-sm font-medium text-gray-600">Total Approved</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : totalApproved}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Student KYC</p>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : filteredStudentKYC.length}
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
                {loading ? '...' : filteredSocietyMemberKYC.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'student' | 'society-member')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="student">Student KYC</option>
              <option value="society-member">Society Member KYC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approved KYC List */}
      <div className="space-y-6">
        {/* Student KYC */}
        {(selectedType === 'all' || selectedType === 'student') && filteredStudentKYC.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Approved Student KYC</h2>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  {filteredStudentKYC.length} Approved
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewed By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudentKYC.map((kyc) => (
                    <tr key={kyc._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {kyc.firstName.charAt(0)}{kyc.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {kyc.firstName} {kyc.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{kyc.studentId}</div>
                          <div className="text-sm text-gray-500">{kyc.email}</div>
                        </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{kyc.kyc.aadharNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {kyc.kyc.reviewedAt ? new Date(kyc.kyc.reviewedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {kyc.kyc.reviewedBy ? `${kyc.kyc.reviewedBy.firstName} ${kyc.kyc.reviewedBy.lastName}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePreviewDocument(
                            kyc.kyc.aadharCardImage,
                            'Aadhar Card',
                            `${kyc.firstName}_${kyc.lastName}_Aadhar.jpg`
                          )}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <FileImage className="w-4 h-4" />
                          <span className="text-sm">View Aadhar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Society Member KYC */}
        {(selectedType === 'all' || selectedType === 'society-member') && filteredSocietyMemberKYC.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Approved Society Member KYC</h2>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  {filteredSocietyMemberKYC.length} Approved
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewed By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Documents</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSocietyMemberKYC.map((kyc) => (
                    <tr key={kyc._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {kyc.firstName.charAt(0)}{kyc.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {kyc.firstName} {kyc.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{kyc.memberId}</div>
                          <div className="text-sm text-gray-500">{kyc.email}</div>
                          <div className="text-sm text-gray-500">{kyc.societyName}</div>
                        </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900 font-mono">{kyc.kyc.aadharNumber}</div>
                          {kyc.kyc.panNumber && (
                            <div className="text-sm text-gray-900 font-mono">{kyc.kyc.panNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {kyc.kyc.reviewedAt ? new Date(kyc.kyc.reviewedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {kyc.kyc.reviewedBy ? `${kyc.kyc.reviewedBy.firstName} ${kyc.kyc.reviewedBy.lastName}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePreviewDocument(
                              kyc.kyc.aadharCardImage,
                              'Aadhar Card',
                              `${kyc.firstName}_${kyc.lastName}_Aadhar.jpg`
                            )}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                          >
                            <FileImage className="w-4 h-4" />
                            <span className="text-sm">Aadhar</span>
                          </button>
                          {kyc.kyc.panCardImage && (
                            <button
                              onClick={() => handlePreviewDocument(
                                kyc.kyc.panCardImage!,
                                'PAN Card',
                                `${kyc.firstName}_${kyc.lastName}_PAN.jpg`
                              )}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                            >
                              <FileImage className="w-4 h-4" />
                              <span className="text-sm">PAN</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Approved KYC */}
        {totalApproved === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Approved KYC Found</h3>
              <p className="text-gray-500">No approved KYC documents match your search criteria.</p>
            </div>
          </div>
        )}
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

export default ApprovedKYC;
