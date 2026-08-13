import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'University Event Registration & E-Ticket System',
  description: 'Official University Cultural Event Registration & Automatic Slot Allocation Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090B] text-zinc-100 antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
