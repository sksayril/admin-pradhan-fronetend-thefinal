import React, { useEffect, useState } from 'react';

interface CertificateTemplateProps {
  certificateData: {
    certificateNumber: string;
    certificateType: string;
    certificateTitle: string;
    academicYear: string;
    grade: string;
    percentage: number;
    cgpa: number;
    status: string;
    certificateIssueDate: string;
    student: {
      _id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      studentId: string;
      email: string;
      department: string;
      year: string;
    };
    course: {
      _id: string;
      title: string;
      category: string;
      instructor: {
        name: string;
        email: string;
        bio: string;
      };
      duration: number;
    };
    batch: {
      _id: string;
      name: string;
      startDate: string;
      endDate: string;
      maxStudents: number;
    };
    description?: string;
    achievements?: Array<{
      _id: string;
      title: string;
      description: string;
      date: string;
    }>;
    deliveryAddress?: {
      country: string;
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  };
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ certificateData }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrcode = await import('qrcode');
        const qrData = {
          certificateNumber: certificateData.certificateNumber,
          studentId: certificateData.student.studentId,
          studentName: certificateData.student.fullName,
          course: certificateData.course.title,
          grade: certificateData.grade,
          issueDate: certificateData.certificateIssueDate,
          verificationCode: `CERT${certificateData.certificateNumber}`
        };
        
        const dataUrl = await qrcode.toDataURL(JSON.stringify(qrData), {
          width: 100,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [certificateData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDuration = (duration: number) => {
    return `${duration} ${duration === 1 ? 'Day' : 'Days'}`;
  };

  return (
    <div className="certificate-template">
      <style>{`
        .certificate-template {
          width: 210mm;
          min-height: 297mm;
          background: white;
          position: relative;
          font-family: 'Times New Roman', serif;
          color: #000;
          border: 3px solid #1e40af;
          box-sizing: border-box;
          overflow: visible;
          margin: 0;
          padding: 0;
        }

        .certificate-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.1;
          z-index: 1;
          pointer-events: none;
        }

        .watermark-logo {
          width: 200px;
          height: 200px;
          object-fit: contain;
        }

        .certificate-content {
          position: relative;
          z-index: 2;
          padding: 15mm;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .certificate-header {
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 2px solid #1e40af;
          padding-bottom: 10px;
        }

        .foundation-name {
          font-size: 24px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .registration-details {
          font-size: 10px;
          color: #374151;
          line-height: 1.3;
          margin-bottom: 5px;
        }

        .certificate-title {
          text-align: center;
          margin: 20px 0;
        }

        .main-title {
          font-size: 32px;
          font-weight: bold;
          color: #dc2626;
          text-transform: uppercase;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }

        .subtitle {
          font-size: 18px;
          color: #374151;
          font-style: italic;
        }


        .certificate-body {
          flex: 1;
          text-align: center;
          line-height: 1.6;
          max-width: 500px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .certificate-text {
          font-size: 16px;
          margin: 15px 0;
          text-align: center;
        }

        .student-name {
          font-weight: bold;
          text-decoration: underline;
          color: #1e40af;
        }

        .course-details {
          margin: 15px 0;
          font-size: 16px;
        }

        .course-name {
          font-weight: bold;
          text-decoration: underline;
          color: #1e40af;
        }

        .course-info {
          margin: 15px 0;
          font-size: 14px;
        }

        .grade-info {
          font-weight: bold;
          color: #dc2626;
        }

        .motto {
          margin: 20px 0;
          font-size: 16px;
          font-style: italic;
          color: #1e40af;
          text-align: center;
        }

        .certificate-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid #d1d5db;
        }

        .logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo-container {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }

        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-text {
          font-size: 12px;
          font-weight: bold;
          color: #1e40af;
        }

        .certificate-number {
          font-size: 10px;
          color: #6b7280;
          margin-top: 5px;
        }

        .qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .qr-code {
          width: 80px;
          height: 80px;
          border: 1px solid #d1d5db;
          margin-bottom: 5px;
        }

        .qr-text {
          font-size: 8px;
          color: #6b7280;
          text-align: center;
        }

        .signature-section {
          text-align: center;
        }

        .signature-line {
          border-bottom: 1px solid #000;
          width: 150px;
          margin: 0 auto 5px;
        }

        .signature-text {
          font-size: 12px;
          color: #374151;
        }

        .government-logos {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #d1d5db;
        }

        .gov-logo {
          width: 60px;
          height: 60px;
          border: 1px solid #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          color: #6b7280;
          text-align: center;
        }

        @media print {
          .certificate-template {
            margin: 0;
            border: none;
            box-shadow: none;
          }
          
          .certificate-content {
            padding: 15mm;
          }
        }
      `}</style>

      {/* Watermark */}
      <div className="certificate-watermark">
        <img 
          src="/prdhanlogo.png" 
          alt="PETF Logo" 
          className="watermark-logo"
          onLoad={() => console.log('Watermark logo loaded')}
          onError={() => console.log('Watermark logo failed to load')}
        />
      </div>

      <div className="certificate-content">
        {/* Header */}
        <div className="certificate-header">
          <div className="foundation-name">
            Phoolmati Devi Educational & Training Foundation
          </div>
          <div className="registration-details">
            MINISTRY OF CORPORATE AFFAIRS (GOVT. OF INDIA)<br />
            GOVT. REG.U85500DL2024NPL432240<br />
            REGD. ADDRESS: G-36,A\5,KH NO. 22/18 & 23 LAXMI PARK, NANGLOI NEW DELHI 110041
          </div>
        </div>

        {/* Title */}
        <div className="certificate-title">
          <div className="main-title">Certificate of Course Completion</div>
          <div className="subtitle">This is to certify that</div>
        </div>

        {/* Main Certificate Content */}
        <div className="certificate-body">
          <div className="certificate-text">
            This is certified that Mr/Mrs <span className="student-name">{certificateData.student.fullName}</span><br />
            Father name Mr. <span className="student-name">{certificateData.student.firstName} Singh</span><br />
            Mother name Mrs <span className="student-name">{certificateData.student.lastName} Devi</span><br />
            Has successfully completed the course
          </div>

          <div className="course-details">
            <span className="course-name">{certificateData.course.title}</span><br />
            from Our foundation / institute.
          </div>

          <div className="course-info">
            Duration of course is <span className="grade-info">{formatDuration(certificateData.course.duration)}</span>.<br />
            Grade <span className="grade-info">{certificateData.grade}</span>.<br />
            Certificate issued year <span className="grade-info">{formatDate(certificateData.certificateIssueDate)}</span><br />
            And Enroll No. <span className="grade-info">{certificateData.student.studentId}</span>
          </div>

          <div className="motto">
            I wish you all the success, happiness and Bright Future.
          </div>
        </div>

        {/* Footer */}
        <div className="certificate-footer">
          <div className="logo-section">
            <div className="logo-container">
              <img 
                src="/prdhanlogo.png" 
                alt="PETF Logo" 
                className="logo-image"
                onLoad={() => console.log('Logo loaded')}
                onError={() => console.log('Logo failed to load')}
              />
            </div>
            <div className="logo-text">PETF</div>
            <div className="certificate-number">Certificate No. {certificateData.certificateNumber}</div>
          </div>

          <div className="qr-section">
            {qrCodeDataUrl ? (
              <img src={qrCodeDataUrl} alt="QR Code" className="qr-code" />
            ) : (
              <div className="qr-code" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                QR Code
              </div>
            )}
            <div className="qr-text">Verification Code</div>
          </div>

          <div className="signature-section">
            <div className="signature-line"></div>
            <div className="signature-text">SEAL & SIGN</div>
          </div>
        </div>

        {/* Government Logos */}
        <div className="government-logos">
          <div className="gov-logo">
            Ashoka Chakra<br />
            नीति आयोग<br />
            NGO DARPAN
          </div>
          <div className="gov-logo">
            M<br />
            MINISTRY OF<br />
            CORPORATE AFFAIRS<br />
            GOVERNMENT OF INDIA
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
