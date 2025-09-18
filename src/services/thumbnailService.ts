import { apiClient } from './apiClient';
import { ApiResponse } from './types';

// Thumbnail Types
export interface Thumbnail {
  thumbnailId: string;
  title: string;
  description: string;
  originalImageUrl: string;
  thumbnailUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  dimensions: {
    width: number;
    height: number;
  };
  category: 'gallery' | 'banner' | 'slider' | 'event' | 'announcement' | 'society_photo' | 'other';
  tags: string[];
  status: 'active' | 'inactive' | 'archived';
  isPublic: boolean;
  isFeatured: boolean;
  displayOrder: number;
  altText: string;
  uploadedBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ThumbnailFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  isPublic?: boolean;
  isFeatured?: boolean;
  tags?: string;
  search?: string;
}

export interface ThumbnailUploadRequest {
  images: File[];
  category?: string;
  isPublic?: boolean;
  isFeatured?: boolean;
  tags?: string;
}

export interface ThumbnailUpdateRequest {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  isPublic?: boolean;
  isFeatured?: boolean;
  altText?: string;
  tags?: string[];
}

export interface ThumbnailBulkDeleteRequest {
  thumbnailIds: string[];
}

export interface ThumbnailUploadResponse {
  uploadedThumbnails: Thumbnail[];
  totalUploaded: number;
  totalErrors: number;
}

export interface ThumbnailsResponse {
  thumbnails: Thumbnail[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalThumbnails: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const thumbnailService = {
  /**
   * Upload multiple thumbnails
   */
  async uploadThumbnails(uploadData: ThumbnailUploadRequest): Promise<ApiResponse<ThumbnailUploadResponse>> {
    try {
      const formData = new FormData();
      
      // Add images
      uploadData.images.forEach((image, index) => {
        formData.append('images', image);
      });

      // Add optional fields
      if (uploadData.category) formData.append('category', uploadData.category);
      if (uploadData.isPublic !== undefined) formData.append('isPublic', uploadData.isPublic.toString());
      if (uploadData.isFeatured !== undefined) formData.append('isFeatured', uploadData.isFeatured.toString());
      if (uploadData.tags) formData.append('tags', uploadData.tags);

      const response = await apiClient.post('/admin/thumbnails/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error uploading thumbnails:', error);
      throw error;
    }
  },

  /**
   * Get all thumbnails
   */
  async getThumbnails(filters: ThumbnailFilters = {}): Promise<ApiResponse<ThumbnailsResponse>> {
    try {
      const params = new URLSearchParams();
      
      // Set defaults
      params.append('page', (filters.page || 1).toString());
      params.append('limit', (filters.limit || 10).toString());

      // Add optional filters
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString());
      if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString());
      if (filters.tags) params.append('tags', filters.tags);
      if (filters.search) params.append('search', filters.search);

      const response = await apiClient.get(`/admin/thumbnails?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Error fetching thumbnails:', error);
      throw error;
    }
  },

  /**
   * Get thumbnail by ID
   */
  async getThumbnailById(thumbnailId: string): Promise<ApiResponse<Thumbnail>> {
    try {
      const response = await apiClient.get(`/admin/thumbnails/${thumbnailId}`);
      return response;
    } catch (error) {
      console.error('Error fetching thumbnail:', error);
      throw error;
    }
  },

  /**
   * Update thumbnail
   */
  async updateThumbnail(
    thumbnailId: string,
    updateData: ThumbnailUpdateRequest
  ): Promise<ApiResponse<Thumbnail>> {
    try {
      const response = await apiClient.put(`/admin/thumbnails/${thumbnailId}`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating thumbnail:', error);
      throw error;
    }
  },

  /**
   * Delete thumbnail
   */
  async deleteThumbnail(thumbnailId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(`/admin/thumbnails/${thumbnailId}`);
      return response;
    } catch (error) {
      console.error('Error deleting thumbnail:', error);
      throw error;
    }
  },

  /**
   * Bulk delete thumbnails
   */
  async bulkDeleteThumbnails(deleteData: ThumbnailBulkDeleteRequest): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete('/admin/thumbnails/bulk/delete', {
        data: deleteData
      });
      return response;
    } catch (error) {
      console.error('Error bulk deleting thumbnails:', error);
      throw error;
    }
  },

  /**
   * Get thumbnail category color for UI display
   */
  getCategoryColor(category: string): string {
    switch (category?.toLowerCase()) {
      case 'gallery':
        return 'bg-blue-100 text-blue-800';
      case 'banner':
        return 'bg-green-100 text-green-800';
      case 'slider':
        return 'bg-purple-100 text-purple-800';
      case 'event':
        return 'bg-orange-100 text-orange-800';
      case 'announcement':
        return 'bg-yellow-100 text-yellow-800';
      case 'society_photo':
        return 'bg-pink-100 text-pink-800';
      case 'other':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Get thumbnail status color for UI display
   */
  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format date and time for display
   */
  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },

  /**
   * Get thumbnail categories for dropdown
   */
  getCategories(): Array<{ value: string; label: string }> {
    return [
      { value: 'gallery', label: 'Gallery' },
      { value: 'banner', label: 'Banner' },
      { value: 'slider', label: 'Slider' },
      { value: 'event', label: 'Event' },
      { value: 'announcement', label: 'Announcement' },
      { value: 'society_photo', label: 'Society Photo' },
      { value: 'other', label: 'Other' }
    ];
  },

  /**
   * Get thumbnail statuses for dropdown
   */
  getStatuses(): Array<{ value: string; label: string }> {
    return [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'archived', label: 'Archived' }
    ];
  },

  /**
   * Validate image file
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
    }

    return { isValid: true };
  },

  /**
   * Generate thumbnail preview URL
   */
  generatePreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  },

  /**
   * Revoke preview URL to free memory
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
};
