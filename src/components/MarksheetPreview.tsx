import React from 'react';
import MarksheetTemplate from './MarksheetTemplate';

// Test component to preview marksheet template
const MarksheetPreview: React.FC = () => {
  const testMarksheetData = {
    marksheetNumber: 'MS2412001',
    student: {
      firstName: 'John',
      lastName: 'Doe',
      studentId: 'STU123456',
      dateOfBirth: '1996-06-28',
      email: 'john.doe@example.com',
      department: 'Computer Science',
      year: '2024'
    },
    course: {
      title: 'Certificate in Information Technology',
      category: 'Information Technology',
      duration: '1 Year'
    },
    batch: {
      name: 'IT Batch 2024-01',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    academicYear: '2024-25',
    semester: '1st',
    examinationType: 'Regular',
    subjects: [
      {
        subjectName: 'Network Security Concepts',
        subjectCode: 'NSC101',
        credits: 4,
        marksObtained: 13,
        maxMarks: 20,
        grade: 'C',
        gradePoints: 6.5
      },
      {
        subjectName: 'Network Infrastructure',
        subjectCode: 'NI102',
        credits: 4,
        marksObtained: 16,
        maxMarks: 20,
        grade: 'A',
        gradePoints: 8.0
      },
      {
        subjectName: 'Window & Linux Troubleshoot',
        subjectCode: 'WLT103',
        credits: 4,
        marksObtained: 14,
        maxMarks: 20,
        grade: 'C+',
        gradePoints: 7.0
      },
      {
        subjectName: 'Software Troubleshoot',
        subjectCode: 'ST104',
        credits: 4,
        marksObtained: 15,
        maxMarks: 20,
        grade: 'B+',
        gradePoints: 7.5
      },
      {
        subjectName: 'Java',
        subjectCode: 'JAVA105',
        credits: 4,
        marksObtained: 12,
        maxMarks: 20,
        grade: 'C',
        gradePoints: 6.0
      }
    ],
    totalMarks: 70,
    maxTotalMarks: 100,
    percentage: 70.0,
    cgpa: 7.0,
    overallGrade: 'A',
    result: 'PASS',
    examinationDate: '2024-12-15',
    resultDate: '2024-12-20',
    remarks: 'Excellent performance',
    verificationCode: 'VERIFYABC123',
    isVerified: true
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h2>Marksheet Template Preview</h2>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <MarksheetTemplate marksheetData={testMarksheetData} />
      </div>
    </div>
  );
};

export default MarksheetPreview;
