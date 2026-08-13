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
  // Path to custom font in /public/fonts/ (with fallback to HelveticaBold)
  fontPath: process.env.TICKET_FONT_PATH || '/fonts/EventFont.ttf',

  // PDF Page Dimensions: 1134 x 807 (Origin [0,0] is Bottom-Left in pdf-lib)

  // Team Leader Name overlay
  teamLeaderName: {
    x: 280,
    y: 520,
    fontSize: 24,
    label: "TEAM LEADER:",
    color: { r: 1, g: 1, b: 1 } // Pure white
  } as TextElementConfig,

  // Number of Members overlay
  numberOfMembers: {
    x: 280,
    y: 440,
    fontSize: 20,
    label: "NO. OF MEMBERS:",
    color: { r: 0.9, g: 0.9, b: 0.9 } // Soft white
  } as TextElementConfig,

  // Slot Time overlay
  slotTime: {
    x: 280,
    y: 360,
    fontSize: 22,
    label: "SLOT TIME:",
    color: { r: 0.96, g: 0.62, b: 0.08 } // Bright amber gold
  } as TextElementConfig,

  // Registration ID overlay
  registrationId: {
    x: 280,
    y: 280,
    fontSize: 20,
    label: "REGISTRATION ID:",
    color: { r: 0.93, g: 0.35, b: 0.05 } // Energetic orange
  } as TextElementConfig,

  // QR Code placement on the right ticket area
  qrCode: {
    x: 880,
    y: 320,
    width: 170,
    height: 170
  } as ImageElementConfig,

  // Success text inside the left white stub area
  successText: {
    x: 35,
    y: 400,
    fontSize: 16,
    label: "SUCCESSFULLY REGISTERED",
    color: { r: 0.1, g: 0.1, b: 0.1 } // Dark charcoal text on white background
  } as TextElementConfig
};
