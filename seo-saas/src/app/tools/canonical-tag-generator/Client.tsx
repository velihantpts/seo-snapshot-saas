'use client';
import { useState, useMemo } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

const TRACKING = /^(utm_|fbclid$|gclid$|ref$|mc_|_hs|igshid$)/i;

function normalize(input: string, opts: { forceHttps: boolean; stripTracking: boolean; stripTrailing: boolean }): string {
  let raw = input.trim();
  if (!raw) return '';
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
  let u: URL;
  try { u = new URL(raw); } catch { return ''; }
  if (opts.forceHttps) u.protocol = 'https:';
  u.hostname = u.hostname.toLowerCase();
  if (opts.stripTracking) {
    for (const k of Array.from(u.searchParams.keys())) if (TRACKING.test(k)) u.searchParams.delete(k);
  }
  let out = u.toString();
  if (opts.stripTrailing && u.pathname !== '/' && out.endsWith('/')) out = out.slice(0, -1);
  return out;
}

export default function CanonicalTagClient() {
  const [url, setUrl] = useState('https://Example.com/Blog/My-Post/?utm_source=twitter');
  const [forceHttps, setForceHttps] = useState(true);
  const [stripTracking, setStripTracking] = useState(true);
  const [stripTrailing, setStripTrailing] = useState(false);
  const [copied, setCopied] = useState('');

  const canonical = useMemo(() => normalize(url, { forceHttps, stripTracking, stripTrailing }), [url, forceHttps, stripTracking, stripTrailing]);
  const invalid = url.trim().length > 0 && canonical === '';

  const outputs = canonical ? [
    { key: 'html', label: 'HTML (in <head>)', code: `<link rel="canonical" href="${canonical}" />` },
    { key: 'next', label: 'Next.js (App Router metadata)', code: `export const metadata = {\n  alternates: { canonical: '${canonical}' },\n};` },
    { key: 'header', label: 'HTTP header', code: `Link: <${canonical}>; rel="canonical"` },
  ] : [];

  const copy = (code: string, key: string) => { navigator.clipboard?.writeText(code); setCopied(key); setTimeout(() => setCopied(''), 2000); };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs text-white/50 mb-1.5">Page URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" className={`${field} font-mono`} />
        {invalid && <p className="text-xs text-amber-400 mt-1.5">That doesn&apos;t look like a valid URL.</p>}
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          { label: 'Force HTTPS', v: forceHttps, set: setForceHttps },
          { label: 'Strip tracking params', v: stripTracking, set: setStripTracking },
          { label: 'Remove trailing slash', v: stripTrailing, set: setStripTrailing },
        ].map((o) => (
          <label key={o.label} className="flex items-center gap-2 text-xs text-white/60 cursor-pointer select-none">
            <input type="checkbox" checked={o.v} onChange={(e) => o.set(e.target.checked)} className="accent-accent-500" /> {o.label}
          </label>
        ))}
      </div>

      <div className="space-y-3">
        {outputs.length === 0 ? (
          <div className="glass-card rounded-lg p-5 text-sm text-white/40 text-center">Enter a URL to generate the canonical tag…</div>
        ) : outputs.map((o) => (
          <div key={o.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/50">{o.label}</span>
              <button onClick={() => copy(o.code, o.key)} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition">
                {copied === o.key ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            </div>
            <pre className="glass-card rounded-lg p-3.5 text-[13px] text-accent-200/90 font-mono whitespace-pre-wrap break-all leading-relaxed">{o.code}</pre>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/50 leading-relaxed">
        A canonical should be absolute, use your real protocol and host, and point to the clean version of the page. The safest default is a <span className="text-white/60">self-referencing</span> canonical on every indexable page — it pre-empts duplicates from tracking parameters and trailing-slash variants.
      </p>
    </div>
  );
}
