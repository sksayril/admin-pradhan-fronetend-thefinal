import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Eye, AlertCircle, RefreshCw, Download, Filter } from 'lucide-react';
import { userManagementService, SocietyMemberFilters, EnhancedSocietyMember } from '../../services';
import SocietyMemberDetailModal from '../../components/SocietyMemberDetailModal';

const SocietyMember: React.FC = () => {
  // State for members data
  const [members, setMembers] = useState<EnhancedSocietyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters and search
  const [filters] = useState<SocietyMemberFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSociety, setSelectedSociety] = useState('all');
  const [selectedKycStatus, setSelectedKycStatus] = useState('all');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // State for detail modal
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Load members data
  const loadMembers = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters: SocietyMemberFilters = {
        ...filters,
        search: searchTerm || undefined,
        isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
        societyName: selectedSociety === 'all' ? undefined : selectedSociety,
        kycStatus: selectedKycStatus === 'all' ? undefined : selectedKycStatus as any,
      };

      // Remove undefined values
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key as keyof SocietyMemberFilters] === undefined) {
          delete currentFilters[key as keyof SocietyMemberFilters];
        }
      });

      const response = await userManagementService.getAllSocietyMembers(
        page,
        10,
        currentFilters,
        'firstName',
        'asc'
      );

      setMembers(response.societyMembers);
      setTotalPages(response.pagination.totalPages);
      setTotalMembers(response.pagination.totalItems);
      setHasNextPage(response.pagination.hasNextPage);
      setHasPrevPage(response.pagination.hasPrevPage);
      setCurrentPage(response.pagination.currentPage);
    } catch (err) {
      console.error('Error loading members:', err);
      setError('Failed to load society members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load members on component mount and when filters change
  useEffect(() => {
    loadMembers(1);
  }, [searchTerm, selectedStatus, selectedSociety, selectedKycStatus]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadMembers(page);
  };

  // Handle export
  const handleExport = async () => {
    try {
      const currentFilters: SocietyMemberFilters = {
        ...filters,
        search: searchTerm || undefined,
        isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
        societyName: selectedSociety === 'all' ? undefined : selectedSociety,
        kycStatus: selectedKycStatus === 'all' ? undefined : selectedKycStatus as any,
      };

      await userManagementService.exportUsers('society-members', currentFilters, 'excel');
    } catch (err) {
      console.error('Error exporting members:', err);
      setError('Failed to export members. Please try again.');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadMembers(currentPage);
  };

  // Handle view member details
  const handleViewMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setIsDetailModalOpen(true);
  };

  // Handle close detail modal
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMemberId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Society Members</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Member Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-800">{totalMembers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-800">
                {members.filter(m => m.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">KYC Pending</p>
              <p className="text-2xl font-bold text-gray-800">
                {members.filter(m => m.kycStatus === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-lg">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-gray-800">
                {members.filter(m => m.isVerified).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or member ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select 
              value={selectedSociety}
              onChange={(e) => setSelectedSociety(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Societies</option>
              <option value="shjajhsajas">shjajhsajas</option>
              <option value="tech-club">Tech Club</option>
              <option value="sports-club">Sports Club</option>
              <option value="cultural-society">Cultural Society</option>
            </select>
            <select 
              value={selectedKycStatus}
              onChange={(e) => setSelectedKycStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All KYC Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="not_submitted">Not Submitted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Members List ({members.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Society</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-500">Loading members...</span>
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-gray-300 mb-2" />
                      <p>No members found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          {member.profilePicture ? (
                            <img
                              src={member.profilePicture}
                              alt={`${member.firstName} ${member.lastName}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-green-500 flex items-center justify-center">
                                      <span class="text-white text-sm font-semibold">
                                        ${member.firstName.charAt(0)}${member.lastName.charAt(0)}
                                      </span>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-green-500 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {member.memberId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                      <div className="text-sm text-gray-500">{member.phoneNumber || member.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.societyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : 
                       member.membershipDate ? new Date(member.membershipDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        member.kycStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        member.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        member.kycStatus === 'not_submitted' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {member.kycStatus === 'not_submitted' ? 'Not Submitted' : member.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewMember(member.id || member._id)}
                          className="text-green-600 hover:text-green-900" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {members.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {members.length} of {totalMembers} members
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Member Detail Modal */}
      {selectedMemberId && (
        <SocietyMemberDetailModal
          memberId={selectedMemberId}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
};

export default SocietyMember;