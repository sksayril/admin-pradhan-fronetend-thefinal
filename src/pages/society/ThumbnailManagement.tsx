import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Image, Upload, Search, Filter, Grid, List, Plus, Eye, Edit, Trash2, Star, Globe, Lock } from 'lucide-react';
import { thumbnailService, Thumbnail, ThumbnailFilters } from '../../services';
import { TableSkeleton, CardSkeleton } from '../../components/LoadingSkeleton';
import ErrorDisplay from '../../components/ErrorDisplay';
import ThumbnailUploadModal from '../../components/ThumbnailUploadModal';
import ThumbnailEditModal from '../../components/ThumbnailEditModal';
import ThumbnailViewModal from '../../components/ThumbnailViewModal';

const ThumbnailManagement: React.FC = React.memo(() => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [filters, setFilters] = useState<ThumbnailFilters>({
    page: 1,
    limit: 12,
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalThumbnails, setTotalThumbnails] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  
  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<Thumbnail | null>(null);

  // Load thumbnails
  const loadThumbnails = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await thumbnailService.getThumbnails(filters);
      if (response.success && response.data) {
        setThumbnails(response.data.thumbnails);
        setTotalPages(response.data.pagination.totalPages);
        setTotalThumbnails(response.data.pagination.totalThumbnails);
        setHasNextPage(response.data.pagination.hasNext);
        setHasPrevPage(response.data.pagination.hasPrev);
        setCurrentPage(response.data.pagination.currentPage);
      } else {
        throw new Error(response.message || 'Failed to load thumbnails');
      }
    } catch (err) {
      console.error('Error loading thumbnails:', err);
      setError(err instanceof Error ? err.message : 'Failed to load thumbnails');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadThumbnails();
  }, [loadThumbnails]);

  // Memoized statistics
  const statistics = useMemo(() => {
    return {
      total: thumbnails.length,
      active: thumbnails.filter(t => t.status === 'active').length,
      featured: thumbnails.filter(t => t.isFeatured).length,
      public: thumbnails.filter(t => t.isPublic).length,
    };
  }, [thumbnails]);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value === '' ? undefined : value,
      page: 1 
    }));
  }, []);

  const handleViewThumbnail = useCallback((thumbnail: Thumbnail) => {
    setSelectedThumbnail(thumbnail);
    setIsViewModalOpen(true);
  }, []);

  const handleEditThumbnail = useCallback((thumbnail: Thumbnail) => {
    setSelectedThumbnail(thumbnail);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteThumbnail = useCallback(async (thumbnailId: string) => {
    if (!window.confirm('Are you sure you want to delete this thumbnail?')) return;
    
    try {
      const response = await thumbnailService.deleteThumbnail(thumbnailId);
      if (response.success) {
        loadThumbnails(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to delete thumbnail');
      }
    } catch (err) {
      console.error('Error deleting thumbnail:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete thumbnail');
    }
  }, [loadThumbnails]);

  const handleCloseModals = useCallback(() => {
    setIsUploadModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedThumbnail(null);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    loadThumbnails(); // Refresh the list
  }, [loadThumbnails]);

  const handleEditSuccess = useCallback(() => {
    loadThumbnails(); // Refresh the list
  }, [loadThumbnails]);

  if (loading && thumbnails.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image className="w-8 h-8 text-sky-600" />
            <h1 className="text-3xl font-bold text-gray-800">Thumbnail Management</h1>
          </div>
        </div>
        <CardSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Thumbnail Management</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            aria-label="Upload thumbnails"
          >
            <Plus className="w-4 h-4" />
            <span>Upload</span>
          </button>
          <button
            onClick={loadThumbnails}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            aria-label="Refresh thumbnails"
          >
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      <ErrorDisplay
        error={error}
        onRetry={loadThumbnails}
        onDismiss={() => setError(null)}
        title="Failed to load thumbnails"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Thumbnails</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.featured}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Public</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.public}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {thumbnailService.getCategories().map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                {thumbnailService.getStatuses().map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search thumbnails..."
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search thumbnails"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnails Display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : thumbnails.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No thumbnails found</p>
            <p className="text-gray-500 text-sm mt-1">Upload some thumbnails to get started</p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {thumbnails.map((thumbnail) => (
            <div key={thumbnail.thumbnailId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={thumbnail.thumbnailUrl}
                  alt={thumbnail.altText}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {thumbnail.isFeatured && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                      <Star className="w-3 h-3 inline mr-1" />
                      Featured
                    </span>
                  )}
                  {thumbnail.isPublic ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      <Globe className="w-3 h-3 inline mr-1" />
                      Public
                    </span>
                  ) : (
                    <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                      <Lock className="w-3 h-3 inline mr-1" />
                      Private
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{thumbnail.title}</h3>
                <p className="text-sm text-gray-500 truncate">{thumbnail.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${thumbnailService.getCategoryColor(thumbnail.category)}`}>
                    {thumbnail.category}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleViewThumbnail(thumbnail)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label={`View ${thumbnail.title}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditThumbnail(thumbnail)}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      aria-label={`Edit ${thumbnail.title}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteThumbnail(thumbnail.thumbnailId)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label={`Delete ${thumbnail.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Thumbnails table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {thumbnails.map((thumbnail) => (
                  <tr key={thumbnail.thumbnailId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={thumbnail.thumbnailUrl}
                        alt={thumbnail.altText}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{thumbnail.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{thumbnail.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${thumbnailService.getCategoryColor(thumbnail.category)}`}>
                        {thumbnail.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${thumbnailService.getStatusColor(thumbnail.status)}`}>
                        {thumbnail.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {thumbnailService.formatFileSize(thumbnail.fileSize)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewThumbnail(thumbnail)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`View ${thumbnail.title}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditThumbnail(thumbnail)}
                          className="text-green-600 hover:text-green-900"
                          aria-label={`Edit ${thumbnail.title}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteThumbnail(thumbnail.thumbnailId)}
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Delete ${thumbnail.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Pagination */}
      {thumbnails.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {thumbnails.length} of {totalThumbnails} thumbnails
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevPage}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              aria-label="Go to previous page"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm" aria-live="polite">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ThumbnailUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseModals}
        onSuccess={handleUploadSuccess}
      />

      {selectedThumbnail && (
        <>
          <ThumbnailEditModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModals}
            thumbnail={selectedThumbnail}
            onSuccess={handleEditSuccess}
          />

          <ThumbnailViewModal
            isOpen={isViewModalOpen}
            onClose={handleCloseModals}
            thumbnail={selectedThumbnail}
          />
        </>
      )}
    </div>
  );
});

ThumbnailManagement.displayName = 'ThumbnailManagement';

export default ThumbnailManagement;
