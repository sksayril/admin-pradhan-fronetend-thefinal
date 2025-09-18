import React, { useState, useEffect, useCallback } from 'react';
import { X, Save, Image, AlertCircle } from 'lucide-react';
import { thumbnailService, Thumbnail, ThumbnailUpdateRequest } from '../services';
import ErrorDisplay from './ErrorDisplay';
import toast from 'react-hot-toast';

interface ThumbnailEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  thumbnail: Thumbnail;
  onSuccess: () => void;
}

const ThumbnailEditModal: React.FC<ThumbnailEditModalProps> = ({ 
  isOpen, 
  onClose, 
  thumbnail, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState<ThumbnailUpdateRequest>({
    title: thumbnail.title,
    description: thumbnail.description,
    category: thumbnail.category,
    status: thumbnail.status,
    isPublic: thumbnail.isPublic,
    isFeatured: thumbnail.isFeatured,
    altText: thumbnail.altText,
    tags: thumbnail.tags,
  });

  useEffect(() => {
    if (isOpen) {
      setUpdateData({
        title: thumbnail.title,
        description: thumbnail.description,
        category: thumbnail.category,
        status: thumbnail.status,
        isPublic: thumbnail.isPublic,
        isFeatured: thumbnail.isFeatured,
        altText: thumbnail.altText,
        tags: thumbnail.tags,
      });
    }
  }, [isOpen, thumbnail]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await thumbnailService.updateThumbnail(thumbnail.thumbnailId, updateData);
      if (response.success) {
        toast.success('Thumbnail updated successfully');
        onSuccess();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to update thumbnail');
      }
    } catch (err) {
      console.error('Error updating thumbnail:', err);
      setError(err instanceof Error ? err.message : 'Failed to update thumbnail');
    } finally {
      setLoading(false);
    }
  }, [thumbnail.thumbnailId, updateData, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    setError(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Image className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Thumbnail</h2>
              <p className="text-sm text-gray-600">Update thumbnail information</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <ErrorDisplay
            error={error}
            onDismiss={() => setError(null)}
            title="Update failed"
          />

          {/* Thumbnail Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Thumbnail Preview</h3>
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={thumbnail.thumbnailUrl}
                  alt={thumbnail.altText}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">File Name</p>
                    <p className="text-gray-600">{thumbnail.fileName}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">File Size</p>
                    <p className="text-gray-600">{thumbnailService.formatFileSize(thumbnail.fileSize)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Dimensions</p>
                    <p className="text-gray-600">{thumbnail.dimensions.width} × {thumbnail.dimensions.height}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Uploaded</p>
                    <p className="text-gray-600">{thumbnailService.formatDate(thumbnail.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={updateData.title}
                onChange={(e) => setUpdateData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter thumbnail title"
                aria-label="Thumbnail title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={updateData.description}
                onChange={(e) => setUpdateData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter thumbnail description"
                aria-label="Thumbnail description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text *</label>
              <input
                type="text"
                value={updateData.altText}
                onChange={(e) => setUpdateData(prev => ({ ...prev, altText: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter alt text for accessibility"
                aria-label="Alt text"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={updateData.category}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select category"
                >
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
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Select status"
                >
                  {thumbnailService.getStatuses().map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={updateData.tags?.join(', ') || ''}
                onChange={(e) => setUpdateData(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tags separated by commas"
                aria-label="Tags"
              />
            </div>

            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={updateData.isPublic}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Make public</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={updateData.isFeatured}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Mark as featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !updateData.title || !updateData.altText}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailEditModal;

