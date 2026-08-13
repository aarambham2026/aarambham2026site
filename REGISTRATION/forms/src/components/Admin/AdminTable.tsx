'use client';

import { useState } from 'react';
import { Search, Ban, CheckCircle, RefreshCw, FileSpreadsheet, RotateCcw, Edit2, Trash2 } from 'lucide-react';

export interface RegistrationRecord {
  id: string;
  registrationId: string;
  queuePosition: number;
  teamLeaderName: string;
  rollNo?: string;
  department?: string;
  year?: string;
  format?: string;
  numberOfMembers: number;
  eventCategory: string;
  performanceName?: string;
  performanceDuration: number;
  slotStartTime: string;
  slotEndTime: string;
  email: string;
  phone: string;
  membersList?: string;
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
  const [editingRecord, setEditingRecord] = useState<RegistrationRecord | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/registrations/${editingRecord.registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRecord)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setEditingRecord(null);
        onRefresh();
      } else {
        alert(`Failed to save changes: ${json.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error saving changes: ${err.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`⚠️ Are you sure you want to permanently DELETE registration ${id}?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onRefresh();
      } else {
        alert('Failed to delete registration');
      }
    } catch {
      alert('Error deleting registration');
    } finally {
      setDeletingId(null);
    }
  };

  const upcomingRegistrations = data
    .filter((r) => r.status === 'REGISTERED')
    .sort((a, b) => a.queuePosition - b.queuePosition);

  return (
    <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-6 shadow-2xl">
      {/* Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Team Leader Name, Roll No, Reg ID (e.g. EVT-0001), Email or Phone..."
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
            <option value="OTHERS">Others</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs font-semibold uppercase text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Registrations</option>
            <option value="REGISTERED">Active / Registered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <a
            href={`/api/registrations/export?category=${categoryFilter}&status=${statusFilter}`}
            download
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-xl text-xs font-bold transition-all shadow-md"
            title="Download Full Registrations Table as Excel (.xlsx)"
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

      {/* FULL 18-COLUMN SPREADSHEET TABLE */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950 shadow-inner">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-zinc-900/90 text-amber-400 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3.5 font-bold border-r border-zinc-800/60">Queue #</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Registration ID</th>
              <th className="px-4 py-3.5 font-bold border-r border-zinc-800/60">Team Leader Name</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Roll Number</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Department</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Year / Semester</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Performance Format</th>
              <th className="px-3 py-3.5 font-bold border-r border-zinc-800/60 text-center">Number of Members</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Event Category</th>
              <th className="px-4 py-3.5 font-bold border-r border-zinc-800/60">Performance Title</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60 text-center">Performance Duration</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Slot Start Time</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Slot End Time</th>
              <th className="px-4 py-3.5 font-bold border-r border-zinc-800/60">Email Address</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Phone Number</th>
              <th className="px-4 py-3.5 font-bold border-r border-zinc-800/60">Team Members Roster</th>
              <th className="px-4 py-3.5 font-bold border-r border-zinc-800/60">Registration Date & Time</th>
              <th className="px-3.5 py-3.5 font-bold border-r border-zinc-800/60">Status</th>
              <th className="px-4 py-3.5 text-center font-bold sticky right-0 bg-zinc-900 shadow-l">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/60 text-zinc-300 font-mono">
            {data.length === 0 ? (
              <tr>
                <td colSpan={19} className="px-4 py-12 text-center text-zinc-500 font-mono">
                  No registrations recorded. Submissions on the registration site will appear here in real time.
                </td>
              </tr>
            ) : (
              data.map((reg) => (
                <tr key={reg.id} className="hover:bg-zinc-900/60 transition-colors">
                  {/* Column A: Queue Position */}
                  <td className="px-3 py-3.5 font-bold text-center border-r border-zinc-800/40 text-emerald-400">
                    {reg.queuePosition}
                  </td>
                  {/* Column B: Registration ID */}
                  <td className="px-3.5 py-3.5 font-bold border-r border-zinc-800/40 text-amber-400">
                    {reg.registrationId}
                  </td>
                  {/* Column C: Team Leader Name */}
                  <td className="px-4 py-3.5 font-sans font-semibold border-r border-zinc-800/40 text-white">
                    {reg.teamLeaderName}
                  </td>
                  {/* Column D: Roll Number */}
                  <td className="px-3.5 py-3.5 border-r border-zinc-800/40 text-zinc-300">
                    {reg.rollNo || 'N/A'}
                  </td>
                  {/* Column E: Department */}
                  <td className="px-3.5 py-3.5 font-sans border-r border-zinc-800/40 text-zinc-300">
                    {reg.department || 'N/A'}
                  </td>
                  {/* Column F: Year / Semester */}
                  <td className="px-3.5 py-3.5 font-sans border-r border-zinc-800/40 text-zinc-300">
                    {reg.year || 'N/A'}
                  </td>
                  {/* Column G: Performance Format */}
                  <td className="px-3.5 py-3.5 border-r border-zinc-800/40 text-zinc-300">
                    {reg.format || 'SOLO'}
                  </td>
                  {/* Column H: Number of Members */}
                  <td className="px-3 py-3.5 text-center border-r border-zinc-800/40 text-zinc-300">
                    {reg.numberOfMembers || 1}
                  </td>
                  {/* Column I: Event Category */}
                  <td className="px-3.5 py-3.5 font-bold border-r border-zinc-800/40 text-orange-400">
                    {reg.eventCategory}
                  </td>
                  {/* Column J: Performance Title */}
                  <td className="px-4 py-3.5 font-sans border-r border-zinc-800/40 text-zinc-200">
                    {reg.performanceName || 'N/A'}
                  </td>
                  {/* Column K: Performance Duration */}
                  <td className="px-3.5 py-3.5 text-center border-r border-zinc-800/40 text-zinc-300">
                    {reg.performanceDuration} mins
                  </td>
                  {/* Column L: Slot Start Time */}
                  <td className="px-3.5 py-3.5 font-bold border-r border-zinc-800/40 text-emerald-400">
                    {reg.slotStartTime}
                  </td>
                  {/* Column M: Slot End Time */}
                  <td className="px-3.5 py-3.5 font-bold border-r border-zinc-800/40 text-emerald-400">
                    {reg.slotEndTime}
                  </td>
                  {/* Column N: Email Address */}
                  <td className="px-4 py-3.5 border-r border-zinc-800/40 text-zinc-300">
                    {reg.email}
                  </td>
                  {/* Column O: Phone Number */}
                  <td className="px-3.5 py-3.5 border-r border-zinc-800/40 text-zinc-300">
                    {reg.phone}
                  </td>
                  {/* Column P: Team Members Roster */}
                  <td className="px-4 py-3.5 font-sans border-r border-zinc-800/40 text-zinc-400 max-w-xs truncate">
                    {reg.membersList || 'N/A'}
                  </td>
                  {/* Column Q: Registration Date & Time */}
                  <td className="px-4 py-3.5 border-r border-zinc-800/40 text-zinc-400 text-[11px]">
                    {reg.createdAt
                      ? new Date(reg.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })
                      : 'N/A'}
                  </td>
                  {/* Column R: Status */}
                  <td className="px-3.5 py-3.5 border-r border-zinc-800/40">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        reg.status === 'REGISTERED'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                      }`}
                    >
                      {reg.status === 'REGISTERED' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Ban className="w-3 h-3" />
                      )}
                      {reg.status}
                    </span>
                  </td>
                  {/* Actions Sticky Column */}
                  <td className="px-4 py-3.5 text-center sticky right-0 bg-zinc-950/95 shadow-l">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setEditingRecord(reg)}
                        className="px-2 py-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-800/60 text-amber-300 rounded text-[11px] font-bold transition-all flex items-center gap-1"
                        title="Edit Participant Data"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {reg.status === 'REGISTERED' && (
                        <button
                          onClick={() => handleCancel(reg.registrationId)}
                          disabled={cancellingId === reg.registrationId}
                          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded text-[11px] font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                          title="Cancel Registration"
                        >
                          <Ban className="w-3 h-3 text-rose-400" />
                          <span>Cancel</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(reg.registrationId)}
                        disabled={deletingId === reg.registrationId}
                        className="px-2 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 rounded text-[11px] font-bold transition-all flex items-center gap-1 disabled:opacity-50"
                        title="Delete Record Permanently"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL FOR MANIPULATING ALL 18 FIELDS */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">✏️ Manipulate Participant Record</h3>
                <p className="text-xs text-amber-400 font-mono">Editing Registration ID: {editingRecord.registrationId}</p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-zinc-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Team Leader Name</label>
                  <input
                    type="text"
                    value={editingRecord.teamLeaderName || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, teamLeaderName: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Roll Number</label>
                  <input
                    type="text"
                    value={editingRecord.rollNo || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, rollNo: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Department</label>
                  <input
                    type="text"
                    value={editingRecord.department || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, department: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Year / Semester</label>
                  <input
                    type="text"
                    value={editingRecord.year || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, year: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Performance Format</label>
                  <input
                    type="text"
                    value={editingRecord.format || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, format: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Number of Members</label>
                  <input
                    type="number"
                    value={editingRecord.numberOfMembers || 1}
                    onChange={(e) => setEditingRecord({ ...editingRecord, numberOfMembers: parseInt(e.target.value, 10) || 1 })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Event Category</label>
                  <select
                    value={editingRecord.eventCategory || 'MUSIC'}
                    onChange={(e) => setEditingRecord({ ...editingRecord, eventCategory: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="MUSIC">MUSIC</option>
                    <option value="DANCE">DANCE</option>
                    <option value="OTHERS">OTHERS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Performance Title</label>
                  <input
                    type="text"
                    value={editingRecord.performanceName || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, performanceName: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Slot Start Time</label>
                  <input
                    type="text"
                    value={editingRecord.slotStartTime || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, slotStartTime: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Slot End Time</label>
                  <input
                    type="text"
                    value={editingRecord.slotEndTime || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, slotEndTime: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={editingRecord.email || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    value={editingRecord.phone || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Team Members Roster</label>
                <textarea
                  value={editingRecord.membersList || ''}
                  onChange={(e) => setEditingRecord({ ...editingRecord, membersList: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-semibold">Status</label>
                <select
                  value={editingRecord.status || 'REGISTERED'}
                  onChange={(e) => setEditingRecord({ ...editingRecord, status: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="REGISTERED">REGISTERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
