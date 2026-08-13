export interface TextElementConfig {
  x: number;
  y: number;
  fontSize: number;
  label?: string;
  color?: { r: number; g: number; b: number };
}

export interface ImageElementConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ticketConfig = {
  // Path to custom Montserrat ExtraBold font in /public/fonts/
  fontPath: process.env.TICKET_FONT_PATH || '/fonts/EventFont.ttf',

  // Canvas Dimensions: 267 x 822 (Portrait Ticket Background)

  // Line 1: Event Name overlay (Gold)
  eventName: {
    x: 18,
    y: 390,
    fontSize: 12.5,
    label: "EVENT:",
    color: { r: 0.95, g: 0.79, b: 0.3 } // Bright Gold
  } as TextElementConfig,

  // Line 2: Team Leader Name overlay (White)
  teamLeaderName: {
    x: 18,
    y: 365,
    fontSize: 12.5,
    label: "TEAM LEADER:",
    color: { r: 1, g: 1, b: 1 } // Pure White
  } as TextElementConfig,

  // Line 3: Number of Members overlay (White)
  numberOfMembers: {
    x: 18,
    y: 340,
    fontSize: 12.5,
    label: "NO. OF MEMBERS:",
    color: { r: 1, g: 1, b: 1 } // Pure White
  } as TextElementConfig,

  // Line 4: Slot Time overlay (White Label + Gold Value)
  slotTime: {
    x: 18,
    y: 315,
    fontSize: 12.5,
    label: "SLOT TIME:",
    color: { r: 0.95, g: 0.79, b: 0.3 } // Gold Value
  } as TextElementConfig,

  // Line 5: Registration ID overlay (Orange)
  registrationId: {
    x: 18,
    y: 290,
    fontSize: 12.5,
    label: "REGISTRATION ID:",
    color: { r: 0.9, g: 0.32, b: 0.05 } // Energetic Orange
  } as TextElementConfig,

  // QR Code placement centered in the bottom white space area
  qrCode: {
    x: 53.5,
    y: 42,
    width: 160,
    height: 160
  } as ImageElementConfig,

  // Success text centered below QR code in the bottom white space area
  successText: {
    x: 133.5, // Centered horizontally (width 267 / 2)
    y: 20,
    fontSize: 9.5,
    label: "SUCCESSFULLY REGISTERED",
    color: { r: 0.08, g: 0.08, b: 0.08 }
  } as TextElementConfig
};
