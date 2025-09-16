import React, { useState, useEffect } from 'react';

// Dynamic import for QRCode to handle potential loading issues
let QRCode: any = null;
try {
  QRCode = require('qrcode');
} catch (error) {
  console.warn('QRCode package not available, using fallback');
}

interface MarksheetTemplateProps {
  marksheetData: {
    marksheetNumber: string;
    student: {
      firstName: string;
      lastName: string;
      studentId: string;
      dateOfBirth?: string;
      email: string;
      department?: string;
      year?: string;
    };
    course: {
      title: string;
      category: string;
      duration: string;
    };
    batch: {
      name: string;
      startDate: string;
      endDate: string;
    };
    academicYear: string;
    semester: string;
    examinationType: string;
    subjects: Array<{
      subjectName: string;
      subjectCode: string;
      credits: number;
      marksObtained: number;
      maxMarks: number;
      grade: string;
      gradePoints: number;
    }>;
    totalMarks: number;
    maxTotalMarks: number;
    percentage: number;
    cgpa: number;
    overallGrade: string;
    result: string;
    examinationDate: string;
    resultDate: string;
    remarks?: string;
    verificationCode: string;
    isVerified: boolean;
  };
}

const MarksheetTemplate: React.FC<MarksheetTemplateProps> = ({ marksheetData }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');

  useEffect(() => {
    // Generate QR code based on student ID and marksheet number
    const generateQRCode = async () => {
      try {
        if (!QRCode) {
          console.warn('QRCode not available, using fallback');
          setQrCodeDataURL(''); // Will show fallback text
          return;
        }

        const qrData = {
          studentId: marksheetData.student.studentId,
          marksheetNumber: marksheetData.marksheetNumber,
          studentName: `${marksheetData.student.firstName} ${marksheetData.student.lastName}`,
          course: marksheetData.course.title,
          percentage: marksheetData.percentage,
          grade: marksheetData.overallGrade,
          result: marksheetData.result,
          verificationCode: marksheetData.verificationCode,
          issueDate: marksheetData.resultDate
        };

        const qrString = JSON.stringify(qrData);
        const qrCodeURL = await QRCode.toDataURL(qrString, {
          width: 80,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataURL(qrCodeURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
        setQrCodeDataURL(''); // Will show fallback text
      }
    };

    generateQRCode();
  }, [marksheetData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPerformanceIndicator = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding';
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 70) return 'Very Good';
    if (percentage >= 60) return 'Good';
    if (percentage >= 50) return 'Satisfactory';
    return 'Marginal';
  };

  return (
    <div className="marksheet-template">
      {/* Decorative Border */}
      <div className="decorative-border"></div>

      {/* Watermark */}
      <div className="marksheet-watermark">
        <img 
          src="/prdhanlogo.png" 
          alt="PETF Logo" 
          onLoad={() => console.log('PETF logo loaded successfully')}
          onError={(e) => {
            console.error('Failed to load PETF logo:', e);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.innerHTML = 'PETF';
            fallback.className = 'watermark-fallback';
            target.parentNode?.appendChild(fallback);
          }}
        />
      </div>

      {/* Content */}
      <div className="marksheet-content">
        {/* Header */}
        <div className="marksheet-header">
          <h1 className="marksheet-title">
            Phoolmati Devi Educational & Training Foundation
          </h1>
          
          <div className="registration-details">
            <div>MINISTRY OF CORPORATE AFFAIRS (GOVT. OF INDIA) GOVT. REG.NO.: U85500DL2024NPL432240</div>
            <div>REG. ADDRESS: G-36,A\5,KH NO. 22/18 & 23 LAXMI PARK, NANGLOI NEW DELHI 110041</div>
          </div>

          <h2 className="marksheet-subtitle">Marksheet</h2>
        </div>

        {/* Top Section with QR Code, Logo, and Enrollment */}
        <div className="top-section">
          {/* Left - QR Code */}
          <div className="qr-section">
            <div className="qr-container">
              {qrCodeDataURL ? (
                <img src={qrCodeDataURL} alt="QR Code" className="qr-image" />
              ) : (
                <div className="qr-fallback">
                  <div>QR CODE</div>
                  <div className="qr-student-id">{marksheetData.student.studentId}</div>
                </div>
              )}
            </div>
            <div className="qr-label">GOVT. OF INDIA</div>
          </div>

           {/* Center - Logo and Certificate Number */}
           <div className="center-section">
             <div className="logo-container">
               <img 
                 src="/prdhanlogo.png" 
                 alt="PETF Logo" 
                 className="petf-logo"
                 onLoad={() => console.log('PETF logo loaded successfully in center')}
                 onError={(e) => {
                   console.error('Failed to load PETF logo in center:', e);
                   const target = e.target as HTMLImageElement;
                   target.style.display = 'none';
                   const fallback = document.createElement('span');
                   fallback.textContent = 'PD';
                   fallback.className = 'logo-text';
                   target.parentNode?.appendChild(fallback);
                 }}
               />
             </div>
             <div className="petf-label">PETF</div>
             <div className="certificate-number">CERTIFICATE NO.{marksheetData.marksheetNumber}</div>
           </div>

          {/* Right - Enrollment Number */}
          <div className="enrollment-section">
            <div className="enrollment-container">
              <span className="enrollment-id">{marksheetData.student.studentId}</span>
            </div>
            <div className="enrollment-label">ENROLL.NO</div>
          </div>
        </div>

        {/* Student and Course Details */}
        <div className="marksheet-student-info">
          <div className="student-info-row">
            <strong>THIS MARKSHEET IS AWARDED TO :</strong> Mr. {marksheetData.student.firstName} {marksheetData.student.lastName}
          </div>
           {marksheetData.student.dateOfBirth && marksheetData.student.dateOfBirth.trim() !== '' && (
             <div className="student-info-row">
               <strong>DATE OF BIRTH :</strong> {formatDate(marksheetData.student.dateOfBirth)}
             </div>
           )}
          <div className="student-info-row">
            <strong>ON SUCCESSFULL COMPLETION OF COURSE :</strong> {marksheetData.course.title}
          </div>
           <div className="student-info-row">
             <strong>ON DURATION :</strong> {marksheetData.course.duration} {marksheetData.course.duration.includes('YEAR') || marksheetData.course.duration.includes('MONTH') || marksheetData.course.duration.includes('DAY') ? '' : 'DAYS'}
           </div>
        </div>

        {/* Subjects Table */}
        <div className="table-section">
          <table className="marksheet-table">
            <thead>
              <tr className="table-header-main">
                <th className="serial-header">S.No.</th>
                <th className="subject-header">SUBJECT OFFERED</th>
                <th className="max-header">MAX MARKS</th>
                <th className="obtained-header">MARKS OBTAINED</th>
                <th className="grade-header">GRADE</th>
              </tr>
            </thead>
            <tbody>
              {marksheetData.subjects.map((subject, index) => {
                return (
                  <tr key={index} className="subject-row">
                    <td className="serial-cell">{index + 1}</td>
                    <td className="subject-cell">{subject.subjectName}</td>
                    <td className="marks-cell">{subject.maxMarks}</td>
                    <td className="marks-cell">{subject.marksObtained}</td>
                    <td className="grade-cell">{subject.grade}</td>
                  </tr>
                );
              })}
              <tr className="total-row">
                <td className="serial-cell total-label">TOTAL</td>
                <td className="subject-cell"></td>
                <td className="marks-cell total-marks">{marksheetData.maxTotalMarks}</td>
                <td className="marks-cell grand-total">{marksheetData.totalMarks}</td>
                <td className="grade-cell overall-grade">{marksheetData.overallGrade}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="marksheet-summary">
          <div className="summary-left">
            <div className="summary-item">
              <strong>Percentage :</strong> {marksheetData.percentage.toFixed(0)} %
            </div>
            <div className="summary-item">
              <strong>Performance indicator :</strong> {getPerformanceIndicator(marksheetData.percentage)}
            </div>
            <div className="summary-item">
              <strong>Place Of Issue:</strong> Delhi
            </div>
            <div className="summary-item">
              <strong>Date Of Issue:</strong> {formatDate(marksheetData.resultDate)}
            </div>
          </div>
          
          <div className="summary-right">
            <div className="grade-display">
              <strong>Grade :</strong> {marksheetData.overallGrade}
            </div>
            
            {/* Signatures */}
            <div className="signatures">
              <div className="signature-item">
                <div className="signature-line"></div>
                <div className="signature-label">Examination Controller</div>
              </div>
              <div className="signature-item">
                <div className="signature-line"></div>
                <div className="signature-label">Signature</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="marksheet-footer">
        {/* Government Logos Row */}
        <div className="marksheet-gov-logos">
          <div className="gov-logo-item">
            <div className="gov-title">सत्यमेव जयते</div>
            <div className="gov-subtitle">MINISTRY OF CORPORATE AFFAIRS</div>
            <div className="gov-subtitle">GOVERNMENT OF INDIA</div>
          </div>
          
          <div className="gov-logo-item">
            <div className="gov-title">नीति आयोग</div>
            <div className="gov-subtitle">NGO DARPAN</div>
          </div>
          
          <div className="gov-logo-item">
            <div className="gov-title">MSME</div>
            <div className="gov-subtitle">MICRO, SMALL & MEDIUM ENTERPRISES</div>
            <div className="gov-subtitle">सूक्ष्म, लघु एवं मध्यम उद्यम</div>
            <div className="gov-subtitle">Ministry of MSME, Govt. of India</div>
          </div>
          
          <div className="gov-logo-item">
            <div className="gov-title">NATIONAL ACADEMIC DEPOSITORY</div>
            <div className="gov-subtitle">Transparency & Transformation Through Digitization</div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer">
          <div className="disclaimer-item">• Result must be show on qr code</div>
          <div className="disclaimer-item">• To be our site link in address bar</div>
          <div className="disclaimer-item">• Note for any of enquiry /verification contact or write at its administrative office only</div>
        </div>

        {/* Grade Scale */}
        <div className="marksheet-grade-scale">
          <table className="grade-scale-table">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Performance Indicator</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Outstanding</td><td>Outstanding</td></tr>
              <tr><td>Excellent</td><td>Excellent</td></tr>
              <tr><td>Very Good</td><td>Very Good</td></tr>
              <tr><td>Good</td><td>Good</td></tr>
              <tr><td>Satisfactory</td><td>Satisfactory</td></tr>
              <tr><td>Marginal</td><td>Marginal</td></tr>
            </tbody>
          </table>
        </div>
      </div>

       <style>{`
        .marksheet-template {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          position: relative;
          font-family: 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          padding: 15mm;
          box-sizing: border-box;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          page-break-inside: avoid;
          overflow: visible;
        }

        .decorative-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 8px solid;
          border-image: linear-gradient(45deg, #e91e63, #f8bbd9, #e91e63, #f8bbd9) 1;
          pointer-events: none;
          z-index: 0;
        }

        .decorative-border::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          right: 4px;
          bottom: 4px;
          border: 2px solid #e91e63;
          border-radius: 4px;
        }

        .marksheet-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.05;
          z-index: 1;
          pointer-events: none;
        }

        .marksheet-watermark img {
          width: 350px;
          height: 350px;
          object-fit: contain;
        }

        .watermark-fallback {
          width: 350px;
          height: 350px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 120px;
          font-weight: bold;
          color: rgba(233, 30, 99, 0.1);
        }

        .marksheet-content {
          position: relative;
          z-index: 2;
        }

        .marksheet-header {
          text-align: center;
          margin-bottom: 25px;
          border-bottom: 3px double #e91e63;
          padding-bottom: 15px;
        }

        .marksheet-title {
          font-size: 26px;
          font-weight: bold;
          color: #6a1b9a;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-shadow: 2px 2px 4px rgba(106, 27, 154, 0.1);
        }

        .registration-details {
          font-size: 9px;
          color: #666;
          margin-bottom: 15px;
          line-height: 1.4;
          background: linear-gradient(90deg, #f5f5f5, #ffffff, #f5f5f5);
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
        }

        .marksheet-subtitle {
          font-size: 22px;
          font-weight: bold;
          color: #6a1b9a;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .top-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
          padding: 15px 20px;
          background: linear-gradient(90deg, #fef7ff, #ffffff, #fef7ff);
          border-radius: 8px;
          border: 1px solid #e1bee7;
        }

        .qr-section, .enrollment-section {
          text-align: center;
          flex: 0 0 110px;
        }

        .center-section {
          text-align: center;
          flex: 1;
        }

        .qr-container, .enrollment-container {
          width: 85px;
          height: 85px;
          border: 2px solid #e91e63;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(233, 30, 99, 0.2);
        }

        .qr-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .qr-fallback {
          font-size: 8px;
          color: #666;
          text-align: center;
        }

        .qr-student-id {
          font-size: 6px;
          margin-top: 2px;
        }

        .enrollment-id {
          font-size: 10px;
          color: #333;
          font-weight: bold;
          word-break: break-all;
        }

         .logo-container {
           width: 85px;
           height: 85px;
           border: 2px solid #e91e63;
           border-radius: 50%;
           background: linear-gradient(135deg, #f8f8f8, #ffffff);
           display: flex;
           align-items: center;
           justify-content: center;
           margin: 0 auto 10px;
           box-shadow: 0 4px 12px rgba(233, 30, 99, 0.2);
           overflow: hidden;
         }

         .petf-logo {
           width: 100%;
           height: 100%;
           object-fit: contain;
           border-radius: 50%;
         }

         .logo-text {
           font-size: 24px;
           font-weight: bold;
           color: #6a1b9a;
           text-shadow: 1px 1px 2px rgba(106, 27, 154, 0.3);
         }

        .qr-label, .enrollment-label, .petf-label {
          font-size: 9px;
          color: #666;
          font-weight: 600;
        }

        .certificate-number {
          font-size: 9px;
          color: #666;
          margin-top: 5px;
        }

        .marksheet-student-info {
          margin-bottom: 20px;
          padding: 15px 20px;
          background: linear-gradient(90deg, #f3e5f5, #ffffff);
          border-left: 4px solid #e91e63;
          border-radius: 4px;
        }

        .student-info-row {
          margin-bottom: 10px;
          font-size: 11px;
        }

        .table-section {
          margin-bottom: 20px;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .marksheet-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          background: white;
        }

        .table-header-main th {
          background: linear-gradient(135deg, #6a1b9a, #8e24aa);
          color: white;
          font-weight: bold;
          padding: 8px 4px;
          text-align: center;
          border: 1px solid #4a148c;
        }

        .serial-header {
          width: 8%;
        }

        .subject-header {
          width: 45%;
        }

        .max-header, .obtained-header {
          width: 15%;
        }

        .grade-header {
          width: 17%;
        }

        .subject-row {
          transition: background-color 0.3s ease;
        }

        .subject-row:nth-child(even) {
          background: linear-gradient(90deg, #fafafa, #ffffff);
        }

        .subject-row:hover {
          background: linear-gradient(90deg, #f3e5f5, #fce4ec);
        }

        .serial-cell, .marks-cell, .grade-cell {
          text-align: center;
          padding: 6px 4px;
          border: 1px solid #ddd;
          font-size: 10px;
        }

        .subject-cell {
          text-align: left;
          padding: 6px 8px;
          border: 1px solid #ddd;
          font-size: 10px;
          word-wrap: break-word;
          max-width: 200px;
        }

        .total-row {
          background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
          font-weight: bold;
        }

        .total-row .total-label {
          background: #6a1b9a;
          color: white;
        }

        .grand-total {
          background: #e91e63 !important;
          color: white !important;
          font-weight: bold;
        }

        .overall-grade {
          background: #4caf50 !important;
          color: white !important;
          font-weight: bold;
        }

        .marksheet-summary {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
          padding: 15px 20px;
          background: linear-gradient(135deg, #f8f8f8, #ffffff);
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .summary-left {
          flex: 1;
          margin-right: 20px;
        }

        .summary-item {
          margin-bottom: 10px;
          font-size: 11px;
        }

        .summary-right {
          flex: 0 0 200px;
          text-align: right;
        }

        .grade-display {
          margin-bottom: 30px;
          font-size: 14px;
          padding: 10px;
          background: linear-gradient(135deg, #e91e63, #f06292);
          color: white;
          border-radius: 6px;
          text-align: center;
        }

        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }

        .signature-item {
          text-align: center;
          flex: 1;
          margin: 0 10px;
        }

        .signature-line {
          border-bottom: 2px solid #333;
          width: 80px;
          margin: 0 auto 8px;
        }

        .signature-label {
          font-size: 9px;
          color: #666;
        }

        .marksheet-footer {
          position: relative;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e91e63;
        }

        .marksheet-gov-logos {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          padding: 15px 0;
          background: linear-gradient(90deg, #f3e5f5, #ffffff, #f3e5f5);
          border-radius: 6px;
          border: 1px solid #e1bee7;
        }

        .gov-logo-item {
          text-align: center;
          flex: 1;
          padding: 0 10px;
        }

        .gov-title {
          font-size: 10px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #6a1b9a;
        }

        .gov-subtitle {
          font-size: 7px;
          color: #666;
          margin-bottom: 2px;
        }

        .disclaimer {
          margin-bottom: 15px;
          padding: 10px;
          background: #fff3e0;
          border-left: 4px solid #ff9800;
          border-radius: 4px;
        }

        .disclaimer-item {
          font-size: 7px;
          color: #666;
          margin-bottom: 3px;
        }

        .marksheet-grade-scale {
          margin-top: 10px;
        }

        .grade-scale-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 7px;
          border: 2px solid #6a1b9a;
          border-radius: 4px;
          overflow: hidden;
        }

        .grade-scale-table th {
          background: linear-gradient(135deg, #6a1b9a, #8e24aa);
          color: white;
          padding: 5px;
          text-align: center;
          font-weight: bold;
          border: 1px solid #4a148c;
        }

        .grade-scale-table td {
          padding: 4px;
          text-align: center;
          border: 1px solid #ddd;
          background: white;
        }

        .grade-scale-table tbody tr:nth-child(even) td {
          background: #f9f9f9;
        }

        @media print {
          .marksheet-template {
            margin: 0 !important;
            padding: 10mm !important;
            box-shadow: none !important;
            background: white !important;
            page-break-inside: auto;
          }

          .marksheet-header {
            page-break-after: avoid;
          }

          .table-section {
            page-break-inside: avoid;
          }

          .marksheet-summary {
            page-break-before: avoid;
          }

          .marksheet-footer {
            page-break-before: avoid;
          }

          @page {
            size: A4;
            margin: 10mm;
          }
        }

        @media (max-width: 768px) {
          .marksheet-template {
            width: 100% !important;
            min-height: auto !important;
            padding: 15px !important;
          }

          .top-section {
            flex-direction: column;
            gap: 15px;
            align-items: center;
          }

          .marksheet-summary {
            flex-direction: column;
            gap: 20px;
          }

          .marksheet-gov-logos {
            flex-direction: column;
            gap: 15px;
          }

          .signatures {
            flex-direction: column;
            gap: 20px;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MarksheetTemplate;