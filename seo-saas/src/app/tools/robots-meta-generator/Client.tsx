'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle } from 'lucide-react';

const field = 'w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

export default function RobotsMetaGeneratorClient() {
  const [index, setIndex] = useState(true);
  const [follow, setFollow] = useState(true);
  const [noarchive, setNoarchive] = useState(false);
  const [nosnippet, setNosnippet] = useState(false);
  const [noimageindex, setNoimageindex] = useState(false);
  const [maxSnippet, setMaxSnippet] = useState(false);
  const [maxImagePreview, setMaxImagePreview] = useState(false);
  const [canonical, setCanonical] = useState('');
  const [copied, setCopied] = useState(false);

  const directives: string[] = [];
  directives.push(index ? 'index' : 'noindex');
  directives.push(follow ? 'follow' : 'nofollow');
  if (noarchive) directives.push('noarchive');
  if (nosnippet) directives.push('nosnippet');
  if (noimageindex) directives.push('noimageindex');
  if (maxSnippet) directives.push('max-snippet:-1');
  if (maxImagePreview) directives.push('max-image-preview:large');
  const content = directives.join(', ');

  const lines: string[] = [`<meta name="robots" content="${content}">`];
  if (canonical.trim()) lines.push(`<link rel="canonical" href="${canonical.trim().replace(/"/g, '&quot;')}">`);
  const meta = lines.join('\n');
  const header = `X-Robots-Tag: ${content}`;

  const copy = (text: string) => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const Toggle = ({ on, set, label, hint }: { on: boolean; set: (v: boolean) => void; label: string; hint: string }) => (
    <label className="flex items-start gap-3 glass-card rounded-lg p-3 cursor-pointer">
      <input type="checkbox" checked={on} onChange={e => set(e.target.checked)} className="accent-accent-500 mt-0.5" />
      <span>
        <span className="text-sm text-white/80 font-mono">{label}</span>
        <span className="block text-xs text-white/40 mt-0.5">{hint}</span>
      </span>
    </label>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 glass-card rounded-lg p-3 cursor-pointer">
            <input type="checkbox" checked={index} onChange={e => setIndex(e.target.checked)} className="accent-accent-500" />
            <span className="text-sm text-white/80 font-mono">{index ? 'index' : 'noindex'}</span>
          </label>
          <label className="flex items-center gap-2 glass-card rounded-lg p-3 cursor-pointer">
            <input type="checkbox" checked={follow} onChange={e => setFollow(e.target.checked)} className="accent-accent-500" />
            <span className="text-sm text-white/80 font-mono">{follow ? 'follow' : 'nofollow'}</span>
          </label>
        </div>
        <Toggle on={noarchive} set={setNoarchive} label="noarchive" hint="Don’t show a cached copy." />
        <Toggle on={nosnippet} set={setNosnippet} label="nosnippet" hint="Don’t show a text snippet in results." />
        <Toggle on={noimageindex} set={setNoimageindex} label="noimageindex" hint="Don’t index images on this page." />
        <Toggle on={maxSnippet} set={setMaxSnippet} label="max-snippet:-1" hint="Allow any snippet length." />
        <Toggle on={maxImagePreview} set={setMaxImagePreview} label="max-image-preview:large" hint="Allow large image previews." />
        <div className="pt-2">
          <label className="block text-xs text-white/40 mb-1.5">Canonical URL (optional)</label>
          <input value={canonical} onChange={e => setCanonical(e.target.value)} placeholder="https://example.com/page" className={field} />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/40">In your &lt;head&gt;</span>
            <button onClick={() => copy(meta)} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition">
              {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words overflow-auto">{meta}</pre>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/40">As an HTTP header (for non-HTML files)</span>
            <button onClick={() => copy(header)} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition"><Copy className="w-3.5 h-3.5" /> Copy</button>
          </div>
          <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words overflow-auto">{header}</pre>
        </div>
        {!index && (
          <p className="text-xs text-amber-400/90">noindex only works if the page is crawlable — don&apos;t also block it in robots.txt, or Google can&apos;t see the noindex.</p>
        )}
        <div className="glass-card rounded-lg p-4 text-center">
          <p className="text-white/50 text-sm mb-2">Check indexability on a live page</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
