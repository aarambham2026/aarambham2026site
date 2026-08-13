import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ticketConfig } from '../config/ticket.config';
import { generateQrBuffer } from './qrGenerator';

export interface TicketData {
  teamLeaderName: string;
  numberOfMembers: number;
  slotStartTime: string;
  slotEndTime: string;
  registrationId: string;
}

export async function generateTicketPdf(data: TicketData): Promise<Uint8Array> {
  // 1. Locate and load PDF template
  const possiblePaths = [
    path.join(process.cwd(), 'templates', 'ticket-template.pdf'),
    path.join(process.cwd(), 'public', 'templates', 'ticket-template.pdf')
  ];

  let templateBuffer: Buffer | null = null;
  for (const templatePath of possiblePaths) {
    if (fs.existsSync(templatePath)) {
      templateBuffer = fs.readFileSync(templatePath);
      break;
    }
  }

  if (!templateBuffer) {
    throw new Error('Ticket PDF template file not found at templates/ticket-template.pdf');
  }

  // 2. Load PDF document and copy first page
  const templateDoc = await PDFDocument.load(templateBuffer);
  const pdfDoc = await PDFDocument.create();
  const [copiedPage] = await pdfDoc.copyPages(templateDoc, [0]);
  const page = pdfDoc.addPage(copiedPage);

  // 3. Font embedding (Custom font with fallback to HelveticaBold)
  let font;
  let customFontPath = path.join(process.cwd(), 'public', ticketConfig.fontPath.replace(/^\//, ''));
  if (!fs.existsSync(customFontPath)) {
    customFontPath = path.join(process.cwd(), ticketConfig.fontPath.replace(/^\//, ''));
  }

  if (fs.existsSync(customFontPath)) {
    try {
      const fontBytes = fs.readFileSync(customFontPath);
      font = await pdfDoc.embedFont(fontBytes);
    } catch {
      font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    }
  } else {
    font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Helper color converter
  const toRgb = (c?: { r: number; g: number; b: number }) => 
    c ? rgb(c.r, c.g, c.b) : rgb(1, 1, 1);

  // 4. Draw Overlay Text
  // Team Leader
  const tl = ticketConfig.teamLeaderName;
  page.drawText(`${tl.label} ${data.teamLeaderName}`, {
    x: tl.x,
    y: tl.y,
    size: tl.fontSize,
    font,
    color: toRgb(tl.color)
  });

  // Number of Members
  const nm = ticketConfig.numberOfMembers;
  page.drawText(`${nm.label} ${data.numberOfMembers}`, {
    x: nm.x,
    y: nm.y,
    size: nm.fontSize,
    font: regularFont,
    color: toRgb(nm.color)
  });

  // Slot Time
  const st = ticketConfig.slotTime;
  page.drawText(`${st.label} ${data.slotStartTime} - ${data.slotEndTime}`, {
    x: st.x,
    y: st.y,
    size: st.fontSize,
    font,
    color: toRgb(st.color)
  });

  // Registration ID
  const rid = ticketConfig.registrationId;
  page.drawText(`${rid.label} ${data.registrationId}`, {
    x: rid.x,
    y: rid.y,
    size: rid.fontSize,
    font: regularFont,
    color: toRgb(rid.color)
  });

  // 5. Generate and Draw QR Code (Encodes "REGISTERED")
  const qrBuffer = await generateQrBuffer('REGISTERED');
  const qrImage = await pdfDoc.embedPng(qrBuffer);
  const qr = ticketConfig.qrCode;
  page.drawImage(qrImage, {
    x: qr.x,
    y: qr.y,
    width: qr.width,
    height: qr.height
  });

  // 6. Draw "SUCCESSFULLY REGISTERED" in the left white stub area
  const succ = ticketConfig.successText;
  page.drawText(succ.label || 'SUCCESSFULLY REGISTERED', {
    x: succ.x,
    y: succ.y,
    size: succ.fontSize,
    font,
    color: toRgb(succ.color)
  });

  // 7. Save and return PDF bytes
  return await pdfDoc.save();
}
