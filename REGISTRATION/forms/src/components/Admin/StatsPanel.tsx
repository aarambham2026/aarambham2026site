'use client';

import { Users, Music, Activity, XCircle, CheckCircle2, Clock, CalendarCheck } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    registered?: number;
    scheduled?: number;
    completed?: number;
    cancelled: number;
    music: number;
    dance: number;
  };
}

export default function StatsPanel({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Total</p>
          <p className="text-xl font-extrabold text-white">{stats.total}</p>
        </div>
      </div>

      {/* Registered */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-800/40 flex items-center justify-center text-sky-400 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Registered</p>
          <p className="text-xl font-extrabold text-sky-300">{stats.registered ?? stats.total}</p>
        </div>
      </div>

      {/* Scheduled */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Scheduled</p>
          <p className="text-xl font-extrabold text-emerald-300">{stats.scheduled ?? 0}</p>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Completed</p>
          <p className="text-xl font-extrabold text-indigo-300">{stats.completed ?? 0}</p>
        </div>
      </div>

      {/* Music */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-orange-950/60 border border-orange-800/40 flex items-center justify-center text-orange-400 shrink-0">
          <Music className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Music</p>
          <p className="text-xl font-extrabold text-orange-300">{stats.music}</p>
        </div>
      </div>

      {/* Dance */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Dance</p>
          <p className="text-xl font-extrabold text-rose-300">{stats.dance}</p>
        </div>
      </div>
    </div>
  );
}
