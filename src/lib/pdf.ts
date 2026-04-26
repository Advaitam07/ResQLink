import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CaseData {
  id: string;
  title: string;
  category: string;
  urgency: string;
  status: string;
  location: string;
}

const addHeader = (doc: jsPDF, title: string) => {
  // Header bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 28, 'F');

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ResQLink', 14, 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('CRISIS COORDINATION & DISASTER RESPONSE PLATFORM', 14, 19);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 210 - 14, 12, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 210 - 14, 19, { align: 'right' });
};

const addFooter = (doc: jsPDF) => {
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('ResQLink — Confidential Disaster Response Report', 14, 291);
    doc.text(`Page ${i} of ${pageCount}`, 210 - 14, 291, { align: 'right' });
  }
};

export const generateMapPDF = (cases: CaseData[]) => {
  const doc = new jsPDF();
  addHeader(doc, 'Field Map Report');

  // Summary section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Mission Field Summary', 14, 40);

  const total = cases.length;
  const critical = cases.filter(c => c.urgency === 'Critical').length;
  const high = cases.filter(c => c.urgency === 'High').length;
  const inProgress = cases.filter(c => c.status === 'In Progress' || c.status === 'Active').length;
  const open = cases.filter(c => c.status === 'Open').length;

  // Stat boxes
  const stats = [
    { label: 'Total Cases', value: String(total), color: [15, 23, 42] as [number,number,number] },
    { label: 'Critical/High', value: String(critical + high), color: [239, 68, 68] as [number,number,number] },
    { label: 'Active', value: String(inProgress), color: [245, 158, 11] as [number,number,number] },
    { label: 'Open', value: String(open), color: [16, 185, 129] as [number,number,number] },
  ];

  stats.forEach((s, i) => {
    const x = 14 + i * 46;
    doc.setFillColor(...s.color);
    doc.roundedRect(x, 46, 42, 22, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(s.value, x + 21, 55, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(s.label.toUpperCase(), x + 21, 62, { align: 'center' });
  });

  // Cases table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Active Mission Cases', 14, 82);

  autoTable(doc, {
    startY: 86,
    head: [['ID', 'Title', 'Category', 'Urgency', 'Status', 'Location']],
    body: cases.map(c => [
      `#${c.id.slice(-4)}`, c.title, c.category, c.urgency, c.status, c.location,
    ]),
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      3: { fontStyle: 'bold' },
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const val = data.cell.raw as string;
        if (val === 'Critical') doc.setTextColor(239, 68, 68);
        else if (val === 'High') doc.setTextColor(245, 158, 11);
        else if (val === 'Medium') doc.setTextColor(59, 130, 246);
        else doc.setTextColor(148, 163, 184);
      }
    },
  });

  addFooter(doc);
  doc.save('resqlink-map-report.pdf');
};

export const generateReportPDF = (
  cases: CaseData[],
  stats: { totalCases: number; completedCases: number; urgentCases: number; activeVolunteers: number }
) => {
  const doc = new jsPDF();
  addHeader(doc, 'Response Protocol Report');

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Intelligence & Response Protocol', 14, 40);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Compiled by ResQLink Strategic Intelligence Engine', 14, 47);

  // KPI boxes
  const kpis = [
    { label: 'Total Missions', value: String(stats.totalCases), color: [59, 130, 246] as [number,number,number] },
    { label: 'Completed', value: String(stats.completedCases), color: [16, 185, 129] as [number,number,number] },
    { label: 'Urgent Alerts', value: String(stats.urgentCases), color: [239, 68, 68] as [number,number,number] },
    { label: 'Active Assets', value: String(stats.activeVolunteers), color: [99, 102, 241] as [number,number,number] },
  ];

  kpis.forEach((k, i) => {
    const x = 14 + i * 46;
    doc.setFillColor(...k.color);
    doc.roundedRect(x, 53, 42, 22, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(k.value, x + 21, 62, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(k.label.toUpperCase(), x + 21, 69, { align: 'center' });
  });

  // Success rate
  const rate = stats.totalCases > 0
    ? Math.round((stats.completedCases / stats.totalCases) * 100)
    : 0;

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, 82, 182, 16, 3, 3, 'F');
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Mission Success Rate: ${rate}%  —  ${rate >= 70 ? 'OPTIMAL' : rate >= 40 ? 'MODERATE' : 'NEEDS ATTENTION'}`, 105, 92, { align: 'center' });

  // Cases table
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Mission Case Directory', 14, 108);

  autoTable(doc, {
    startY: 112,
    head: [['ID', 'Title', 'Category', 'Urgency', 'Status', 'Location']],
    body: cases.map(c => [`#${c.id.slice(-4)}`, c.title, c.category, c.urgency, c.status, c.location]),
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // Closing note
  const finalY = (doc as any).lastAutoTable.finalY + 12;
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(14, finalY, 182, 20, 3, 3, 'F');
  doc.setTextColor(59, 130, 246);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ResQLink — Connecting Communities. Coordinating Response. Saving Lives.', 105, finalY + 8, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 105, finalY + 15, { align: 'center' });

  addFooter(doc);
  doc.save('resqlink-response-protocol.pdf');
};
