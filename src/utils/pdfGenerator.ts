import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateMarksheetPDF = async (
  elementId: string,
  filename: string = 'marksheet.pdf'
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const generateMarksheetPDFFromData = async (
  marksheetData: any,
  filename: string = 'marksheet.pdf'
): Promise<void> => {
  try {
    // Create a temporary element
    const tempElement = document.createElement('div');
    tempElement.id = 'temp-marksheet-pdf';
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    tempElement.style.top = '-9999px';
    document.body.appendChild(tempElement);

    // Import and render the marksheet template
    const { default: MarksheetTemplate } = await import('../components/MarksheetTemplate');
    
    // Create React element (we'll need to use ReactDOM for this)
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');
    
    const root = ReactDOM.createRoot(tempElement);
    root.render(React.createElement(MarksheetTemplate, { marksheetData }));

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate PDF
    await generateMarksheetPDF('temp-marksheet-pdf', filename);

    // Clean up
    root.unmount();
    document.body.removeChild(tempElement);
  } catch (error) {
    console.error('Error generating PDF from data:', error);
    throw new Error('Failed to generate PDF from data');
  }
};
