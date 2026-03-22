'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Upload, Loader2, Download, ExternalLink } from 'lucide-react';

interface BulkResult { url: string; score: number; issues: number; status: 'pending' | 'running' | 'done' | 'error'; error?: string; id?: string; }

export default function BulkPage() {
  const { data: session } = useSession();
  const [urls, setUrls] = useState<BulkResult[]>([]);
  const [running, setRunning] = useState(false);
  const [input, setInput] = useState('');

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
      const parsed = lines.map(l => l.split(',')[0].trim()).filter(u => u.includes('.'));
      setUrls(parsed.map(u => ({ url: u.startsWith('http') ? u : `https://${u}`, score: 0, issues: 0, status: 'pending' })));
    };
    reader.readAsText(file);
  };

  const handlePaste = () => {
    const lines = input.split('\n').map(l => l.trim()).filter(l => l && l.includes('.'));
    setUrls(lines.map(u => ({ url: u.startsWith('http') ? u : `https://${u}`, score: 0, issues: 0, status: 'pending' })));
    setInput('');
  };

  const runAll = async () => {
    setRunning(true);
    for (let i = 0; i < urls.length; i++) {
      setUrls(prev => prev.map((u, j) => j === i ? { ...u, status: 'running' } : u));
      try {
        const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: urls[i].url }) });
        if (res.ok) {
          const data = await res.json();
          setUrls(prev => prev.map((u, j) => j === i ? { ...u, score: data.score, issues: data.issues?.length || 0, status: 'done', id: data.id } : u));
        } else {
          const err = await res.json().catch(() => ({ error: 'Failed' }));
          setUrls(prev => prev.map((u, j) => j === i ? { ...u, status: 'error', error: err.error } : u));
        }
      } catch (err) {
        setUrls(prev => prev.map((u, j) => j === i ? { ...u, status: 'error', error: 'Network error' } : u));
      }
      // Small delay between requests
      await new Promise(r => setTimeout(r, 1000));
    }
    setRunning(false);
  };

  const exportCSV = () => {
    const header = 'URL,Score,Issues,Status\n';
    const rows = urls.map(u => `${u.url},${u.score},${u.issues},${u.status}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'seo-bulk-results.csv'; a.click();
  };

  const doneCount = urls.filter(u => u.status === 'done').length;
  const avgScore = doneCount > 0 ? Math.round(urls.filter(u => u.status === 'done').reduce((s, u) => s + u.score, 0) / doneCount) : 0;

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2">Bulk SEO Analysis</h1>
        <p className="text-white/50 mb-8">Upload a CSV or paste URLs to analyze multiple sites at once.</p>

        {!session && (
          <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4 mb-6 text-amber-300 text-sm">
            Sign in to save analysis results to your dashboard.
          </div>
        )}

        {urls.length === 0 ? (
          <div className="space-y-6">
            {/* CSV Upload */}
            <div className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-accent-400/30 transition-colors">
              <Upload className="w-10 h-10 text-white/30 mx-auto mb-4" />
              <p className="text-white/50 mb-3">Drop a CSV file or click to upload</p>
              <p className="text-white/30 text-xs mb-4">One URL per line, or first column of CSV</p>
              <input type="file" accept=".csv,.txt" onChange={handleCSV} className="hidden" id="csv-upload" />
              <label htmlFor="csv-upload" className="px-6 py-2.5 rounded-full bg-accent-500 text-white text-sm font-medium cursor-pointer hover:bg-accent-600 transition-colors">
                Choose File
              </label>
            </div>

            {/* Or paste */}
            <div className="text-center text-white/30 text-xs">OR</div>

            <div>
              <textarea
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Paste URLs here (one per line)&#10;https://example.com&#10;https://another-site.com"
                className="w-full h-32 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-400/40 resize-none"
              />
              <button onClick={handlePaste} disabled={!input.trim()} className="mt-3 px-6 py-2.5 rounded-full bg-accent-500 text-white text-sm font-medium disabled:opacity-30">
                Add URLs
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Summary bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-white/50">{urls.length} URLs</span>
                {doneCount > 0 && <span className="text-emerald-400">{doneCount} done</span>}
                {doneCount > 0 && <span className="text-white/50">Avg: {avgScore}/100</span>}
              </div>
              <div className="flex gap-3">
                {!running && doneCount < urls.length && (
                  <button onClick={runAll} className="px-5 py-2 rounded-full bg-accent-500 text-white text-sm font-medium hover:bg-accent-600">
                    Analyze All
                  </button>
                )}
                {doneCount > 0 && (
                  <button onClick={exportCSV} className="px-5 py-2 rounded-full border border-white/10 text-white/60 text-sm hover:bg-white/5">
                    <Download className="w-3.5 h-3.5 inline mr-1.5" /> Export CSV
                  </button>
                )}
                <button onClick={() => setUrls([])} className="px-5 py-2 rounded-full border border-white/10 text-white/40 text-sm hover:bg-white/5">
                  Clear
                </button>
              </div>
            </div>

            {/* Results table */}
            <div className="border border-white/[0.06] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left p-3 text-white/40 font-medium">URL</th>
                    <th className="text-center p-3 text-white/40 font-medium w-20">Score</th>
                    <th className="text-center p-3 text-white/40 font-medium w-20">Issues</th>
                    <th className="text-center p-3 text-white/40 font-medium w-24">Status</th>
                    <th className="text-center p-3 text-white/40 font-medium w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((u, i) => (
                    <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="p-3 text-white/70 truncate max-w-[300px]">{u.url}</td>
                      <td className="p-3 text-center">
                        {u.status === 'done' && (
                          <span className={u.score >= 80 ? 'text-emerald-400 font-bold' : u.score >= 50 ? 'text-amber-400 font-bold' : 'text-red-400 font-bold'}>
                            {u.score}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center text-white/50">{u.status === 'done' ? u.issues : ''}</td>
                      <td className="p-3 text-center">
                        {u.status === 'pending' && <span className="text-white/30">Pending</span>}
                        {u.status === 'running' && <Loader2 className="w-4 h-4 animate-spin text-accent-400 mx-auto" />}
                        {u.status === 'done' && <span className="text-emerald-400">Done</span>}
                        {u.status === 'error' && <span className="text-red-400 text-xs">{u.error || 'Error'}</span>}
                      </td>
                      <td className="p-3 text-center">
                        {u.id && <a href={`/analyze/${u.id}`} className="text-accent-400 hover:text-accent-300"><ExternalLink className="w-3.5 h-3.5" /></a>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
