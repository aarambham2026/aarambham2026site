'use client';

import { Users, Music, Activity, XCircle } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    music: number;
    dance: number;
    cancelled: number;
  };
}

export default function StatsPanel({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-950/60 border border-orange-800/40 flex items-center justify-center text-orange-400">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total Registrations
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">{stats.total}</p>
        </div>
      </div>

      {/* Music */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
          <Music className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Music Entries
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">{stats.music}</p>
        </div>
      </div>

      {/* Dance */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Dance Entries
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">{stats.dance}</p>
        </div>
      </div>

      {/* Cancelled */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Cancelled
          </p>
          <p className="text-2xl font-extrabold text-zinc-400 mt-1">{stats.cancelled}</p>
        </div>
      </div>
    </div>
  );
}
