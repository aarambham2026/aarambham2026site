'use client';

import { useState } from 'react';
import {
  Search,
  Download,
  Ban,
  RefreshCw,
  FileSpreadsheet,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  CalendarCheck,
  X,
  List,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export interface RegistrationRecord {
  id: string;
  registrationId: string;
  teamLeaderName: string;
  rollNo?: string | null;
  department?: string | null;
  year?: string | null;
  format?: string | null;
  numberOfMembers: number;
  eventCategory: string;
  performanceName?: string | null;
  performanceDuration?: number | null;
  email: string;
  phone: string;
  membersList?: string | null;
  queuePosition: number;
  slotStartTime: string;
  slotEndTime: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminTableProps {
  data: RegistrationRecord[];
  pagination: PaginationMeta;
  onRefresh: () => void;
  search: string;
  setSearch: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  page: number;
  setPage: (p: number) => void;
  apiError?: string | null;
}

export default function AdminTable({
  data,
  pagination,
  onRefresh,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  apiError
}: AdminTableProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);
  const [viewMode, setViewMode] = useState<'TABLE' | 'SCHEDULE'>('TABLE');

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onRefresh();
        if (selectedRecord && selectedRecord.registrationId === id) {
          setSelectedRecord((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Error updating registration status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReorder = async (registrationId: string, newPosition: number) => {
    if (newPosition < 1) return;
    setUpdatingId(registrationId);
    try {
      const res = await fetch('/api/registrations/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId, newPosition })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        onRefresh();
      } else {
        alert(json.error || 'Failed to reorder registration');
      }
    } catch {
      alert('Error reordering registration');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm(`Are you sure you want to cancel registration ${id}?`)) return;
    await handleStatusChange(id, 'CANCELLED');
  };

  const handleResetAll = async () => {
    const confirmation = confirm(
      '⚠️ WARNING: Are you sure you want to RESET ALL REGISTRATIONS?\n\nThis will permanently delete all records from PostgreSQL and restart stage queues from #1.'
    );
    if (!confirmation) return;

    const secondConfirm = confirm('Please confirm once more: ALL REGISTRATION DATA WILL BE PERMANENTLY ERASED FROM POSTGRESQL.');
    if (!secondConfirm) return;

    setResetting(true);
    try {
      const res = await fetch('/api/registrations/reset', {
        method: 'POST'
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert('All registrations have been reset successfully in PostgreSQL.');
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

  const renderStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    if (s === 'REGISTERED') {
      return (
        <span className="inline-flex items-center gap-1 bg-sky-950/80 border border-sky-700/60 text-sky-300 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase">
          <Clock className="w-3 h-3" /> REGISTERED
        </span>
      );
    }
    if (s === 'SCHEDULED') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase">
          <CalendarCheck className="w-3 h-3" /> SCHEDULED
        </span>
      );
    }
    if (s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase">
          <CheckCircle2 className="w-3 h-3" /> COMPLETED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-rose-950/80 border border-rose-800/60 text-rose-300 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase">
        <Ban className="w-3 h-3" /> CANCELLED
      </span>
    );
  };

  return (
    <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Explicit API Error Banner */}
      {apiError && (
        <div className="p-4 bg-rose-950/90 border border-rose-700/80 rounded-xl text-rose-200 text-xs font-semibold flex items-center gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="flex-1">
            <p className="font-extrabold text-sm text-white">Database / API Synchronization Alert</p>
            <p className="text-rose-300 mt-0.5">{apiError}</p>
          </div>
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 border border-rose-700 text-white rounded-lg text-xs font-bold transition-all"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Header Bar with View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-white font-serif tracking-tight">
            PARTICIPANT REGISTRATIONS & STAGE SCHEDULE
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Centralized PostgreSQL live records, slot allocation, and status management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'TABLE'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Table View
          </button>

          <button
            onClick={() => setViewMode('SCHEDULE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'SCHEDULE'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Schedule Timeline
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Team Leader, Reg ID, Email, Phone, Roll No..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            <option value="MUSIC">Music</option>
            <option value="DANCE">Dance</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="REGISTERED">Registered</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
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

      {/* Main Content Area */}
      {viewMode === 'TABLE' ? (
        /* Table View */
        <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 text-zinc-400 font-semibold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3.5">Queue #</th>
                <th className="px-4 py-3.5">Reg ID</th>
                <th className="px-4 py-3.5">Team Leader</th>
                <th className="px-4 py-3.5">Members</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60 text-zinc-300 font-medium">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                    {apiError
                      ? '⚠️ Could not load records due to API connection error.'
                      : 'No registrations found matching your filter criteria.'}
                  </td>
                </tr>
              ) : (
                data.map((reg) => (
                  <tr key={reg.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-amber-400">
                      <div className="flex items-center gap-1.5">
                        <span>#{reg.queuePosition}</span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleReorder(reg.registrationId, reg.queuePosition - 1)}
                            disabled={reg.queuePosition <= 1 || updatingId === reg.registrationId}
                            className="text-[9px] leading-none px-1 py-0.5 bg-zinc-800 hover:bg-amber-600 text-zinc-300 hover:text-white rounded disabled:opacity-30 transition-colors"
                            title="Move Up in Queue"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleReorder(reg.registrationId, reg.queuePosition + 1)}
                            disabled={updatingId === reg.registrationId}
                            className="text-[9px] leading-none px-1 py-0.5 bg-zinc-800 hover:bg-amber-600 text-zinc-300 hover:text-white rounded disabled:opacity-30 transition-colors"
                            title="Move Down in Queue"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
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
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(reg.status)}
                        <select
                          value={reg.status}
                          disabled={updatingId === reg.registrationId}
                          onChange={(e) => handleStatusChange(reg.registrationId, e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300 rounded px-1.5 py-1 focus:outline-none focus:border-amber-500"
                        >
                          <option value="REGISTERED">REGISTERED</option>
                          <option value="SCHEDULED">SCHEDULED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedRecord(reg)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg font-bold text-[11px] transition-colors"
                        title="View Complete Participant Information"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" /> View
                      </button>

                      <a
                        href={`/api/ticket/${reg.registrationId}`}
                        download={`ticket-${reg.registrationId}.pdf`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 rounded-lg font-bold text-[11px] transition-colors"
                        title="Download E-Ticket PDF"
                      >
                        <Download className="w-3.5 h-3.5" /> Ticket
                      </a>

                      {reg.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancel(reg.registrationId)}
                          disabled={cancellingId === reg.registrationId}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 rounded-lg font-bold text-[11px] transition-colors disabled:opacity-50"
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
      ) : (
        /* Schedule Timeline View */
        <div className="space-y-3">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex items-center justify-between text-xs font-mono text-amber-300">
            <span>📅 LIVE STAGE TIMELINE & QUEUE ORDER</span>
            <span>Total Scheduled Entries: {data.length}</span>
          </div>

          <div className="space-y-3">
            {data.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                No performance entries found in the schedule.
              </div>
            ) : (
              data.map((reg) => (
                <div
                  key={reg.id}
                  className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-800/60 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="text-[10px] text-amber-400 font-bold">QUEUE</span>
                      <span className="text-sm font-extrabold text-amber-200">#{reg.queuePosition}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-orange-400 font-bold text-sm">{reg.registrationId}</span>
                        <span className="font-bold text-white text-sm">{reg.teamLeaderName}</span>
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                          {reg.format || 'SOLO'} ({reg.numberOfMembers} members)
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">
                        Title: <span className="text-zinc-200 font-semibold">{reg.performanceName || 'Cultural Performance'}</span> · Department: {reg.department || 'N/A'} (Yr {reg.year || 'N/A'})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:shrink-0 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-[10px] text-zinc-500">
                        Duration: {reg.performanceDuration || 10} mins
                      </div>
                    </div>

                    {renderStatusBadge(reg.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800/80 pt-4 text-xs">
        <div className="text-zinc-400">
          Showing <span className="font-bold text-white">{data.length}</span> of{' '}
          <span className="font-bold text-white">{pagination.total}</span> total registrations
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg font-mono text-amber-300 font-bold">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-300 transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Participant Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 font-bold font-mono">
                #{selectedRecord.queuePosition}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white font-serif">
                  REGISTRATION DETAILS — <span className="text-orange-400">{selectedRecord.registrationId}</span>
                </h3>
                <p className="text-xs text-zinc-400">Created: {new Date(selectedRecord.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })} IST</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Team Leader</span>
                <p className="text-sm font-bold text-white">{selectedRecord.teamLeaderName}</p>
              </div>

              <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Roll Number</span>
                <p className="text-sm font-bold text-amber-300">{selectedRecord.rollNo || 'N/A'}</p>
              </div>

              <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Department & Year</span>
                <p className="text-sm font-bold text-white">{selectedRecord.department || 'N/A'} (Year {selectedRecord.year || 'N/A'})</p>
              </div>

              <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Event Category</span>
                <p className="text-sm font-bold text-rose-400">{selectedRecord.eventCategory} ({selectedRecord.format || 'SOLO'})</p>
              </div>

              <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1 sm:col-span-2">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Performance Title</span>
                <p className="text-sm font-bold text-white">{selectedRecord.performanceName || 'Cultural Performance'}</p>
              </div>

              <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Contact Email</span>
                <p className="text-xs font-bold text-zinc-200">{selectedRecord.email}</p>
              </div>

              <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Phone Number</span>
                <p className="text-xs font-bold text-zinc-200">{selectedRecord.phone}</p>
              </div>


              {selectedRecord.membersList && (
                <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800 space-y-1 sm:col-span-2">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Team Roster</span>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{selectedRecord.membersList}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">Current Status:</span>
                {renderStatusBadge(selectedRecord.status)}
              </div>

              <a
                href={`/api/ticket/${selectedRecord.registrationId}`}
                download={`ticket-${selectedRecord.registrationId}.pdf`}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs shadow-lg"
              >
                <Download className="w-4 h-4" /> Download PDF Ticket
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
