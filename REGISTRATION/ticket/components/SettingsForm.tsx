'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Check } from 'lucide-react';

export default function SettingsForm() {
  const [eventStartTime, setEventStartTime] = useState('14:00');
  const [musicDuration, setMusicDuration] = useState(10);
  const [danceDuration, setDanceDuration] = useState(10);
  const [setupGap, setSetupGap] = useState(2);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setEventStartTime(data.data.eventStartTime);
        setMusicDuration(data.data.musicDuration);
        setDanceDuration(data.data.danceDuration);
        setSetupGap(data.data.setupGap);
      }
    } catch {
      setError('Failed to load event settings');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventStartTime,
          musicDuration: Number(musicDuration),
          danceDuration: Number(danceDuration),
          setupGap: Number(setupGap)
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <Settings className="w-5 h-5 text-orange-400" />
        <div>
          <h3 className="font-extrabold text-lg text-white">Event Timing & Slot Settings</h3>
          <p className="text-xs text-zinc-400">Configure global performance durations & stage setup gap.</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs font-medium">
          {error}
        </div>
      )}

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4" /> Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Event Start Time *
          </label>
          <input
            type="text"
            value={eventStartTime}
            onChange={(e) => setEventStartTime(e.target.value)}
            placeholder="14:00 or 2:00 PM"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Stage Setup Gap (mins) *
          </label>
          <input
            type="number"
            min="0"
            value={setupGap}
            onChange={(e) => setSetupGap(parseInt(e.target.value, 10) || 0)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Music Duration (mins) *
          </label>
          <input
            type="number"
            min="1"
            value={musicDuration}
            onChange={(e) => setMusicDuration(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Dance Duration (mins) *
          </label>
          <input
            type="number"
            min="1"
            value={danceDuration}
            onChange={(e) => setDanceDuration(parseInt(e.target.value, 10) || 1)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
            required
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'SAVE SETTINGS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
