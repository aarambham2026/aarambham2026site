import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { ticketConfig } from '../config/ticket.config';
import { generateQrBuffer } from './qrGenerator';

export interface TicketData {
  teamLeaderName: string;
  numberOfMembers: number;
  slotStartTime: string;
  slotEndTime: string;
  registrationId: string;
  eventName?: string;
}

// Memory caches to eliminate disk I/O & PNG decoding CPU latency
let cachedBasePdfBytes: Uint8Array | null = null;
let cachedFontBytes: Buffer | null = null;

function getCachedFontBytes(): Buffer | null {
  if (cachedFontBytes) return cachedFontBytes;
  let customFontPath = path.join(process.cwd(), 'public', ticketConfig.fontPath.replace(/^\//, ''));
  if (!fs.existsSync(customFontPath)) {
    customFontPath = path.join(process.cwd(), ticketConfig.fontPath.replace(/^\//, ''));
  }
  if (fs.existsSync(customFontPath)) {
    try {
      const bytes = fs.readFileSync(customFontPath);
      if (bytes.length > 5000) {
        cachedFontBytes = bytes;
        return cachedFontBytes;
      }
    } catch {
      return null;
    }
  }
  return null;
}

async function getBasePdfBytes(): Promise<Uint8Array> {
  if (cachedBasePdfBytes) return cachedBasePdfBytes;

  const possibleImgPaths = [
    path.join(process.cwd(), 'templates', 'ticket-bg.png'),
    path.join(process.cwd(), 'public', 'templates', 'ticket-bg.png')
  ];
  let imgBuffer: Buffer | null = null;
  for (const imgPath of possibleImgPaths) {
    if (fs.existsSync(imgPath)) {
      imgBuffer = fs.readFileSync(imgPath);
      break;
    }
  }

  if (!imgBuffer) {
    throw new Error('ticket-bg.png background image not found');
  }

  // Pre-build base PDF document with ticket-bg.png pre-embedded
  const baseDoc = await PDFDocument.create();
  const bgImage = await baseDoc.embedPng(imgBuffer);
  const width = bgImage.width;
  const height = bgImage.height;
  const page = baseDoc.addPage([width, height]);
  page.drawImage(bgImage, { x: 0, y: 0, width, height });

  cachedBasePdfBytes = await baseDoc.save();
  return cachedBasePdfBytes;
}

export async function generateTicketPdf(data: TicketData): Promise<Uint8Array> {
  // Load pre-embedded base PDF template (fast < 20ms)
  const basePdfBytes = await getBasePdfBytes();
  const pdfDoc = await PDFDocument.load(basePdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.getPages()[0];

  // Embed Montserrat-ExtraBold font
  let font;
  const fontBytes = getCachedFontBytes();
  if (fontBytes) {
    try {
      font = await pdfDoc.embedFont(fontBytes);
    } catch {
      font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    }
  } else {
    font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }

  const toRgb = (c?: { r: number; g: number; b: number }) => 
    c ? rgb(c.r, c.g, c.b) : rgb(1, 1, 1);

  const whiteColor = rgb(1, 1, 1);
  const goldColor = rgb(0.95, 0.79, 0.3);

  // Ultra-bold text drawing helper with multi-layer micro-offsets for maximum thickness & readability
  const drawExtraBoldText = (text: string, x: number, y: number, size: number, color: any) => {
    page.drawText(text, { x, y, size, font, color });
    page.drawText(text, { x: x + 0.35, y, size, font, color });
    page.drawText(text, { x, y: y + 0.35, size, font, color });
    page.drawText(text, { x: x + 0.35, y: y + 0.35, size, font, color });
  };

  // 3. Draw Heavy Bold Text Overlays matching View Mode ticket 100%

  // Line 1: EVENT: MUSIC
  const evName = data.eventName ? data.eventName.toUpperCase() : 'MUSIC';
  const ev = ticketConfig.eventName;
  drawExtraBoldText(`${ev.label} ${evName}`, ev.x, ev.y, ev.fontSize, toRgb(ev.color));

  // Line 2: TEAM LEADER: Gautham Suresh
  const tl = ticketConfig.teamLeaderName;
  drawExtraBoldText(`${tl.label} ${data.teamLeaderName}`, tl.x, tl.y, tl.fontSize, toRgb(tl.color));

  // Line 3: NO. OF MEMBERS: 1
  const nm = ticketConfig.numberOfMembers;
  drawExtraBoldText(`${nm.label} ${data.numberOfMembers}`, nm.x, nm.y, nm.fontSize, toRgb(nm.color));

  // Line 4: SLOT TIME: 2:15 PM - 2:25 PM
  const st = ticketConfig.slotTime;
  const slotLabel = `${st.label} `;
  const slotVal = `${data.slotStartTime} - ${data.slotEndTime}`;
  
  drawExtraBoldText(slotLabel, st.x, st.y, st.fontSize, whiteColor);
  const labelWidth = font.widthOfTextAtSize(slotLabel, st.fontSize);
  drawExtraBoldText(slotVal, st.x + labelWidth, st.y, st.fontSize, goldColor);

  // Line 5: REGISTRATION ID: EVT-0003
  const rid = ticketConfig.registrationId;
  drawExtraBoldText(`${rid.label} ${data.registrationId}`, rid.x, rid.y, rid.fontSize, toRgb(rid.color));

  // 4. Draw QR Code centered in bottom white space
  const qrBuffer = await generateQrBuffer(data.registrationId);
  const qrImage = await pdfDoc.embedPng(qrBuffer);
  const qr = ticketConfig.qrCode;
  page.drawImage(qrImage, {
    x: qr.x,
    y: qr.y,
    width: qr.width,
    height: qr.height
  });

  // 5. Draw "SUCCESSFULLY REGISTERED" centered below QR code in extra-bold dark text
  const succ = ticketConfig.successText;
  const succText = succ.label || 'SUCCESSFULLY REGISTERED';
  const textWidth = font.widthOfTextAtSize(succText, succ.fontSize);
  drawExtraBoldText(succText, succ.x - textWidth / 2, succ.y, succ.fontSize, toRgb(succ.color));

  // 6. Return final PDF bytes
  return await pdfDoc.save();
}
