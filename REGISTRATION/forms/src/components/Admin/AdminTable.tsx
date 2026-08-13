'use client';

import { useState } from 'react';
import { Search, Download, Ban, CheckCircle, RefreshCw, FileSpreadsheet, RotateCcw } from 'lucide-react';

export interface RegistrationRecord {
  id: string;
  registrationId: string;
  teamLeaderName: string;
  numberOfMembers: number;
  eventCategory: string;
  email: string;
  phone: string;
  queuePosition: number;
  slotStartTime: string;
  slotEndTime: string;
  status: string;
  createdAt: string;
}

interface AdminTableProps {
  data: RegistrationRecord[];
  onRefresh: () => void;
  search: string;
  setSearch: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
}

export default function AdminTable({
  data,
  onRefresh,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter
}: AdminTableProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const handleCancel = async (id: string) => {
    if (!confirm(`Are you sure you want to cancel registration ${id}?`)) return;

    setCancellingId(id);
    try {
      const res = await fetch(`/api/registrations/${id}/cancel`, {
        method: 'PATCH'
      });
      if (res.ok) {
        onRefresh();
      }
    } catch {
      alert('Failed to cancel registration');
    } finally {
      setCancellingId(null);
    }
  };

  const handleResetAll = async () => {
    const confirmation = confirm(
      '⚠️ WARNING: Are you sure you want to RESET ALL REGISTRATIONS?\n\nThis will permanently delete all records and restart stage queues from #1.'
    );
    if (!confirmation) return;

    const secondConfirm = confirm('Please confirm once more: ALL REGISTRATION DATA WILL BE PERMANENTLY ERASED.');
    if (!secondConfirm) return;

    setResetting(true);
    try {
      const res = await fetch('/api/registrations/reset', {
        method: 'POST'
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert('All registrations have been reset successfully.');
        onRefresh();
      } else {
        throw new Error(json.error || 'Failed to reset');
      }
    } catch (err: any) {
      alert(`Reset error: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Team Leader or Reg ID (e.g. EVT-0001)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            <option value="MUSIC">Music</option>
            <option value="DANCE">Dance</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="REGISTERED">Registered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <a
            href={`/api/registrations/export?category=${categoryFilter}&status=${statusFilter}`}
            download
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-xl text-xs font-bold transition-all shadow-md"
            title="Download Registrations Table as Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download XLSX</span>
          </a>

          <button
            onClick={handleResetAll}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-md"
            title="Permanently reset all registrations in database"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>{resetting ? 'Resetting...' : 'Reset All'}</span>
          </button>

          <button
            onClick={onRefresh}
            title="Refresh Table"
            className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/90 text-zinc-400 font-semibold uppercase tracking-wider border-b border-zinc-800">
            <tr>
              <th className="px-4 py-3.5">Queue #</th>
              <th className="px-4 py-3.5">Reg ID</th>
              <th className="px-4 py-3.5">Team Leader</th>
              <th className="px-4 py-3.5">Members</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Allocated Slot</th>
              <th className="px-4 py-3.5">Registration Date & Time</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-zinc-300 font-medium">
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-zinc-500">
                  No registrations found matching your filter criteria.
                </td>
              </tr>
            ) : (
              data.map((reg) => (
                <tr key={reg.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 py-4 font-mono font-bold text-amber-400">
                    #{reg.queuePosition}
                  </td>
                  <td className="px-4 py-4 font-mono text-orange-400 font-bold">
                    {reg.registrationId}
                  </td>
                  <td className="px-4 py-4 text-white font-semibold">
                    {reg.teamLeaderName}
                    <div className="text-[10px] text-zinc-500 font-normal">{reg.email}</div>
                  </td>
                  <td className="px-4 py-4 text-zinc-400">
                    {reg.numberOfMembers}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                      reg.eventCategory === 'MUSIC'
                        ? 'bg-amber-950/80 border border-amber-800/60 text-amber-300'
                        : 'bg-rose-950/80 border border-rose-800/60 text-rose-300'
                    }`}>
                      {reg.eventCategory}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-zinc-200">
                    {reg.slotStartTime} - {reg.slotEndTime}
                  </td>
                  <td className="px-4 py-4 text-[11px] text-zinc-400">
                    <div className="font-semibold text-zinc-300">
                      {new Date(reg.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {new Date(reg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {reg.status === 'REGISTERED' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> REGISTERED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-zinc-500 font-bold text-[11px]">
                        <Ban className="w-3.5 h-3.5 text-rose-500" /> CANCELLED
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right space-x-2">
                    <a
                      href={`/api/ticket/${reg.registrationId}`}
                      download={`ticket-${reg.registrationId}.pdf`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 rounded-lg font-bold text-[11px] transition-colors"
                      title="Download E-Ticket PDF"
                    >
                      <Download className="w-3.5 h-3.5" /> Ticket
                    </a>

                    {reg.status === 'REGISTERED' && (
                      <button
                        onClick={() => handleCancel(reg.registrationId)}
                        disabled={cancellingId === reg.registrationId}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 rounded-lg font-bold text-[11px] transition-colors disabled:opacity-50"
                        title="Cancel Registration"
                      >
                        <Ban className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
