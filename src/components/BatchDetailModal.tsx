import React, { useState } from 'react';
import { X, Edit, Trash2, Calendar, Clock, DollarSign, Users, Info, AlertTriangle } from 'lucide-react';
import { Batch, UpdateBatchRequest } from '../services/types';
import { batchService } from '../services';
import './BatchDetailModal.css';
import './CreateBatchModal.css'; // for .input, .btn-primary, .btn-secondary

interface BatchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: Batch | null;
  onBatchUpdated?: (updatedBatch: Batch) => void;
  onBatchDeleted?: (batchId: string) => void;
}

const BatchDetailModal: React.FC<BatchDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  batch, 
  onBatchUpdated, 
  onBatchDeleted 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UpdateBatchRequest>>({});

  const handleEdit = () => {
    if (!batch) return;
    setIsEditing(true);
    setEditData({
        name: batch.name,
        description: batch.description,
        maxStudents: batch.maxStudents,
        price: batch.price,
        startDate: batch.startDate.split('T')[0],
        endDate: batch.endDate.split('T')[0],
        registrationStartDate: batch.registrationStartDate.split('T')[0],
        registrationEndDate: batch.registrationEndDate.split('T')[0],
        allowLateRegistration: batch.allowLateRegistration,
        timeSlots: batch.timeSlots.map(ts => ({...ts, date: ts.date.split('T')[0]}))
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUpdate = async () => {
    if (!batch) return;
    setIsUpdating(true);
    setError(null);
    try {
        const response = await batchService.updateBatch(batch._id, editData);
        if (response.success && response.data) {
            onBatchUpdated?.((response.data as any).batch);
            setIsEditing(false);
        } else {
            throw new Error(response.message || 'Failed to update batch');
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
     if (!batch) return;
     setIsDeleting(true);
     setError(null);
     try {
        await batchService.deleteBatch(batch._id);
        onBatchDeleted?.(batch._id);
        onClose();
     } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
     } finally {
        setIsDeleting(false);
     }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    // Convert 24-hour format (like "00:13") to 12-hour format with AM/PM
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (!isOpen || !batch) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{isEditing ? 'Edit Batch' : 'Batch Details'}</h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button onClick={handleEdit} className="p-2 text-gray-600 hover:text-blue-600" title="Edit batch">
                  <Edit size={18} />
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-gray-600 hover:text-red-600" title="Delete batch">
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 text-gray-600 hover:text-black" title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            {isEditing ? (
                // Edit Form
                <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                      <input 
                        name="name" 
                        value={editData.name || ''} 
                        onChange={handleInputChange} 
                        className="input w-full" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        name="description" 
                        value={editData.description || ''} 
                        onChange={handleInputChange} 
                        rows={3}
                        className="input w-full" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
                        <input 
                          type="number" 
                          name="maxStudents" 
                          value={editData.maxStudents || 0} 
                          onChange={handleInputChange} 
                          className="input w-full" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input 
                          type="number" 
                          name="price" 
                          value={editData.price || 0} 
                          onChange={handleInputChange} 
                          className="input w-full" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input 
                          type="date" 
                          name="startDate" 
                          value={editData.startDate || ''} 
                          onChange={handleInputChange} 
                          className="input w-full" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input 
                          type="date" 
                          name="endDate" 
                          value={editData.endDate || ''} 
                          onChange={handleInputChange} 
                          className="input w-full" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Start</label>
                        <input 
                          type="date" 
                          name="registrationStartDate" 
                          value={editData.registrationStartDate || ''} 
                          onChange={handleInputChange} 
                          className="input w-full" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration End</label>
                        <input 
                          type="date" 
                          name="registrationEndDate" 
                          value={editData.registrationEndDate || ''} 
                          onChange={handleInputChange} 
                          className="input w-full" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="allowLateRegistration" 
                          checked={editData.allowLateRegistration || false} 
                          onChange={handleInputChange} 
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="ml-2 text-sm text-gray-700">Allow Late Registration</span>
                      </label>
                    </div>
                    
                    {/* Time slots editing would go here - more complex, omitted for brevity */}
                </div>
            ) : (
                // View Details
                <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-xl font-bold text-gray-900">{batch.name}</h3>
                      <p className="text-gray-600 mt-2">{batch.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Course</h4>
                            <p className="text-gray-700">{(batch.courseId as any)?.title || 'N/A'}</p>
                            <p className="text-sm text-gray-500 capitalize">Type: {(batch.courseId as any)?.type || 'N/A'}</p>
                            <p className="text-sm text-gray-500">Category: {(batch.courseId as any)?.category || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Batch Period</h4>
                            <p className="text-gray-700">{formatDate(batch.startDate)} - {formatDate(batch.endDate)}</p>
                            <p className="text-sm text-gray-500">Duration: {batch.durationInDays} days</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Registration Period</h4>
                            <p className="text-gray-700">{formatDate(batch.registrationStartDate)} - {formatDate(batch.registrationEndDate)}</p>
                            <p className="text-sm text-gray-500">
                              {batch.allowLateRegistration ? 'Late registration allowed' : 'Late registration not allowed'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Users className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Enrollment</h4>
                            <p className="text-gray-700">{batch.enrollmentCount} / {batch.maxStudents}</p>
                            <p className="text-sm text-gray-500">{batch.availableSpots} spots available</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <DollarSign className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Price</h4>
                            <p className="text-gray-700">{batch.price} {batch.currency}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Info className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Status</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${batchService.getBatchStatusColor(batch.status)}`}>
                              {batch.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 flex items-center mb-3">
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        Time Slots
                      </h4>
                      
                      {batch.timeSlots && batch.timeSlots.length > 0 ? (
                        <div className="space-y-2">
                          {batch.timeSlots.map((slot, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                              <div>
                                <p className="text-gray-900 font-medium">{formatDate(slot.date)}</p>
                                <p className="text-gray-600 text-sm">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </p>
                              </div>
                              <div className="text-sm text-gray-500">
                                {slot.duration} minutes
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No time slots defined</p>
                      )}
                    </div>
                    
                    <div className="border-t pt-4 text-sm text-gray-500">
                      <p>Created by: {typeof batch.createdBy === 'object' ? `${batch.createdBy.firstName} ${batch.createdBy.lastName}` : 'Unknown'}</p>
                      <p>Created on: {new Date(batch.createdAt).toLocaleString()}</p>
                      <p>Last updated: {new Date(batch.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t bg-gray-50">
          {isEditing ? (
            <>
              <button onClick={handleCancelEdit} className="btn-secondary mr-2">Cancel</button>
              <button onClick={handleUpdate} className="btn-primary" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button onClick={onClose} className="btn-secondary">Close</button>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                <p className="py-4">Are you sure you want to delete this batch? This cannot be undone.</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary" disabled={isDeleting}>Cancel</button>
                    <button onClick={handleDelete} className="btn-danger" disabled={isDeleting}>
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BatchDetailModal;
