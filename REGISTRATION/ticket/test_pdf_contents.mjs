import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function checkPdf() {
  const pdfBuffer = fs.readFileSync(path.join(process.cwd(), 'scratch', 'test_ticket_EVT-0001.pdf'));
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  console.log(`Generated PDF Dimensions: ${width} x ${height}`);
}

checkPdf();
