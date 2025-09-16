import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, AlertCircle, User, BookOpen, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { marksheetService } from '../services';
import { EnhancedStudent, CreateMarksheetRequest, Subject } from '../services/types';

interface GenerateMarksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: EnhancedStudent | null;
  onSuccess?: () => void;
}

const GenerateMarksheetModal: React.FC<GenerateMarksheetModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateMarksheetRequest>({
    studentId: '',
    courseId: '',
    batchId: '',
    academicYear: '',
    semester: '',
    examinationType: 'Regular',
    subjects: [
      {
        subjectName: '',
        subjectCode: '',
        credits: 0,
        marksObtained: 0,
        maxMarks: 100,
        grade: '',
        gradePoints: 0
      }
    ],
    examinationDate: '',
    resultDate: '',
    remarks: ''
  });

  // Get available courses and batches from student enrollments
  const getAvailableCourses = () => {
    if (!student?.enrollments) return [];
    return student.enrollments.map(enrollment => ({
      _id: enrollment.course.id,
      title: enrollment.course.title,
      category: enrollment.course.category,
      type: enrollment.course.type,
      instructor: {
        name: enrollment.course.instructor.name,
        email: enrollment.course.instructor.email,
        phone: enrollment.course.instructor.phone,
        bio: enrollment.course.instructor.bio
      },
      duration: enrollment.course.duration,
      durationUnit: enrollment.course.durationUnit,
      price: enrollment.course.price,
      currency: enrollment.course.currency
    }));
  };

  const getAvailableBatches = (courseId: string) => {
    if (!student?.enrollments) return [];
    return student.enrollments
      .filter(enrollment => enrollment.course.id === courseId)
      .map(enrollment => ({
        _id: enrollment.batch.id,
        name: enrollment.batch.name,
        startDate: enrollment.batch.startDate,
        endDate: enrollment.batch.endDate,
        maxStudents: enrollment.batch.maxStudents,
        price: enrollment.batch.price,
        currency: enrollment.batch.currency,
        timeSlots: enrollment.batch.timeSlots
      }));
  };

  // Set student ID when student changes
  useEffect(() => {
    if (student) {
      setFormData(prev => ({
        ...prev,
        studentId: student._id
      }));
      
      // If student has enrollments, pre-populate course and batch if there's only one
      if (student.enrollments && student.enrollments.length === 1) {
        const enrollment = student.enrollments[0];
        setFormData(prev => ({
          ...prev,
          courseId: enrollment.course.id,
          batchId: enrollment.batch.id
        }));
      }
    }
  }, [student]);

  // Reset batch when course changes
  useEffect(() => {
    if (formData.courseId) {
      const availableBatches = getAvailableBatches(formData.courseId);
      // If there's only one batch for the selected course, auto-select it
      if (availableBatches.length === 1) {
        setFormData(prev => ({
          ...prev,
          batchId: availableBatches[0]._id
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          batchId: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        batchId: ''
      }));
    }
  }, [formData.courseId]);


  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubjectChange = (index: number, field: keyof Subject, value: any) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = {
      ...newSubjects[index],
      [field]: value
    };

    // Auto-calculate grade and grade points based on marks
    if (field === 'marksObtained' || field === 'maxMarks') {
      const marksObtained = field === 'marksObtained' ? value : newSubjects[index].marksObtained;
      const maxMarks = field === 'maxMarks' ? value : newSubjects[index].maxMarks;
      
      if (marksObtained && maxMarks && maxMarks > 0) {
        const percentage = (marksObtained / maxMarks) * 100;
        const { grade, gradePoints } = marksheetService.calculateGrade(percentage);
        newSubjects[index].grade = grade;
        newSubjects[index].gradePoints = gradePoints;
      }
    }

    setFormData(prev => ({
      ...prev,
      subjects: newSubjects
    }));
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        {
          subjectName: '',
          subjectCode: '',
          credits: 0,
          marksObtained: 0,
          maxMarks: 100,
          grade: '',
          gradePoints: 0
        }
      ]
    }));
  };

  const removeSubject = (index: number) => {
    if (formData.subjects.length > 1) {
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Check if student has enrollments
    if (!student?.enrollments || student.enrollments.length === 0) {
      newErrors.enrollments = 'Student must have at least one enrollment to generate marksheet';
    }

    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.batchId) newErrors.batchId = 'Batch is required';
    if (!formData.academicYear) newErrors.academicYear = 'Academic year is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.examinationDate) newErrors.examinationDate = 'Examination date is required';
    if (!formData.resultDate) newErrors.resultDate = 'Result date is required';

    // Validate subjects
    formData.subjects.forEach((subject, index) => {
      if (!subject.subjectName) newErrors[`subject_${index}_name`] = 'Subject name is required';
      if (!subject.subjectCode) newErrors[`subject_${index}_code`] = 'Subject code is required';
      if (subject.credits <= 0) newErrors[`subject_${index}_credits`] = 'Credits must be greater than 0';
      if (subject.marksObtained < 0) newErrors[`subject_${index}_marks`] = 'Marks cannot be negative';
      if (subject.maxMarks <= 0) newErrors[`subject_${index}_maxMarks`] = 'Max marks must be greater than 0';
      if (subject.marksObtained > subject.maxMarks) newErrors[`subject_${index}_marks`] = 'Marks cannot exceed max marks';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const response = await marksheetService.createMarksheet(formData);
      
      if (response.success) {
        toast.success('🎉 Marksheet generated successfully!', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '14px',
          },
        });
        
        onSuccess?.();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to generate marksheet');
      }
    } catch (error) {
      console.error('Error generating marksheet:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`❌ Failed to generate marksheet: ${errorMessage}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '14px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // Basic validation for draft save (only required fields)
    if (!formData.studentId || !formData.courseId || !formData.batchId) {
      toast.error('Please fill in the basic information (Student, Course, Batch)');
      return;
    }

    setLoading(true);
    try {
      // Create a draft version of the marksheet data
      const draftData = {
        ...formData,
        status: 'draft' // Mark as draft
      };

      const response = await marksheetService.createMarksheet(draftData);
      
      if (response.success) {
        toast.success('💾 Marksheet saved as draft!', {
          duration: 3000,
          style: {
            background: '#3B82F6',
            color: '#fff',
            fontSize: '14px',
          },
        });
        
        onSuccess?.();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`❌ Failed to save draft: ${errorMessage}`, {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '14px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      studentId: '',
      courseId: '',
      batchId: '',
      academicYear: '',
      semester: '',
      examinationType: 'Regular',
      subjects: [
        {
          subjectName: '',
          subjectCode: '',
          credits: 0,
          marksObtained: 0,
          maxMarks: 100,
          grade: '',
          gradePoints: 0
        }
      ],
      examinationDate: '',
      resultDate: '',
      remarks: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Generate Marksheet</h2>
              <p className="text-sm text-gray-600">Create marksheet for {student.firstName} {student.lastName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Student Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Student Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{student.studentId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded border">{student.firstName} {student.lastName}</p>
              </div>
            </div>
            
            {/* Enrollment Information */}
            {student.enrollments && student.enrollments.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Enrollments for Marksheet Generation</h4>
                <div className="space-y-2">
                  {student.enrollments.map((enrollment, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{enrollment.course.title}</p>
                          <p className="text-sm text-gray-600">Batch: {enrollment.batch.name}</p>
                          <p className="text-xs text-gray-500">
                            Status: <span className={`px-2 py-1 rounded text-xs ${
                              enrollment.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                              enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Progress: {enrollment.progress.overallProgress}%
                          </p>
                          <p className="text-xs text-gray-500">
                            Payment: <span className={`px-2 py-1 rounded text-xs ${
                              enrollment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                              enrollment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.paymentStatus}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">No Enrollments Found</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      This student has no course enrollments. Please enroll the student in a course before generating a marksheet.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Course and Batch Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => handleInputChange('courseId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.courseId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!student?.enrollments || student.enrollments.length === 0}
              >
                <option value="">Select Course</option>
                {getAvailableCourses().map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title} - {course.category}
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.courseId}
                </p>
              )}
              {(!student?.enrollments || student.enrollments.length === 0) && (
                <p className="text-yellow-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  No enrollments found for this student
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.batchId}
                onChange={(e) => handleInputChange('batchId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.batchId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={!formData.courseId}
              >
                <option value="">Select Batch</option>
                {getAvailableBatches(formData.courseId).map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                  </option>
                ))}
              </select>
              {errors.batchId && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.batchId}
                </p>
              )}
              {formData.courseId && getAvailableBatches(formData.courseId).length === 0 && (
                <p className="text-yellow-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  No batches found for the selected course
                </p>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => handleInputChange('academicYear', e.target.value)}
                placeholder="e.g., 2024-25"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.academicYear ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.academicYear && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.academicYear}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleInputChange('semester', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.semester ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="3rd">3rd Semester</option>
                <option value="4th">4th Semester</option>
                <option value="5th">5th Semester</option>
                <option value="6th">6th Semester</option>
                <option value="7th">7th Semester</option>
                <option value="8th">8th Semester</option>
              </select>
              {errors.semester && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.semester}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Examination Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.examinationType}
                onChange={(e) => handleInputChange('examinationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Regular">Regular</option>
                <option value="Supplementary">Supplementary</option>
                <option value="Improvement">Improvement</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Examination Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.examinationDate}
                onChange={(e) => handleInputChange('examinationDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.examinationDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.examinationDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.examinationDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Result Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.resultDate}
                onChange={(e) => handleInputChange('resultDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.resultDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.resultDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.resultDate}
                </p>
              )}
            </div>
          </div>

          {/* Subjects */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Subjects</h3>
              </div>
              <button
                type="button"
                onClick={addSubject}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Subject</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.subjects.map((subject, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Subject {index + 1}</h4>
                    {formData.subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={subject.subjectName}
                        onChange={(e) => handleSubjectChange(index, 'subjectName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`subject_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`subject_${index}_name`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`subject_${index}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={subject.subjectCode}
                        onChange={(e) => handleSubjectChange(index, 'subjectCode', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`subject_${index}_code`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`subject_${index}_code`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`subject_${index}_code`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credits <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={subject.credits}
                        onChange={(e) => handleSubjectChange(index, 'credits', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`subject_${index}_credits`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`subject_${index}_credits`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`subject_${index}_credits`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Marks <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={subject.maxMarks}
                        onChange={(e) => handleSubjectChange(index, 'maxMarks', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`subject_${index}_maxMarks`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`subject_${index}_maxMarks`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`subject_${index}_maxMarks`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marks Obtained <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={subject.maxMarks}
                        value={subject.marksObtained}
                        onChange={(e) => handleSubjectChange(index, 'marksObtained', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`subject_${index}_marks`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`subject_${index}_marks`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`subject_${index}_marks`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                      <input
                        type="text"
                        value={subject.grade}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade Points</label>
                      <input
                        type="number"
                        value={subject.gradePoints}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                      <input
                        type="number"
                        value={subject.maxMarks > 0 ? ((subject.marksObtained / subject.maxMarks) * 100).toFixed(2) : 0}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              rows={3}
              placeholder="Enter any remarks or comments..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Marksheet Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Subjects</p>
                <p className="text-lg font-semibold text-gray-800">{formData.subjects.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formData.subjects.reduce((sum, subject) => sum + subject.marksObtained, 0)} / {formData.subjects.reduce((sum, subject) => sum + subject.maxMarks, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Percentage</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formData.subjects.reduce((sum, subject) => sum + subject.maxMarks, 0) > 0 
                    ? ((formData.subjects.reduce((sum, subject) => sum + subject.marksObtained, 0) / formData.subjects.reduce((sum, subject) => sum + subject.maxMarks, 0)) * 100).toFixed(2)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Floating Action Buttons - Always Visible */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-10">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading || !student?.enrollments || student.enrollments.length === 0}
            className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full shadow-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save Draft"
          >
            <Save className="w-5 h-5" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !student?.enrollments || student.enrollments.length === 0}
            className="px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Generate Marksheet"
          >
            <Save className="w-5 h-5" />
            <span className="hidden sm:inline">Generate</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading || !student?.enrollments || student.enrollments.length === 0}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </>
            )}
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !student?.enrollments || student.enrollments.length === 0}
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Generate Marksheet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateMarksheetModal;
