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

  // Canvas Dimensions: 241 x 754 (Portrait Thakrithi Ticket Background)

  // Line 1: Event Name overlay (Gold)
  eventName: {
    x: 16,
    y: 330,
    fontSize: 11,
    label: "EVENT:",
    color: { r: 0.95, g: 0.79, b: 0.3 } // Bright Gold
  } as TextElementConfig,

  // Line 2: Team Leader Name overlay (White)
  teamLeaderName: {
    x: 16,
    y: 308,
    fontSize: 11,
    label: "TEAM LEADER:",
    color: { r: 1, g: 1, b: 1 } // Pure White
  } as TextElementConfig,

  // Line 3: Number of Members overlay (White)
  numberOfMembers: {
    x: 16,
    y: 286,
    fontSize: 11,
    label: "NO. OF MEMBERS:",
    color: { r: 1, g: 1, b: 1 } // Pure White
  } as TextElementConfig,

  // Line 4: Slot Time overlay (Disabled / Hidden)
  slotTime: {
    x: 16,
    y: 264,
    fontSize: 11,
    label: "SLOT TIME:",
    color: { r: 0.95, g: 0.79, b: 0.3 }
  } as TextElementConfig,

  // Line 5: Registration ID overlay (Orange)
  registrationId: {
    x: 16,
    y: 264,
    fontSize: 11,
    label: "REGISTRATION ID:",
    color: { r: 0.95, g: 0.38, b: 0.1 } // Energetic Orange
  } as TextElementConfig,

  // QR Code placement centered in the bottom white space area
  qrCode: {
    x: 45.5,
    y: 40,
    width: 150,
    height: 150
  } as ImageElementConfig,

  // Success text centered below QR code in the bottom white space area
  successText: {
    x: 120.5, // Centered horizontally (width 241 / 2)
    y: 18,
    fontSize: 8.5,
    label: "SUCCESSFULLY REGISTERED",
    color: { r: 0.08, g: 0.08, b: 0.08 }
  } as TextElementConfig
};
