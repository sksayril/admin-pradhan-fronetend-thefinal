import { useRef, forwardRef, useImperativeHandle } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import MarksheetTemplate from './MarksheetTemplate';

interface MarksheetPDFGeneratorProps {
  marksheetData: any;
  onAfterPrint?: () => Promise<void>;
  onBeforePrint?: () => Promise<void>;
}

export interface MarksheetPDFGeneratorRef {
  printMarksheet: () => void;
  downloadPDF: () => void;
}

const MarksheetPDFGenerator = forwardRef<MarksheetPDFGeneratorRef, MarksheetPDFGeneratorProps>(
  ({ marksheetData, onAfterPrint, onBeforePrint }, ref) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
      try {
        console.log('Starting PDF generation...');
        
        if (onBeforePrint) {
          await onBeforePrint();
        }

        if (!componentRef.current) {
          throw new Error('Component ref not found');
        }

        // Wait for images to load (including QR code)
        const images = componentRef.current.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map((img) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise<void>((resolve) => {
              const timeout = setTimeout(() => resolve(), 3000); // 3 second timeout
              img.onload = () => {
                clearTimeout(timeout);
                resolve();
              };
              img.onerror = () => {
                clearTimeout(timeout);
                resolve();
              };
            });
          })
        );

        // Wait a bit more for rendering
        await new Promise<void>(resolve => setTimeout(resolve, 1500));

        console.log('Component dimensions:', {
          width: componentRef.current.scrollWidth,
          height: componentRef.current.scrollHeight,
          offsetWidth: componentRef.current.offsetWidth,
          offsetHeight: componentRef.current.offsetHeight
        });

        // Generate canvas from HTML
        const canvas = await html2canvas(componentRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: componentRef.current.scrollWidth,
          height: componentRef.current.scrollHeight,
          logging: true
        });

        console.log('Canvas generated:', {
          width: canvas.width,
          height: canvas.height
        });

        // Create PDF with proper multi-page handling
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const margin = 10; // Margin in mm
        const contentHeight = pageHeight - (margin * 2); // Available content height
        
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let pageNumber = 1;

        const pdf = new jsPDF('p', 'mm', 'a4');
        let position = 0;

        // Add image to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pageNumber++;
          
          // Add page number to footer
          pdf.setFontSize(8);
          pdf.setTextColor(128, 128, 128);
          pdf.text(`Page ${pageNumber}`, imgWidth - 20, pageHeight - 5);
          
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= contentHeight;
        }

        // Add page number to first page
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text('Page 1', imgWidth - 20, pageHeight - 5);

        // Save the PDF
        const filename = `Marksheet_${marksheetData.marksheetNumber}_${marksheetData.student.studentId}.pdf`;
        pdf.save(filename);

        console.log('PDF generated successfully:', filename);

        if (onAfterPrint) {
          await onAfterPrint();
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
      }
    };

    useImperativeHandle(ref, () => ({
      printMarksheet: () => {
        console.log('Print marksheet called');
        generatePDF();
      },
      downloadPDF: () => {
        console.log('Download PDF called');
        console.log('Component ref:', componentRef.current);
        console.log('Marksheet data:', marksheetData);
        generatePDF();
      }
    }));

    return (
      <div style={{ 
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        zIndex: -1,
        overflow: 'visible' // Allow content to extend beyond container
      }}>
        <div ref={componentRef} style={{ 
          width: '100%', 
          minHeight: '100%',
          overflow: 'visible' // Allow content to flow naturally
        }}>
          <MarksheetTemplate marksheetData={marksheetData} />
        </div>
      </div>
    );
  }
);

MarksheetPDFGenerator.displayName = 'MarksheetPDFGenerator';

export default MarksheetPDFGenerator;
