'use client';
import { useState } from 'react';
import { Copy, CheckCircle, XCircle, Search, ShieldCheck } from 'lucide-react';

const field = 'flex-1 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

interface HeaderResult { name: string; present: boolean; value: string | null; advice: string; fix: string; }
interface Result { url: string; https: boolean; status: number; grade: string; points: number; headers: HeaderResult[]; }

const gradeColor = (g: string) =>
  g === 'A+' || g === 'A' ? 'text-emerald-400 border-emerald-400/30' :
  g === 'B' ? 'text-accent-300 border-accent-400/30' :
  g === 'C' ? 'text-amber-400 border-amber-400/30' :
  'text-red-400 border-red-400/30';

export default function SecurityHeaderCheckerClient() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState('');

  const run = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/tools/headers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Check failed.'); }
      else setResult(data);
    } catch { setError('Network error. Please try again.'); }
    setLoading(false);
  };

  const copy = (text: string, key: string) => { navigator.clipboard?.writeText(text); setCopied(key); setTimeout(() => setCopied(''), 2000); };
  const missing = result?.headers.filter((h) => !h.present) || [];
  const allFixes = missing.map((h) => h.fix).join('\n');

  return (
    <div>
      <form onSubmit={run} className="flex gap-2">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className={`${field} font-mono`} />
        <button type="submit" disabled={loading || !url.trim()} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40">
          {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Checking…</> : <><Search className="w-4 h-4" /> Check</>}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      {result && (
        <div className="mt-6 space-y-5">
          <div className="flex items-center gap-4 glass-card rounded-xl p-5">
            <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${gradeColor(result.grade)}`}>{result.grade}</div>
            <div className="min-w-0">
              <div className="text-sm text-white/80 font-mono truncate">{result.url}</div>
              <div className="text-xs text-white/50 mt-1">
                {result.headers.filter((h) => h.present).length} of {result.headers.length} headers present · {result.https ? 'HTTPS ✓' : 'not HTTPS'} · {result.points}/100
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {result.headers.map((h) => (
              <div key={h.name} className="glass-card rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {h.present
                    ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white/85 font-mono">{h.name}</span>
                      {!h.present && (
                        <button onClick={() => copy(h.fix, h.name)} className="text-[11px] text-accent-400 hover:text-accent-300 flex items-center gap-1 flex-shrink-0">
                          {copied === h.name ? <><CheckCircle className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy fix</>}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">{h.advice}</p>
                    {h.present && h.value && <p className="text-[11px] text-white/35 font-mono mt-1 break-all">{h.value}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {missing.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> All missing headers (nginx)</span>
                <button onClick={() => copy(allFixes, 'all')} className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1.5">
                  {copied === 'all' ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy all</>}
                </button>
              </div>
              <pre className="glass-card rounded-lg p-4 text-[12px] text-accent-200/90 font-mono whitespace-pre-wrap break-words overflow-auto leading-relaxed">{allFixes}</pre>
              <p className="text-xs text-white/50 mt-3">On Apache, translate each line to <span className="font-mono text-white/60">Header always set &lt;Name&gt; &quot;&lt;value&gt;&quot;</span>. On Next.js, add them under <span className="font-mono text-white/60">headers()</span> in next.config.js.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
