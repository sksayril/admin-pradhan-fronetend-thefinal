import { forwardRef, useImperativeHandle, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CertificateTemplate from './CertificateTemplate';

interface CertificatePDFGeneratorProps {
  certificateData: any;
  onBeforePrint?: () => void;
  onAfterPrint?: () => void;
}

export interface CertificatePDFGeneratorRef {
  downloadPDF: () => void;
  printCertificate: () => void;
}

const CertificatePDFGenerator = forwardRef<CertificatePDFGeneratorRef, CertificatePDFGeneratorProps>(
  ({ certificateData, onBeforePrint, onAfterPrint }, ref) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
      if (!componentRef.current || !certificateData) {
        console.error('Component ref or certificate data not available');
        return;
      }

      try {
        onBeforePrint?.();

        // Wait for all images to load
        const images = componentRef.current.querySelectorAll('img');
        const imagePromises = Array.from(images).map((img) => {
          return new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
              // Timeout after 3 seconds
              setTimeout(() => resolve(), 3000);
            }
          });
        });

        await Promise.all(imagePromises);

        // Add a small delay to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Component dimensions:', {
          width: componentRef.current.offsetWidth,
          height: componentRef.current.offsetHeight
        });

        const canvas = await html2canvas(componentRef.current, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: true,
          width: componentRef.current.offsetWidth,
          height: componentRef.current.offsetHeight,
          scrollX: 0,
          scrollY: 0
        });

        console.log('Canvas dimensions:', {
          width: canvas.width,
          height: canvas.height
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 5;
        const contentWidth = pdfWidth - (2 * margin);
        const contentHeight = pdfHeight - (2 * margin);

        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = margin;

        // Add first page
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;

        // Add additional pages if needed
        let pageNumber = 1;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + margin;
          pdf.addPage();
          pageNumber++;
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          heightLeft -= contentHeight;
        }

        // Add page numbers
        for (let i = 1; i <= pageNumber; i++) {
          pdf.setPage(i);
          pdf.setFontSize(8);
          pdf.text(`Page ${i}`, pdfWidth - 20, pdfHeight - 10);
        }

        const fileName = `Certificate_${certificateData.certificateNumber}_${certificateData.student.studentId}.pdf`;
        pdf.save(fileName);

        onAfterPrint?.();
        console.log('PDF generated successfully:', fileName);

      } catch (error) {
        console.error('Error generating PDF:', error);
        onAfterPrint?.();
      }
    };

    useImperativeHandle(ref, () => ({
      downloadPDF: generatePDF,
      printCertificate: generatePDF
    }));

    return (
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', zIndex: -1 }}>
        <div
          ref={componentRef}
          style={{
            width: '210mm',
            minHeight: '297mm',
            backgroundColor: 'white',
            overflow: 'visible'
          }}
        >
          <CertificateTemplate certificateData={certificateData} />
        </div>
      </div>
    );
  }
);

CertificatePDFGenerator.displayName = 'CertificatePDFGenerator';

export default CertificatePDFGenerator;
