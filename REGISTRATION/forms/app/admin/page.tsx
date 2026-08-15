'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import StatsPanel from '@/src/components/Admin/StatsPanel';
import SettingsForm from '@/src/components/Admin/SettingsForm';
import AdminTable, { RegistrationRecord } from '@/src/components/Admin/AdminTable';
import { ShieldCheck, Lock, LogOut, KeyRound, User } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [data, setData] = useState<RegistrationRecord[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 1
  });

  const [stats, setStats] = useState({
    total: 0,
    registered: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    music: 0,
    dance: 0
  });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // 1. Session check on page mount
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const res = await fetch('/api/admin/check', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Initial admin session check failed:', err);
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuthSession();
  }, []);

  // 2. Fetch live registrations & audit logs directly from PostgreSQL
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '25');
      if (search) params.append('search', search);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      const now = Date.now();
      params.append('_t', now.toString());

      const [resData, resLogs] = await Promise.all([
        fetch(`/api/registrations?${params.toString()}`, { cache: 'no-store' }),
        fetch(`/api/admin/logs?_t=${now}`, { cache: 'no-store' })
      ]);

      if (resData.ok) {
        const json = await resData.json();
        if (json.success) {
          setData(json.data || json.registrations || []);
          if (json.pagination) setPagination(json.pagination);
          if (json.stats) setStats(json.stats);
          setLastUpdated(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
          setApiError(null);
        } else {
          setApiError(json.error || 'Failed to parse database records');
        }
      } else if (resData.status === 401) {
        setIsAuthenticated(false);
        setApiError('Admin session expired or unauthenticated. Please log in again.');
      } else if (resData.status === 403) {
        setApiError('You do not have permission to access registration data.');
      } else if (resData.status === 500) {
        setApiError('Registration database could not be reached (HTTP 500 server error).');
      } else {
        setApiError(`API connection error (Status ${resData.status}).`);
      }

      if (resLogs.ok) {
        const jsonLogs = await resLogs.json();
        if (jsonLogs.success) setAuditLogs(jsonLogs.logs || []);
      }
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setApiError(`Network connection error: ${err.message || 'Failed to reach API'}`);
    }
  }, [isAuthenticated, search, categoryFilter, statusFilter, page]);

  // Initial fetch and 3-second live auto-polling interval
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(() => {
        fetchData();
      }, 3000);
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
        setApiError(null);
      } else {
        setLoginError(json.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', cache: 'no-store' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setData([]);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#1b1226] flex items-center justify-center p-4">
        <div className="text-center font-mono text-amber-300 animate-pulse text-sm">
          ⏳ Verifying admin session credentials...
        </div>
      </div>
    );
  }

  // Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1b1226] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-950/60">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-serif">
              ADMIN <span className="text-amber-400">LOGIN</span>
            </h1>
            <p className="text-xs text-amber-200/60 font-mono">
              Onam Event Registration & Management Portal
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-xs text-red-200 text-center font-semibold">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
            <div>
              <label className="block text-xs font-bold text-amber-200/80 mb-1 tracking-wider uppercase">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  suppressHydrationWarning
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
                  autoComplete="current-password"
                  suppressHydrationWarning
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
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-extrabold text-sm tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-amber-950/50 disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In To Admin Dashboard'}
            </button>
          </form>

          <div className="flex flex-col items-center gap-2 pt-2 text-xs">
            <a href="/" className="text-amber-400 hover:text-amber-300 font-extrabold tracking-wider uppercase underline">
              ← BACK TO MAIN WEBSITE
            </a>
            <a href="/registration" className="text-zinc-400 hover:text-white font-semibold">
              ← BACK TO REGISTRATION
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard View with Live Polling
  return (
    <div className="min-h-screen bg-[#1b1226] text-zinc-100 pb-16">
      {/* Admin Header */}
      <header className="border-b border-amber-500/30 bg-[#1b1226]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-amber-950/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold tracking-tight text-lg leading-none text-white font-serif">
                  ADMIN <span className="text-amber-400">DASHBOARD</span>
                </h1>
                {/* Live Polling Indicator */}
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-[10px] font-mono text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>LIVE</span>
                </div>
              </div>
              <p className="text-xs text-amber-200/60 font-mono mt-0.5">
                Real-time PostgreSQL sync {lastUpdated && `(Last updated: ${lastUpdated})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="px-3.5 py-2 text-xs font-extrabold tracking-wider text-amber-300 hover:text-white bg-amber-950/80 hover:bg-amber-900 border border-amber-800/60 rounded-full transition-all uppercase"
              title="Return to Main Thakrithi Website"
            >
              ← MAIN WEBSITE
            </a>

            <a
              href="/registration"
              className="px-3.5 py-2 text-xs font-bold tracking-wider text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-full transition-all uppercase"
              title="Return to Registration Page"
            >
              REGISTRATION
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider text-rose-300 hover:text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 rounded-full transition-all"
              title="Logout from Admin Panel"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Statistics Bar */}
        <StatsPanel stats={stats} />

        {/* Event Settings Panel */}
        <SettingsForm />

        {/* Live Admin Audit Log Section */}
        <div className="bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📜</span>
              <h2 className="text-base font-extrabold text-white font-serif tracking-tight">
                ADMIN <span className="text-amber-400">AUDIT & ACTIVITY LOGS</span>
              </h2>
              <span className="text-[10px] bg-amber-950/80 border border-amber-800/60 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                {auditLogs.length} Events Logged
              </span>
            </div>
            <button
              onClick={fetchData}
              className="text-xs text-amber-300 hover:text-white font-mono flex items-center gap-1"
            >
              🔄 Refresh Logs
            </button>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-2 text-xs font-mono">
            {auditLogs.length === 0 ? (
              <div className="text-zinc-500 text-center py-4">No audit logs recorded yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-zinc-900/80 border border-zinc-800/80 rounded-xl gap-2 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded ${
                        log.action === 'EDIT_REGISTRATION'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : log.action === 'UPDATE_SETTINGS'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : log.action === 'RESET_ALL'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-zinc-200">{log.description}</span>
                  </div>

                  <span className="text-[10px] text-zinc-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} · {new Date(log.timestamp).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Registrations Management Table with Pagination & Diagnostic Alert */}
        <AdminTable
          data={data}
          pagination={pagination}
          onRefresh={fetchData}
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          page={page}
          setPage={setPage}
          apiError={apiError}
        />
      </main>
    </div>
  );
}
