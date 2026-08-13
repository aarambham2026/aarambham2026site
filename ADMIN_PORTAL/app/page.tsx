'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Lock, LogOut, KeyRound, User, RefreshCw, Search, Download, Music, Users, Calendar, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';

export interface RegistrationRecord {
  id: string;
  registrationId: string;
  teamLeaderName: string;
  rollNo?: string;
  department?: string;
  year?: string;
  format?: string;
  numberOfMembers: number;
  eventCategory: string;
  performanceName?: string;
  performanceDuration: number;
  email: string;
  phone: string;
  membersList?: string;
  queuePosition: number;
  slotStartTime: string;
  slotEndTime: string;
  status: string;
  createdAt: string;
}

export default function StandaloneAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [data, setData] = useState<RegistrationRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, music: 0, dance: 0, cancelled: 0 });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);

      const res = await fetch(`/api/registrations?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setData(json.data || []);
        if (json.stats) setStats(json.stats);
        setLastUpdated(new Date().toLocaleTimeString());
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, search, categoryFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(() => fetchData(), 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(json.error || 'Invalid username or password');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setData([]);
  };

  const exportToExcel = () => {
    if (!data || data.length === 0) return;

    const exportRows = data.map((item) => ({
      'Queue #': item.queuePosition || 0,
      'Registration ID': item.registrationId || 'N/A',
      'Team Leader Name': item.teamLeaderName || 'N/A',
      'Roll Number': item.rollNo || 'N/A',
      'Department': item.department || 'N/A',
      'Year / Semester': item.year || 'N/A',
      'Performance Format': item.format || 'SOLO',
      'Member Count': item.numberOfMembers || 1,
      'Event Category': item.eventCategory || 'N/A',
      'Performance Title': item.performanceName || 'N/A',
      'Performance Duration (mins)': item.performanceDuration || 10,
      'Stage Slot Start': item.slotStartTime || 'N/A',
      'Stage Slot End': item.slotEndTime || 'N/A',
      'Email Address': item.email || 'N/A',
      'Phone Number': item.phone || 'N/A',
      'Team Roster': item.membersList || 'N/A',
      'Registration Status': item.status || 'REGISTERED',
      'Registered At': new Date(item.createdAt || Date.now()).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.writeFile(workbook, `Aarambham_2026_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1b1226] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-950/90 border border-amber-500/40 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-950/80">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-serif mt-2">
              AARAMBHAM <span className="text-amber-400">ADMIN PORTAL</span>
            </h1>
            <p className="text-xs text-amber-200/70 font-mono">
              100% Isolated Dedicated Admin Dashboard
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/90 border border-red-800/80 rounded-xl text-xs text-red-200 text-center font-semibold">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-amber-200/80 mb-1 tracking-wider uppercase">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200/80 mb-1 tracking-wider uppercase">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-extrabold text-sm tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-amber-950/60 disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In To Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-[#1b1226] text-zinc-100 pb-16">
      {/* Header Bar */}
      <header className="border-b border-amber-500/30 bg-[#1b1226]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-amber-950/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold tracking-tight text-lg leading-none text-white font-serif">
                  AARAMBHAM 2026 <span className="text-amber-400">ISOLATED ADMIN</span>
                </h1>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-[10px] font-mono text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>LIVE POLLING</span>
                </div>
              </div>
              <p className="text-xs text-amber-200/60 font-mono mt-0.5">
                Independent Admin Portal {lastUpdated && `(Updated: ${lastUpdated})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold tracking-wider text-emerald-300 hover:text-white bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-full transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              EXPORT EXCEL (.XLSX)
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider text-rose-300 hover:text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 rounded-full transition-all"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-950/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Participants</span>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2 font-mono">{stats.total || data.length}</p>
          </div>

          <div className="bg-zinc-950/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-purple-400">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Music Events</span>
              <Music className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2 font-mono">{stats.music || data.filter(d => d.eventCategory === 'MUSIC').length}</p>
          </div>

          <div className="bg-zinc-950/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-pink-400">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dance Events</span>
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2 font-mono">{stats.dance || data.filter(d => d.eventCategory === 'DANCE').length}</p>
          </div>

          <div className="bg-zinc-950/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Start Time</span>
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-300 mt-2 font-mono">2:00 PM IST</p>
          </div>
        </div>

        {/* Filter and Search controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-4 shadow-lg">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID (EVT-0001), Leader Name, Roll No, Email..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['ALL', 'MUSIC', 'DANCE', 'OTHERS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === cat
                    ? 'bg-amber-500 text-black font-extrabold shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={fetchData}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-amber-400 transition-all ml-2"
              title="Refresh Data Now"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-zinc-950/90 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/90 text-amber-400 font-mono text-[11px] uppercase tracking-wider border-b border-amber-500/20">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Reg ID</th>
                  <th className="py-3.5 px-4 font-bold">Team Leader Details</th>
                  <th className="py-3.5 px-4 font-bold">Dept & Year</th>
                  <th className="py-3.5 px-4 font-bold">Category & Title</th>
                  <th className="py-3.5 px-4 font-bold">Format & Members</th>
                  <th className="py-3.5 px-4 font-bold">Allocated Stage Slot</th>
                  <th className="py-3.5 px-4 font-bold">Contact Info</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-500 text-xs font-mono">
                      No registrations found matching criteria.
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.id} className="hover:bg-amber-950/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">
                        {row.registrationId}
                        <div className="text-[10px] text-zinc-500 font-normal">#{row.queuePosition}</div>
                      </td>
                      <td className="py-3 px-4 text-white font-semibold">
                        {row.teamLeaderName}
                        <div className="text-[10px] text-amber-400 font-mono font-normal">Roll: {row.rollNo || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-300">
                        <div>{row.department || 'N/A'}</div>
                        <div className="text-[10px] text-zinc-500">{row.year || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                          row.eventCategory === 'DANCE'
                            ? 'bg-pink-950 text-pink-300 border border-pink-700/50'
                            : 'bg-purple-950 text-purple-300 border border-purple-700/50'
                        }`}>
                          {row.eventCategory}
                        </span>
                        {row.performanceName && (
                          <div className="text-[11px] text-zinc-300 font-normal mt-0.5">{row.performanceName}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="text-amber-300 font-bold">{row.format || 'SOLO'}</span> ({row.numberOfMembers} member{row.numberOfMembers > 1 ? 's' : ''})
                        {row.membersList && (
                          <div className="text-[10px] text-zinc-400 font-normal max-w-xs truncate" title={row.membersList}>
                            {row.membersList}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-300">
                        {row.slotStartTime} – {row.slotEndTime}
                        <div className="text-[10px] text-zinc-500 font-normal">{row.performanceDuration} mins</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-400">
                        <div>{row.phone}</div>
                        <div className="text-[10px] text-zinc-500">{row.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
