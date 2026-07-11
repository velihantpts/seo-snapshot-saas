'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, Download, AlertTriangle } from 'lucide-react';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

const FREQS = ['(none)', 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

function escXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export default function SitemapGeneratorClient() {
  const [raw, setRaw] = useState('');
  const [freq, setFreq] = useState('(none)');
  const [priority, setPriority] = useState('(none)');
  const [lastmod, setLastmod] = useState(false);
  const [copied, setCopied] = useState(false);

  const urls = useMemo(() => {
    const seen = new Set<string>();
    const valid: string[] = [];
    const invalid: string[] = [];
    raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean).forEach(l => {
      try {
        const u = new URL(l);
        if (!/^https?:$/.test(u.protocol)) throw new Error();
        const s = u.toString();
        if (!seen.has(s)) { seen.add(s); valid.push(s); }
      } catch { invalid.push(l); }
    });
    return { valid, invalid };
  }, [raw]);

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const xml = useMemo(() => {
    if (!urls.valid.length) return '';
    const dateStr = lastmod ? today() : '';
    const body = urls.valid.map(u => {
      const parts = [`  <url>`, `    <loc>${escXml(u)}</loc>`];
      if (dateStr) parts.push(`    <lastmod>${dateStr}</lastmod>`);
      if (freq !== '(none)') parts.push(`    <changefreq>${freq}</changefreq>`);
      if (priority !== '(none)') parts.push(`    <priority>${priority}</priority>`);
      parts.push(`  </url>`);
      return parts.join('\n');
    }).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
  }, [urls.valid, freq, priority, lastmod]); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = () => { navigator.clipboard?.writeText(xml); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const download = () => {
    const blob = new Blob([xml], { type: 'application/xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="flex items-center justify-between text-xs text-white/40 mb-1.5">
            <span>Your URLs (one per line)</span>
            <span className="text-white/30">{urls.valid.length} valid{urls.invalid.length ? ` · ${urls.invalid.length} skipped` : ''}</span>
          </label>
          <textarea value={raw} onChange={e => setRaw(e.target.value)} rows={12}
            placeholder={'https://example.com/\nhttps://example.com/about\nhttps://example.com/blog/post-1'}
            className={`${field} font-mono`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">changefreq</label>
            <select value={freq} onChange={e => setFreq(e.target.value)} className={field}>
              {FREQS.map(f => <option key={f} value={f} className="bg-surface">{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className={field}>
              {['(none)', '1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3'].map(p => <option key={p} value={p} className="bg-surface">{p}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
          <input type="checkbox" checked={lastmod} onChange={e => setLastmod(e.target.checked)} className="accent-accent-500" />
          Add <code className="text-accent-300">&lt;lastmod&gt;</code> with today&apos;s date
        </label>
        {urls.valid.length > 50000 && (
          <div className="flex items-start gap-2 text-xs text-amber-400/90 bg-amber-500/[0.06] border border-amber-500/15 rounded-lg p-2.5">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> <span>A single sitemap is capped at 50,000 URLs / 50MB. Split into multiple sitemaps and link them from a sitemap index.</span>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/40">sitemap.xml</span>
          <div className="flex items-center gap-3">
            <button onClick={download} disabled={!xml} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition disabled:opacity-40"><Download className="w-3.5 h-3.5" /> Download</button>
            <button onClick={copy} disabled={!xml} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition disabled:opacity-40">
              {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
        </div>
        <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words min-h-[320px] max-h-[520px] overflow-auto">{xml || 'Paste your URLs to build a valid XML sitemap…'}</pre>
        <p className="text-xs text-white/35 mt-3">Upload to your domain root (e.g. <code className="text-accent-300">/sitemap.xml</code>) and submit it in Google Search Console.</p>
        <div className="mt-4 glass-card rounded-lg p-4 text-center">
          <p className="text-white/50 text-sm mb-2">Want to check indexing &amp; crawl issues too?</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
