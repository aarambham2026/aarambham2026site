'use client';

import { Users, Music, Activity, Clock } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    music: number;
    dance: number;
    cancelled: number;
  };
}

export default function StatsPanel({ stats }: StatsProps) {
  const activeRegistrations = Math.max(0, stats.total - stats.cancelled);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Registrations Till Now */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-amber-500/40 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Registrations Till Now
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-extrabold text-white">{stats.total}</p>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              ({activeRegistrations} Active)
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Stage Slots */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-emerald-500/40 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Upcoming Stage Slots
          </p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{activeRegistrations}</p>
        </div>
      </div>

      {/* Music Entries */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-orange-500/40 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-orange-950/60 border border-orange-800/40 flex items-center justify-center text-orange-400">
          <Music className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Music Entries
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">{stats.music}</p>
        </div>
      </div>

      {/* Dance Entries */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg hover:border-rose-500/40 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Dance Entries
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">{stats.dance}</p>
        </div>
      </div>
    </div>
  );
}
