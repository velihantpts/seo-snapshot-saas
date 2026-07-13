'use client';
import { useState } from 'react';
import { Copy, CheckCircle, Search, ArrowDown } from 'lucide-react';

const field = 'flex-1 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

interface Hop { url: string; status: number; statusText: string; location: string | null; }
interface Result { finalUrl: string; status: number; statusText: string; redirects: number; chain: Hop[]; headers: { name: string; value: string }[]; }

const statusColor = (s: number) =>
  s >= 200 && s < 300 ? 'text-emerald-400 border-emerald-400/30' :
  s >= 300 && s < 400 ? 'text-amber-400 border-amber-400/30' :
  'text-red-400 border-red-400/30';

// Headers worth calling out for SEO/perf/security.
const NOTABLE = new Set(['content-type', 'cache-control', 'content-encoding', 'strict-transport-security', 'x-robots-tag', 'location', 'server', 'last-modified', 'etag', 'content-security-policy', 'x-frame-options', 'link']);

export default function HttpHeaderCheckerClient() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const run = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/tools/http-headers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Check failed.');
      else setResult(data);
    } catch { setError('Network error. Please try again.'); }
    setLoading(false);
  };

  const copyAll = () => {
    if (!result) return;
    const raw = result.headers.map((h) => `${h.name}: ${h.value}`).join('\n');
    navigator.clipboard?.writeText(raw); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <form onSubmit={run} className="flex gap-2">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className={`${field} font-mono`} />
        <button type="submit" disabled={loading || !url.trim()} className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40">
          {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Fetching…</> : <><Search className="w-4 h-4" /> Check</>}
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      {result && (
        <div className="mt-6 space-y-5">
          <div className="flex items-center gap-4 glass-card rounded-xl p-5">
            <div className={`px-3 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-bold tabular-nums ${statusColor(result.status)}`}>{result.status}</div>
            <div className="min-w-0">
              <div className="text-sm text-white/80 font-mono truncate">{result.finalUrl}</div>
              <div className="text-xs text-white/50 mt-1">{result.statusText || 'OK'} · {result.headers.length} headers{result.redirects > 0 ? ` · ${result.redirects} redirect${result.redirects > 1 ? 's' : ''}` : ' · no redirects'}</div>
            </div>
          </div>

          {result.chain.length > 1 && (
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Redirect chain</div>
              <div className="glass-card rounded-lg p-4 space-y-2">
                {result.chain.map((h, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-2 text-[13px]">
                      <span className={`font-mono font-medium ${statusColor(h.status).split(' ')[0]}`}>{h.status}</span>
                      <span className="font-mono text-white/60 break-all">{h.url}</span>
                    </div>
                    {h.location && i < result.chain.length - 1 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-white/35 pl-8 mt-0.5"><ArrowDown className="w-3 h-3" /> {h.location}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50 uppercase tracking-wider">Response headers</span>
              <button onClick={copyAll} className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1.5">
                {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy all</>}
              </button>
            </div>
            <div className="glass-card rounded-lg overflow-hidden">
              <table className="w-full text-[13px]">
                <tbody>
                  {result.headers.map((h) => (
                    <tr key={h.name} className="border-b border-white/[0.04] last:border-0 align-top">
                      <td className={`px-4 py-2 font-mono whitespace-nowrap ${NOTABLE.has(h.name) ? 'text-accent-300' : 'text-white/70'}`}>{h.name}</td>
                      <td className="px-4 py-2 font-mono text-white/55 break-all">{h.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-white/50 mt-3 leading-relaxed">
              Highlighted headers are the ones that most affect SEO and performance — <span className="font-mono text-accent-300/80">content-type</span>, <span className="font-mono text-accent-300/80">cache-control</span>, <span className="font-mono text-accent-300/80">x-robots-tag</span>, <span className="font-mono text-accent-300/80">content-encoding</span> and the security headers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
