'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLocale } from '@/lib/i18n';
import Link from 'next/link';
import { Bell, Plus, Trash2, Globe } from 'lucide-react';

interface Monitor {
  id: string;
  url: string;
  frequency: string;
  lastScore: number | null;
  lastRun: string | null;
  active: boolean;
}

export default function MonitorPage() {
  const { data: session } = useSession();
  const { t } = useLocale();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetch('/api/monitor')
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setMonitors(data); })
        .catch(() => {});
    }
  }, [session]);

  const addMonitor = async () => {
    if (!newUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl, frequency: 'weekly' }),
      });
      if (res.ok) {
        const data = await res.json();
        setMonitors(prev => [data, ...prev]);
        setNewUrl('');
      }
    } catch (e) { if (typeof console !== "undefined") console.error(e); }
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h1 className="text-xl font-medium mb-2">SEO Monitoring</h1>
          <p className="text-white/40 text-sm mb-6">Sign in to set up scheduled SEO checks for your sites.</p>
          <Link href="/login" className="btn-primary text-sm">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-medium tracking-tight">{t('monitor.title')}</h1>
            <p className="text-white/40 text-sm mt-1">{t('monitor.desc')}</p>
          </div>
        </div>

        {/* Add new monitor */}
        <div className="glass-card rounded-xl p-4 mb-8 flex gap-3">
          <input
            type="text"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder={t("monitor.placeholder")}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
            onKeyDown={e => e.key === 'Enter' && addMonitor()}
          />
          <button onClick={addMonitor} disabled={loading} className="btn-primary !py-2 text-sm flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        {/* Monitor list */}
        {monitors.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">{t('monitor.empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monitors.map(m => (
              <div key={m.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm ${
                  m.lastScore ? (m.lastScore >= 75 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400') : 'bg-white/[0.04] text-white/30'
                }`}>
                  {m.lastScore || '—'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate">{m.url}</p>
                  <p className="text-xs text-white/25 mt-0.5">
                    {m.frequency} · {m.lastRun ? `Last check: ${new Date(m.lastRun).toLocaleDateString()}` : 'Not checked yet'}
                  </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${m.active ? 'bg-emerald-400' : 'bg-white/20'}`} />
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-white/15 text-xs mt-12">
          {t('monitor.footer')}
        </p>
      </div>
    </div>
  );
}
