import React, { useState } from 'react';
import { X, Award, FileText, MapPin, Calendar, User, BookOpen, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { certificateService, CertificateGenerationRequest } from '../services/certificateService';
import { EnhancedStudent } from '../services/types';

interface GenerateCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: EnhancedStudent;
  marksheetNumber: string;
  onSuccess?: () => void;
}

const GenerateCertificateModal: React.FC<GenerateCertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  marksheetNumber,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CertificateGenerationRequest>({
    certificateType: 'Completion',
    certificateTitle: '',
    description: '',
    achievements: [],
    deliveryMethod: 'Digital',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });

  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('deliveryAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress!,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addAchievement = () => {
    if (newAchievement.title && newAchievement.description && newAchievement.date) {
      setFormData(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), { ...newAchievement }]
      }));
      setNewAchievement({ title: '', description: '', date: '' });
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!marksheetNumber) {
      toast.error('Marksheet number is required');
      return;
    }

    setLoading(true);
    try {
      const response = await certificateService.generateCertificateFromMarksheet(
        marksheetNumber,
        formData
      );

      if (response.success) {
        toast.success('Certificate generated successfully!');
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || 'Failed to generate certificate');
      }
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      toast.error(error.message || 'Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Generate Certificate</h2>
              <p className="text-sm text-gray-500">Create a certificate from marksheet for {student.firstName} {student.lastName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <p className="text-sm text-gray-900">{student.firstName} {student.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <p className="text-sm text-gray-900">{student.studentId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900">{student.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <p className="text-sm text-gray-900">{student.department || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Marksheet Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Marksheet Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marksheet Number</label>
                <p className="text-sm text-gray-900 font-mono">{marksheetNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ready for Certificate Generation
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Certificate Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="certificateType" className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate Type *
                </label>
                <select
                  id="certificateType"
                  name="certificateType"
                  value={formData.certificateType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="Completion">Completion Certificate</option>
                  <option value="Achievement">Achievement Certificate</option>
                  <option value="Excellence">Excellence Certificate</option>
                  <option value="Participation">Participation Certificate</option>
                </select>
              </div>

              <div>
                <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Method *
                </label>
                <select
                  id="deliveryMethod"
                  name="deliveryMethod"
                  value={formData.deliveryMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="Digital">Digital</option>
                  <option value="Physical">Physical</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="certificateTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Title
              </label>
              <input
                type="text"
                id="certificateTitle"
                name="certificateTitle"
                value={formData.certificateTitle}
                onChange={handleInputChange}
                placeholder="e.g., Completion Certificate - Web Development"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional description for the certificate..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements (Optional)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="achievementTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Achievement Title
                </label>
                <input
                  type="text"
                  id="achievementTitle"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Top Performer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="achievementDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="achievementDate"
                  value={newAchievement.date}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addAchievement}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Achievement
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="achievementDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Achievement Description
              </label>
              <textarea
                id="achievementDescription"
                value={newAchievement.description}
                onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                placeholder="Description of the achievement..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Added Achievements */}
            {formData.achievements && formData.achievements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Added Achievements:</h4>
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                      <p className="text-xs text-gray-400">{new Date(achievement.date).toLocaleDateString()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Address (if Physical delivery) */}
          {formData.deliveryMethod === 'Physical' || formData.deliveryMethod === 'Both' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Delivery Address
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="deliveryAddress.street"
                    value={formData.deliveryAddress?.street || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="deliveryAddress.city"
                    value={formData.deliveryAddress?.city || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="deliveryAddress.state"
                    value={formData.deliveryAddress?.state || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="deliveryAddress.zipCode"
                    value={formData.deliveryAddress?.zipCode || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="deliveryAddress.country"
                    value={formData.deliveryAddress?.country || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Generate Certificate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateCertificateModal;
