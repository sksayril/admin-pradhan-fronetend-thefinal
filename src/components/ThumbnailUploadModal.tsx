import React, { useState, useCallback } from 'react';
import { X, Upload, Image, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { thumbnailService, ThumbnailUploadRequest } from '../services';
import ErrorDisplay from './ErrorDisplay';
import toast from 'react-hot-toast';

interface ThumbnailUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FilePreview {
  file: File;
  preview: string;
  isValid: boolean;
  error?: string;
}

const ThumbnailUploadModal: React.FC<ThumbnailUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState<ThumbnailUploadRequest>({
    images: [],
    category: 'gallery',
    isPublic: true,
    isFeatured: false,
    tags: '',
  });

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FilePreview[] = [];
    const maxFiles = 10;
    const currentFileCount = files.length;

    if (currentFileCount + selectedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once. Currently have ${currentFileCount} files.`);
      return;
    }

    Array.from(selectedFiles).forEach((file) => {
      const validation = thumbnailService.validateImageFile(file);
      const preview = thumbnailService.generatePreviewUrl(file);
      
      newFiles.push({
        file,
        preview,
        isValid: validation.isValid,
        error: validation.error,
      });
    });

    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  }, [files.length]);

  const handleFileRemove = useCallback((index: number) => {
    const fileToRemove = files[index];
    thumbnailService.revokePreviewUrl(fileToRemove.preview);
    
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, [files]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleSubmit = useCallback(async () => {
    if (files.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }

    const validFiles = files.filter(f => f.isValid);
    if (validFiles.length === 0) {
      setError('No valid files to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadRequest: ThumbnailUploadRequest = {
        ...uploadData,
        images: validFiles.map(f => f.file),
      };

      const response = await thumbnailService.uploadThumbnails(uploadRequest);
      if (response.success) {
        toast.success(`${response.data?.totalUploaded || 0} thumbnails uploaded successfully`);
        onSuccess();
        handleClose();
      } else {
        throw new Error(response.message || 'Failed to upload thumbnails');
      }
    } catch (err) {
      console.error('Error uploading thumbnails:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload thumbnails');
    } finally {
      setUploading(false);
    }
  }, [files, uploadData, onSuccess]);

  const handleClose = useCallback(() => {
    // Clean up preview URLs
    files.forEach(file => {
      thumbnailService.revokePreviewUrl(file.preview);
    });
    
    setFiles([]);
    setError(null);
    setUploadData({
      images: [],
      category: 'gallery',
      isPublic: true,
      isFeatured: false,
      tags: '',
    });
    onClose();
  }, [files, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upload Thumbnails</h2>
              <p className="text-sm text-gray-600">
                Upload up to 10 images with automatic thumbnail generation
              </p>
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
            title="Upload failed"
          />

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">
              Supports JPEG, PNG, GIF, WebP up to 10MB each
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>

          {/* File Previews */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Files ({files.length}/10)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="relative">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleFileRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        aria-label={`Remove ${file.file.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {file.isValid ? (
                        <div className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.file.name}</p>
                      <p className="text-xs text-gray-500">{thumbnailService.formatFileSize(file.file.size)}</p>
                      {file.error && (
                        <p className="text-xs text-red-600 mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Settings */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Upload Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={uploadData.tags}
                  onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Enter tags separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Enter tags"
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={uploadData.isPublic}
                  onChange={(e) => setUploadData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Make public</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={uploadData.isFeatured}
                  onChange={(e) => setUploadData(prev => ({ ...prev, isFeatured: e.target.checked }))}
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
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading || files.length === 0}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload {files.length} Files</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailUploadModal;
