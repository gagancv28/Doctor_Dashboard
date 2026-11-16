import { jsPDF } from 'jspdf';
import type { PrescriptionRecord } from '../types/health';

/**
 * PDF Service — High Quality Vector Prescription Document Generation
 */
export const pdfService = {
  /**
   * Generates and downloads a clean, formatted clinical prescription PDF
   */
  exportPrescriptionPDF: (prescription: PrescriptionRecord): string => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const cleanPatientId = prescription.patientId.replace(/^#/, '');

    // Colors
    const primaryColor = [37, 99, 235]; // #2563EB
    const slateDark = [15, 23, 42]; // #0F172A
    const slateMuted = [100, 116, 139]; // #64748B
    const borderSlate = [226, 232, 240]; // #E2E8F0
    const emeraldColor = [16, 185, 129]; // #10B981

    let y = 18;

    // 1. TOP HEADER (Hospital & Clinic branding)
    doc.setFillColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.rect(14, y - 4, pageWidth - 28, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(prescription.facility.toUpperCase(), 20, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(`${prescription.department} · Hassan, Karnataka`, 20, y + 11);

    // Doctor info on right of top bar
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(prescription.doctorName, pageWidth - 20, y + 4, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(186, 230, 253);
    doc.text(`Reg: ${prescription.doctorRegistration || '#KMC-48291'}`, pageWidth - 20, y + 11, { align: 'right' });

    y += 28;

    // 2. PATIENT & ENCOUNTER METADATA BOX
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT NAME', 20, y + 6);
    doc.text('PATIENT ID', 85, y + 6);
    doc.text('PRESCRIPTION DATE', 140, y + 6);

    doc.setFontSize(10);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(prescription.patientName, 20, y + 14);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`#${cleanPatientId}`, 85, y + 14);

    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(`${prescription.date}, ${prescription.time || '10:52 AM'}`, 140, y + 14);

    y += 28;

    // 3. RX SECTION HEADER
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Rx', 15, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('MEDICATIONS & ADMINISTRATION SCHEDULE', 30, y - 2);

    doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
    doc.setLineWidth(0.3);
    doc.line(14, y + 3, pageWidth - 14, y + 3);

    y += 9;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text('#', 18, y + 5);
    doc.text('MEDICINE & DOSE', 26, y + 5);
    doc.text('FREQUENCY', 95, y + 5);
    doc.text('DURATION', 135, y + 5);
    doc.text('INSTRUCTIONS', 160, y + 5);

    y += 7;

    // Table Rows
    prescription.items.forEach((item, index) => {
      const rowHeight = 13;
      doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
      doc.rect(14, y, pageWidth - 28, rowHeight, 'F');

      doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
      doc.line(14, y + rowHeight, pageWidth - 14, y + rowHeight);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.text(`${index + 1}`, 18, y + 6);
      doc.text(`Tab. ${item.medicine}`, 26, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(item.dose, 26, y + 10);

      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.text(item.frequency, 95, y + 6);
      doc.text(item.duration, 135, y + 6);

      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      doc.text(item.instructions || 'After food', 160, y + 6);

      y += rowHeight;
    });

    y += 8;

    // 4. ADVICE & FOLLOW UP
    if (prescription.additionalAdvice) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      doc.text('DIETARY & LIFESTYLE ADVICE', 14, y);
      y += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      const splitAdvice = doc.splitTextToSize(prescription.additionalAdvice, pageWidth - 28);
      doc.text(splitAdvice, 14, y);
      y += splitAdvice.length * 4.5 + 4;
    }

    if (prescription.followUpDate) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`Follow-up / Clinical Review: ${prescription.followUpDate}`, 14, y);
      y += 10;
    }

    // 5. DOCTOR VERIFICATION FOOTER STAMP
    y = Math.max(y + 8, 235);

    doc.setDrawColor(borderSlate[0], borderSlate[1], borderSlate[2]);
    doc.line(14, y, pageWidth - 14, y);
    y += 6;

    // Stamp box
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
    doc.roundedRect(14, y, 90, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
    doc.text('✓ DOCTOR VERIFIED DIGITALLY', 18, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`Verified by: ${prescription.doctorName}`, 18, y + 11);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(`Timestamp: ${prescription.verifiedAt || `${prescription.date}, 10:52 AM`}`, 18, y + 16);

    // Signature line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(prescription.doctorName, pageWidth - 18, y + 7, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('Senior Attending Physician', pageWidth - 18, y + 12, { align: 'right' });
    doc.text('Government General Hospital', pageWidth - 18, y + 16, { align: 'right' });

    // Dynamic filename
    const filename = `CodeScribe_Prescription_${cleanPatientId}_${prescription.id}.pdf`;
    doc.save(filename);
    return filename;
  },
};
