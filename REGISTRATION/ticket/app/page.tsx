import Link from 'next/link';
import RegistrationForm from '@/components/RegistrationForm';
import { Ticket, ShieldCheck, Clock, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#09090B] text-zinc-100">
      {/* Top Header / Navigation */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md shadow-orange-950/40">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight text-lg leading-none">
                UNIFEST <span className="text-orange-500">2026</span>
              </h1>
              <p className="text-xs text-zinc-500 font-mono">E-Ticket & Slot Allocation</p>
            </div>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wider text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            ADMIN PANEL
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Hero Information */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-950/50 border border-orange-800/40 text-orange-400 text-xs font-semibold uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" />
            <span>Automatic Slot Allocation</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Register Your Team & Claim Your <span className="orange-gradient-text">Stage Slot</span>
          </h2>

          <p className="text-zinc-400 text-base leading-relaxed">
            Welcome to the official University Cultural Event registration portal. Complete the form to receive your server-allocated performance slot and instant downloadable official E-Ticket.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <Award className="w-6 h-6 text-orange-400 mb-2" />
              <h3 className="font-bold text-sm text-white">Instant E-Ticket</h3>
              <p className="text-xs text-zinc-500 mt-1">Generated server-side with verified QR scan content</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <Clock className="w-6 h-6 text-amber-400 mb-2" />
              <h3 className="font-bold text-sm text-white">First-Come FCFS</h3>
              <p className="text-xs text-zinc-500 mt-1">Atomic queue positioning & exact stage timing</p>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="lg:col-span-6">
          <div className="card-glow bg-zinc-950/90 border border-orange-900/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-white">Team Registration</h3>
              <p className="text-xs text-zinc-400 mt-1">Fill out all details to reserve your performance slot.</p>
            </div>

            <RegistrationForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        <p>© 2026 University Event Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
