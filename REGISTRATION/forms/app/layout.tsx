import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/src/components/CustomCursor";

export const metadata: Metadata = {
  title: "Amrita Vishwa Vidyapeetham - Onam Cultural Event Registration & E-Ticket",
  description: "Official University E-Ticket Registration and Automatic Slot Allocation System for Onam Cultural Fest 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Dancing+Script:wght@700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
