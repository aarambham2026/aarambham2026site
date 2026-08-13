'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Calendar, Ticket, Home, ArrowLeft } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();

  const registrationId = searchParams.get('id') || 'EVT-0001';
  const slotStart = searchParams.get('slotStart') || '2:00 PM';
  const slotEnd = searchParams.get('slotEnd') || '2:10 PM';
  const ticketUrl = searchParams.get('ticketUrl') || `/api/ticket/${registrationId}`;

  useEffect(() => {
    // Fire celebratory confetti on page load
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#f59e0b', '#dc2626', '#ffffff']
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto w-full text-center space-y-8">
      {/* Success Badge */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-950/60 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/50 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Registration Successful!
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Your team slot has been confirmed and locked in the server queue.
        </p>
      </div>

      {/* Confirmation Summary Card */}
      <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-left">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Registration ID
          </span>
          <span className="text-xl font-mono font-extrabold text-orange-400 bg-orange-950/40 border border-orange-800/50 px-3 py-1 rounded-lg">
            {registrationId}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            Allocated Performance Slot
          </span>
          <span className="text-base font-bold text-amber-300">
            {slotStart} - {slotEnd}
          </span>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-1">
          <p className="font-semibold text-zinc-300">Important Instructions:</p>
          <p>• Please present your downloaded E-Ticket PDF at the stage entrance 15 minutes before your slot time.</p>
          <p>• The ticket QR code scans as <span className="font-mono text-white font-bold">REGISTERED</span> for quick check-in verification.</p>
        </div>

        {/* Download Button */}
        <a
          href={ticketUrl}
          download={`ticket-${registrationId}.pdf`}
          className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold rounded-xl shadow-xl shadow-orange-950/60 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
        >
          <Download className="w-5 h-5" />
          <span>DOWNLOAD E-TICKET</span>
        </a>
      </div>

      <div className="pt-4 flex items-center justify-center gap-4 text-xs font-semibold">
        <Link
          href="/"
          className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Register Another Team
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-white text-center">Loading success details...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
