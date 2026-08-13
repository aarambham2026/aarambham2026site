import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aarambham 2026 — Isolated Admin Dashboard',
  description: 'Independent Admin Management Portal for Aarambham Onam Festival 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#1b1226] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
