import QRCode from 'qrcode';

export async function generateQrBuffer(text: string = 'REGISTERED'): Promise<Buffer> {
  const dataUrl = await QRCode.toDataURL(text, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 300,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });

  // Convert base64 data URL to Buffer
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}
