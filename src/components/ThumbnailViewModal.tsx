import React from 'react';
import { X, Download, ExternalLink, Calendar, User, Tag, Globe, Lock, Star } from 'lucide-react';
import { thumbnailService, Thumbnail } from '../services';

interface ThumbnailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  thumbnail: Thumbnail;
}

const ThumbnailViewModal: React.FC<ThumbnailViewModalProps> = ({ isOpen, onClose, thumbnail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ExternalLink className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Thumbnail Details</h2>
              <p className="text-sm text-gray-600">{thumbnail.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Display */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={thumbnail.originalImageUrl}
                  alt={thumbnail.altText}
                  className="w-full h-auto rounded-lg border border-gray-200"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  {thumbnail.isFeatured && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Featured</span>
                    </span>
                  )}
                  {thumbnail.isPublic ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>Public</span>
                    </span>
                  ) : (
                    <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <Lock className="w-4 h-4" />
                      <span>Private</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <a
                  href={thumbnail.originalImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Original</span>
                </a>
                <a
                  href={thumbnail.originalImageUrl}
                  download={thumbnail.fileName}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Title</p>
                    <p className="text-gray-900">{thumbnail.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-gray-900">{thumbnail.description || 'No description provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Alt Text</p>
                    <p className="text-gray-900">{thumbnail.altText}</p>
                  </div>
                </div>
              </div>

              {/* File Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">File Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">File Name</p>
                    <p className="text-gray-900 text-sm">{thumbnail.fileName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">File Size</p>
                    <p className="text-gray-900 text-sm">{thumbnailService.formatFileSize(thumbnail.fileSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dimensions</p>
                    <p className="text-gray-900 text-sm">{thumbnail.dimensions.width} × {thumbnail.dimensions.height}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">MIME Type</p>
                    <p className="text-gray-900 text-sm">{thumbnail.mimeType}</p>
                  </div>
                </div>
              </div>

              {/* Categorization */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Categorization</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Category</p>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${thumbnailService.getCategoryColor(thumbnail.category)}`}>
                      {thumbnail.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${thumbnailService.getStatusColor(thumbnail.status)}`}>
                      {thumbnail.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Display Order</p>
                    <p className="text-gray-900">{thumbnail.displayOrder}</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {thumbnail.tags && thumbnail.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {thumbnail.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Uploaded By</p>
                    <p className="text-gray-900 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{thumbnail.uploadedBy.firstName} {thumbnail.uploadedBy.lastName}</span>
                    </p>
                    <p className="text-gray-500 text-sm">{thumbnail.uploadedBy.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Uploaded Date</p>
                    <p className="text-gray-900 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{thumbnailService.formatDateTime(thumbnail.createdAt)}</span>
                    </p>
                  </div>
                  {thumbnail.updatedAt !== thumbnail.createdAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Last Updated</p>
                      <p className="text-gray-900 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{thumbnailService.formatDateTime(thumbnail.updatedAt)}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailViewModal;
