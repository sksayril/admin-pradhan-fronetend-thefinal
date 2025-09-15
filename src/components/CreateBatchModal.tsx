import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Plus, Trash2, DollarSign, Users, Info, AlertTriangle } from 'lucide-react';
import { CreateBatchRequest, Course } from '../services/types';
import './CreateBatchModal.css';

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (batchData: CreateBatchRequest) => Promise<void>;
  courses: Course[];
  loading?: boolean;
}

const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courses,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateBatchRequest>({
    name: '',
    description: '',
    courseId: '',
    timeSlots: [{ date: '', startTime: '', endTime: '' }],
    maxStudents: 30,
    price: 0,
    currency: 'INR',
    startDate: '',
    endDate: '',
    registrationStartDate: '',
    registrationEndDate: '',
    allowLateRegistration: false,
  });

  const [errors, setErrors] = useState<Record<string, any>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (courses.length > 0) {
      setFormData(prev => ({ ...prev, courseId: courses[0]._id }));
    }
  }, [courses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | boolean = value;
    if (type === 'checkbox') {
        processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
        processedValue = Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleTimeSlotChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [name]: value };
    setFormData(prev => ({ ...prev, timeSlots: newTimeSlots }));

    if (errors.timeSlots?.[index]?.[name]) {
        const newTimeSlotErrors = [...(errors.timeSlots || [])];
        if (newTimeSlotErrors[index]) {
            delete newTimeSlotErrors[index][name];
            if (Object.keys(newTimeSlotErrors[index]).length === 0) {
                newTimeSlotErrors.splice(index, 1);
            }
        }
        setErrors(prev => ({ ...prev, timeSlots: newTimeSlotErrors.length > 0 ? newTimeSlotErrors : null }));
    }
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { date: '', startTime: '', endTime: '' }],
    }));
  };

  const removeTimeSlot = (index: number) => {
    if (formData.timeSlots.length > 1) {
      const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, timeSlots: newTimeSlots }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, any> = {};

    if (!formData.name.trim()) newErrors.name = 'Batch name is required';
    if (!formData.courseId) newErrors.courseId = 'Course selection is required';
    if (formData.maxStudents <= 0) newErrors.maxStudents = 'Max students must be positive';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.endDate < formData.startDate) newErrors.endDate = 'End date cannot be before start date';

    const timeSlotErrors: Record<string, any>[] = [];
    formData.timeSlots.forEach((slot, index) => {
        const slotError: Record<string, string> = {};
        if (!slot.date) slotError.date = 'Date is required';
        if (!slot.startTime) slotError.startTime = 'Start time is required';
        if (!slot.endTime) slotError.endTime = 'End time is required';
        if (slot.endTime <= slot.startTime) slotError.endTime = 'End time must be after start time';
        
        if (Object.keys(slotError).length > 0) {
            timeSlotErrors[index] = slotError;
        }
    });

    if (timeSlotErrors.length > 0) {
        newErrors.timeSlots = timeSlotErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setApiError(null);
      await onSubmit(formData);
      handleClose();
    } catch (error: any) {
      console.error('Error creating batch:', error);
      setApiError(error.message || 'Failed to create batch. Please try again.');
    }
  };

  const handleClose = () => {
    setFormData({
        name: '',
        description: '',
        courseId: courses.length > 0 ? courses[0]._id : '',
        timeSlots: [{ date: '', startTime: '', endTime: '' }],
        maxStudents: 30,
        price: 0,
        currency: 'INR',
        startDate: '',
        endDate: '',
        registrationStartDate: '',
        registrationEndDate: '',
        allowLateRegistration: false,
    });
    setErrors({});
    setApiError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[50] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Batch</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" disabled={loading}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{apiError}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                <Info className="w-5 h-5 mr-2" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full input ${errors.name ? 'input-error' : ''}`} />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                  <select name="courseId" value={formData.courseId} onChange={handleInputChange} className={`w-full input ${errors.courseId ? 'input-error' : ''}`}>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                  {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="w-full input" />
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                <Calendar className="w-5 h-5 mr-2" /> Dates & Registration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={`w-full input ${errors.startDate ? 'input-error' : ''}`} />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className={`w-full input ${errors.endDate ? 'input-error' : ''}`} />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Start</label>
                    <input type="date" name="registrationStartDate" value={formData.registrationStartDate} onChange={handleInputChange} className="w-full input" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration End</label>
                    <input type="date" name="registrationEndDate" value={formData.registrationEndDate} onChange={handleInputChange} className="w-full input" />
                </div>
              </div>
               <div className="mt-4">
                  <label className="flex items-center">
                    <input type="checkbox" name="allowLateRegistration" checked={formData.allowLateRegistration} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Allow Late Registration</span>
                  </label>
                </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                <Clock className="w-5 h-5 mr-2" /> Time Slots
              </h3>
              <div className="space-y-3">
                {formData.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <div>
                        <input type="date" name="date" value={slot.date} onChange={(e) => handleTimeSlotChange(index, e)} className={`w-full input text-sm ${errors.timeSlots?.[index]?.date ? 'input-error' : ''}`} />
                      </div>
                      <div>
                        <input type="time" name="startTime" value={slot.startTime} onChange={(e) => handleTimeSlotChange(index, e)} className={`w-full input text-sm ${errors.timeSlots?.[index]?.startTime ? 'input-error' : ''}`} />
                      </div>
                      <div>
                        <input type="time" name="endTime" value={slot.endTime} onChange={(e) => handleTimeSlotChange(index, e)} className={`w-full input text-sm ${errors.timeSlots?.[index]?.endTime ? 'input-error' : ''}`} />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeTimeSlot(index)} disabled={formData.timeSlots.length <= 1} className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addTimeSlot} className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800">
                <Plus className="w-4 h-4 mr-1" /> Add Time Slot
              </button>
            </section>

            <section>
              <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                <DollarSign className="w-5 h-5 mr-2" /> Pricing & Capacity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" className={`w-full input ${errors.price ? 'input-error' : ''}`} />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Students *</label>
                  <input type="number" name="maxStudents" value={formData.maxStudents} onChange={handleInputChange} min="1" className={`w-full input ${errors.maxStudents ? 'input-error' : ''}`} />
                  {errors.maxStudents && <p className="text-red-500 text-sm mt-1">{errors.maxStudents}</p>}
                </div>
              </div>
            </section>
          </div>
        </form>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-white flex-shrink-0">
          <button type="button" onClick={handleClose} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Batch'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBatchModal;
