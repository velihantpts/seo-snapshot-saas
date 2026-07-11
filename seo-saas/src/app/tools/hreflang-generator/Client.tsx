'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, Plus, X } from 'lucide-react';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

const COMMON = ['en', 'en-US', 'en-GB', 'es', 'es-ES', 'es-MX', 'de', 'de-DE', 'fr', 'fr-FR', 'it', 'pt', 'pt-BR', 'nl', 'tr', 'ru', 'ar', 'ja', 'ko', 'zh', 'zh-CN', 'zh-TW', 'hi'];

interface Row { lang: string; url: string; }

const codeOk = (c: string) => /^[a-z]{2,3}(-[A-Z]{2})?$/.test(c.trim());

export default function HreflangGeneratorClient() {
  const [rows, setRows] = useState<Row[]>([{ lang: 'en', url: '' }, { lang: 'es', url: '' }]);
  const [xDefault, setXDefault] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const add = () => setRows([...rows, { lang: '', url: '' }]);
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));

  const esc = (s: string) => s.replace(/"/g, '&quot;');
  const lines = rows
    .filter(r => r.lang.trim() && r.url.trim())
    .map(r => `<link rel="alternate" hreflang="${esc(r.lang.trim())}" href="${esc(r.url.trim())}">`);
  if (xDefault.trim()) lines.push(`<link rel="alternate" hreflang="x-default" href="${esc(xDefault.trim())}">`);
  const output = lines.join('\n');

  const copy = () => {
    navigator.clipboard?.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badCodes = rows.filter(r => r.lang.trim() && !codeOk(r.lang));

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <p className="text-xs text-white/60">One row per language/region version of the page.</p>
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input list="hreflang-codes" value={r.lang} onChange={e => update(i, { lang: e.target.value })} placeholder="en-US" className={`${field} w-28 font-mono ${r.lang && !codeOk(r.lang) ? 'border-amber-500/40' : ''}`} />
            <input value={r.url} onChange={e => update(i, { url: e.target.value })} placeholder="https://example.com/en/page" className={field} />
            <button onClick={() => remove(i)} className="text-white/25 hover:text-white/60 transition p-1"><X className="w-4 h-4" /></button>
          </div>
        ))}
        <datalist id="hreflang-codes">{COMMON.map(c => <option key={c} value={c} />)}</datalist>
        <button onClick={add} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition"><Plus className="w-3.5 h-3.5" /> Add language</button>

        <div className="pt-3 border-t border-white/[0.06]">
          <label className="block text-xs text-white/60 mb-1.5">x-default URL <span className="text-white/25">(fallback for unmatched locales — recommended)</span></label>
          <input value={xDefault} onChange={e => setXDefault(e.target.value)} placeholder="https://example.com/" className={field} />
        </div>

        {badCodes.length > 0 && (
          <p className="text-xs text-amber-400/90">Check the highlighted codes — hreflang uses ISO 639-1 language and optional ISO 3166-1 region, e.g. <code>en</code>, <code>en-GB</code>, <code>pt-BR</code>.</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/60">Generated hreflang tags</span>
          <button onClick={copy} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition">
            {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words min-h-[220px] overflow-auto">{output || 'Add languages and URLs to generate hreflang tags…'}</pre>
        <p className="text-xs text-white/55 mt-3 leading-relaxed">Place these in the <code className="text-accent-300">&lt;head&gt;</code> of <em>every</em> language version. Each page must list all versions including itself, and the links must be reciprocal.</p>
        <div className="mt-4 glass-card rounded-lg p-4 text-center">
          <p className="text-white/50 text-sm mb-2">Running a multi-language site?</p>
          <Link href="/" className="btn-primary text-sm">Audit any URL free</Link>
        </div>
      </div>
    </div>
  );
}
