'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Activity, Users, Mail, Phone, User, Sparkles, ArrowRight } from 'lucide-react';

export default function RegistrationForm() {
  const router = useRouter();

  const [teamLeaderName, setTeamLeaderName] = useState('');
  const [numberOfMembers, setNumberOfMembers] = useState<number>(1);
  const [eventCategory, setEventCategory] = useState<'MUSIC' | 'DANCE'>('MUSIC');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!teamLeaderName.trim()) {
      setError('Team leader name is required');
      return;
    }
    if (!numberOfMembers || numberOfMembers <= 0) {
      setError('Number of members must be at least 1');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamLeaderName,
          numberOfMembers: Number(numberOfMembers),
          eventCategory,
          email,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to success page with allocated details
      const params = new URLSearchParams({
        id: data.registrationId,
        slotStart: data.slotStart,
        slotEnd: data.slotEnd,
        ticketUrl: data.ticketUrl,
      });

      router.push(`/success?${params.toString()}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm font-medium animate-shake">
          ⚠️ {error}
        </div>
      )}

      {/* Category Selector */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Select Event Category
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setEventCategory('MUSIC')}
            className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
              eventCategory === 'MUSIC'
                ? 'bg-orange-600/20 border-orange-500 text-white shadow-lg shadow-orange-950/50'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <Music className={`w-5 h-5 ${eventCategory === 'MUSIC' ? 'text-orange-400' : ''}`} />
            <span className="font-bold tracking-wide">MUSIC</span>
          </button>

          <button
            type="button"
            onClick={() => setEventCategory('DANCE')}
            className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
              eventCategory === 'DANCE'
                ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg shadow-amber-950/50'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <Activity className={`w-5 h-5 ${eventCategory === 'DANCE' ? 'text-amber-400' : ''}`} />
            <span className="font-bold tracking-wide">DANCE</span>
          </button>
        </div>
      </div>

      {/* Team Leader Name */}
      <div>
        <label htmlFor="teamLeaderName" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Team Leader Name *
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="teamLeaderName"
            type="text"
            value={teamLeaderName}
            onChange={(e) => setTeamLeaderName(e.target.value)}
            placeholder="e.g. Kashi Nath"
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* Number of Members */}
      <div>
        <label htmlFor="numberOfMembers" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Number of Members *
        </label>
        <div className="relative">
          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="numberOfMembers"
            type="number"
            min="1"
            max="50"
            value={numberOfMembers}
            onChange={(e) => setNumberOfMembers(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="leader@university.edu"
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing Registration & Slot...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-amber-200" />
            <span>CONFIRM REGISTRATION</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
