'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import StatsPanel from '@/components/StatsPanel';
import SettingsForm from '@/components/SettingsForm';
import AdminTable, { RegistrationRecord } from '@/components/AdminTable';
import { ShieldCheck, ArrowLeft, Ticket } from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState<RegistrationRecord[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    music: 0,
    dance: 0,
    cancelled: 0
  });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const res = await fetch(`/api/registrations?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setData(json.data);
        setStats(json.stats);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 pb-16">
      {/* Admin Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-orange-950/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight text-lg leading-none text-white">
                ADMIN <span className="text-orange-500">DASHBOARD</span>
              </h1>
              <p className="text-xs text-zinc-500 font-mono">Event Slot & Registration Control</p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wider text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            REGISTRATION PAGE
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Statistics Bar */}
        <StatsPanel stats={stats} />

        {/* Event Settings Panel */}
        <SettingsForm />

        {/* Registrations Management Table */}
        <AdminTable
          data={data}
          onRefresh={fetchData}
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </main>
    </div>
  );
}
