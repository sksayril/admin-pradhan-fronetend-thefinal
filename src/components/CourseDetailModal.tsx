import React, { useState } from 'react';
import { X, BookOpen, User, MapPin, Globe, DollarSign, Clock, Users, Star, Calendar, FileText, Edit, Trash2, Save, AlertTriangle } from 'lucide-react';
import { Course, UpdateCourseRequest } from '../services/types';
import { courseService } from '../services';

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onCourseUpdated?: (updatedCourse: Course) => void;
  onCourseDeleted?: (courseId: string) => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  course, 
  onCourseUpdated, 
  onCourseDeleted 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<UpdateCourseRequest>({});

  if (!isOpen || !course) return null;

  const formatPrice = (price: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'online' ? <Globe className="w-5 h-5" /> : <MapPin className="w-5 h-5" />;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: course.title,
      description: course.description,
      type: course.type,
      category: course.category,
      price: course.price,
      duration: course.duration,
      status: course.status,
      isActive: course.isActive,
      instructor: {
        name: course.instructor.name,
        email: course.instructor.email,
        phone: course.instructor.phone,
        bio: course.instructor.bio,
        qualifications: course.instructor.qualifications
      },
      address: course.address,
      tags: course.tags?.join(', '),
      prerequisites: course.prerequisites?.join(', '),
      learningObjectives: course.learningObjectives?.join(', '),
      courseContent: course.courseContent
    });
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({});
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('instructor.')) {
      const field = name.split('.')[1];
      setEditData(prev => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          [field]: value
        } as any
      }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setEditData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        } as any
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'duration' ? Number(value) : value
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const response = await courseService.updateCourse(course._id, editData);
      
      console.log('Update response:', response);
      
      if (response.success && response.data) {
        // Handle the nested response structure
        const updatedCourse = (response.data as any).course || response.data;
        onCourseUpdated?.(updatedCourse);
        setIsEditing(false);
        setEditData({});
      } else {
        throw new Error(response.message || 'Failed to update course');
      }
    } catch (err) {
      console.error('Update course error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await courseService.deleteCourse(course._id);
      
      if (response.success) {
        onCourseDeleted?.(course._id);
        onClose();
      } else {
        throw new Error(response.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error('Delete course error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditData({});
    setError(null);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Course' : 'Course Details'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </>
            )}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Header */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="w-20 h-20 rounded-lg object-cover"
                    src={course.thumbnail || '/placeholder-course.png'}
                    alt={course.title}
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-course.png';
                    }}
                  />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={editData.title || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={editData.description || ''}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            name="type"
                            value={editData.type || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            name="status"
                            value={editData.status || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                      <p className="text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(course.status)}`}>
                          {course.status}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          {getTypeIcon(course.type)}
                          <span className="ml-1 capitalize">{course.type}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Course Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={editData.price || ''}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                      <input
                        type="number"
                        name="duration"
                        value={editData.duration || ''}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-gray-900">Price</span>
                      </div>
                      <p className="text-lg font-semibold text-green-600">
                        {formatPrice(course.price, course.currency)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-900">Duration</span>
                      </div>
                      <p className="text-lg font-semibold text-blue-600">
                        {course.duration} {course.durationUnit || 'hours'}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Users className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="font-medium text-gray-900">Enrollments</span>
                      </div>
                      <p className="text-lg font-semibold text-purple-600">
                        {course.enrollmentCount}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Star className="w-5 h-5 text-yellow-600 mr-2" />
                        <span className="font-medium text-gray-900">Rating</span>
                      </div>
                      <p className="text-lg font-semibold text-yellow-600">
                        {course.rating.average.toFixed(1)} ({course.rating.count} reviews)
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="text-gray-600">{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Objectives */}
              {course.learningObjectives && course.learningObjectives.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Objectives</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {course.learningObjectives.map((objective, index) => (
                      <li key={index} className="text-gray-600">{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Course Content */}
              {course.courseContent && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Content</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{course.courseContent}</p>
                </div>
              )}

              {/* Address (for offline courses) */}
              {course.type === 'offline' && course.address && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                      <div>
                        {course.address.street && <p className="text-gray-900">{course.address.street}</p>}
                        {course.address.city && <p className="text-gray-600">{course.address.city}</p>}
                        {course.address.state && <p className="text-gray-600">{course.address.state}</p>}
                        {course.address.zipCode && <p className="text-gray-600">{course.address.zipCode}</p>}
                        {course.address.country && <p className="text-gray-600">{course.address.country}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Materials */}
              {course.coursePdf && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Materials</h3>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <a
                      href={course.coursePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Download Course PDF
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructor Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Instructor
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="instructor.name"
                        value={editData.instructor?.name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="instructor.email"
                        value={editData.instructor?.email || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="text"
                        name="instructor.phone"
                        value={editData.instructor?.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        name="instructor.bio"
                        value={editData.instructor?.bio || ''}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                      <textarea
                        name="instructor.qualifications"
                        value={editData.instructor?.qualifications || ''}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{course.instructor.name}</p>
                    <p className="text-sm text-gray-600">{course.instructor.email}</p>
                    {course.instructor.phone && (
                      <p className="text-sm text-gray-600">{course.instructor.phone}</p>
                    )}
                    {course.instructor.bio && (
                      <p className="text-sm text-gray-600 mt-2">{course.instructor.bio}</p>
                    )}
                    {course.instructor.qualifications && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Qualifications:</span> {course.instructor.qualifications}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Course Stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Course Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{course.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max Students:</span>
                    <span className="font-medium">{course.maxStudents || 'Unlimited'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{formatDate(course.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium">{formatDate(course.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created By:</span>
                    <span className="font-medium">{course.createdBy.firstName} {course.createdBy.lastName}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-white flex-shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Delete Course</h3>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete "{course.title}"? This action cannot be undone.
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    Note: This will only work if no active batches exist for this course.
                  </p>
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Course
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailModal;
