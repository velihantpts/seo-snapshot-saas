'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle } from 'lucide-react';

export default function RobotsTxtGeneratorClient() {
  const [mode, setMode] = useState<'allow' | 'block'>('allow');
  const [sitemap, setSitemap] = useState('');
  const [disallow, setDisallow] = useState('/admin/\n/cgi-bin/');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [copied, setCopied] = useState(false);

  const lines: string[] = ['User-agent: *'];
  if (mode === 'block') {
    lines.push('Disallow: /');
  } else {
    const paths = disallow.split('\n').map(s => s.trim()).filter(Boolean);
    if (paths.length === 0) lines.push('Disallow:');
    else paths.forEach(p => lines.push(`Disallow: ${p.startsWith('/') ? p : '/' + p}`));
  }
  if (crawlDelay.trim()) lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
  if (sitemap.trim()) { lines.push(''); lines.push(`Sitemap: ${sitemap.trim()}`); }
  const output = lines.join('\n');

  const copy = () => { navigator.clipboard?.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const field = 'w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Crawling</label>
          <div className="flex gap-2">
            <button onClick={() => setMode('allow')} className={`flex-1 py-2.5 rounded-lg text-sm transition ${mode === 'allow' ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30' : 'bg-white/[0.04] text-white/50 border border-white/[0.06]'}`}>Allow all (recommended)</button>
            <button onClick={() => setMode('block')} className={`flex-1 py-2.5 rounded-lg text-sm transition ${mode === 'block' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-white/[0.04] text-white/50 border border-white/[0.06]'}`}>Block all</button>
          </div>
        </div>
        {mode === 'allow' && (
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Disallow paths (one per line)</label>
            <textarea value={disallow} onChange={e => setDisallow(e.target.value)} placeholder="/admin/&#10;/private/" rows={5} className={field + ' font-mono'} />
          </div>
        )}
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Sitemap URL</label>
          <input value={sitemap} onChange={e => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" className={field} />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">Crawl-delay (seconds, optional)</label>
          <input value={crawlDelay} onChange={e => setCrawlDelay(e.target.value.replace(/[^0-9]/g, ''))} placeholder="e.g. 10 (leave empty for none)" className={field} />
        </div>
        {mode === 'block' && (
          <p className="text-amber-400/80 text-xs">⚠️ &quot;Block all&quot; hides your entire site from search engines. Only use on staging.</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/40">robots.txt</span>
          <button onClick={copy} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition">
            {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words min-h-[220px]">{output}</pre>
        <p className="text-white/30 text-xs mt-2">Save as <code className="text-accent-300">robots.txt</code> in your site root: <code className="text-accent-300">https://yoursite.com/robots.txt</code></p>
        <div className="mt-4 glass-card rounded-lg p-4 text-center">
          <p className="text-white/50 text-sm mb-2">Check your live robots.txt &amp; crawlability</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
