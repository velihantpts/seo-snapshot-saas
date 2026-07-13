'use client';
import { useState, useMemo } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

const STOP = new Set('a an and or the of to in on for with at by from is are as it its'.split(' '));

function slugify(text: string, sep: string, stripStop: boolean, lower: boolean): string {
  const stripped = text.normalize('NFKD').replace(/[̀-ͯ]/g, ''); // remove diacritics
  const cleaned = stripped.replace(/[^a-zA-Z0-9\s-]/g, ' ');
  let words = cleaned.trim().split(/[\s-]+/).filter(Boolean);
  if (stripStop) {
    const filtered = words.filter((w) => !STOP.has(w.toLowerCase()));
    if (filtered.length) words = filtered; // don't return an empty slug if everything was a stop-word
  }
  const out = words.join(sep);
  return lower ? out.toLowerCase() : out;
}

export default function SlugGeneratorClient() {
  const [text, setText] = useState('How to Fix Core Web Vitals in 2026: A Práctical Guide');
  const [sep, setSep] = useState('-');
  const [stripStop, setStripStop] = useState(false);
  const [lower, setLower] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => slugify(text, sep, stripStop, lower), [text, sep, stripStop, lower]);
  const copy = () => { if (!slug) return; navigator.clipboard?.writeText(slug); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs text-white/50 mb-1.5">Title or text</label>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Your page title…" className={field} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="inline-flex rounded-lg border border-white/[0.08] p-0.5 bg-white/[0.02]">
          {([['-', 'Hyphen -'], ['_', 'Underscore _']] as const).map(([s, label]) => (
            <button key={s} onClick={() => setSep(s)} className={`px-3 py-1.5 rounded-md text-xs transition ${sep === s ? 'bg-accent-500/20 text-accent-300' : 'text-white/60 hover:text-white/70'}`}>{label}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer select-none">
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} className="accent-accent-500" /> Lowercase
        </label>
        <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer select-none">
          <input type="checkbox" checked={stripStop} onChange={(e) => setStripStop(e.target.checked)} className="accent-accent-500" /> Remove stop-words
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50 uppercase tracking-wider">Slug</span>
          <button onClick={copy} disabled={!slug} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition disabled:opacity-40">
            {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        <div className="glass-card rounded-lg p-4 font-mono text-[15px] text-accent-200 break-all min-h-[52px] flex items-center">
          {slug || <span className="text-white/30 text-sm">Type a title above…</span>}
        </div>
        <p className="text-xs text-white/50 mt-3 leading-relaxed">
          Accented characters are transliterated (á → a), symbols are dropped, and spaces become your chosen separator. Google treats hyphens as word separators and underscores as joiners — <span className="text-white/60">use hyphens</span> for slugs. Keep them short and descriptive; there&apos;s no need to cram every word in.
        </p>
      </div>
    </div>
  );
}
