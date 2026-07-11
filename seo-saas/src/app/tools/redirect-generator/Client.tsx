'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, Plus, X } from 'lucide-react';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

interface Row { from: string; to: string; }
type Server = 'apache' | 'nginx';

export default function RedirectGeneratorClient() {
  const [rows, setRows] = useState<Row[]>([{ from: '/old-page', to: 'https://example.com/new-page' }]);
  const [code, setCode] = useState<'301' | '302'>('301');
  const [server, setServer] = useState<Server>('apache');
  const [copied, setCopied] = useState(false);

  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));

  const valid = rows.filter(r => r.from.trim() && r.to.trim());

  const output = (() => {
    if (!valid.length) return '';
    if (server === 'apache') {
      return valid.map(r => `Redirect ${code} ${r.from.trim()} ${r.to.trim()}`).join('\n');
    }
    const flag = code === '301' ? 'permanent' : 'redirect';
    return valid.map(r => `location = ${r.from.trim()} { return ${code} ${r.to.trim()}; }  # ${flag}`).join('\n');
  })();

  const copy = () => { navigator.clipboard?.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-white/[0.08] p-0.5 bg-white/[0.02]">
            {(['301', '302'] as const).map(c => (
              <button key={c} onClick={() => setCode(c)} className={`px-3 py-1.5 rounded-md text-xs transition ${code === c ? 'bg-accent-500/20 text-accent-300' : 'text-white/60 hover:text-white/70'}`}>{c} {c === '301' ? 'permanent' : 'temporary'}</button>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/60">From = the old path on your site. To = the full destination URL.</p>
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={r.from} onChange={e => update(i, { from: e.target.value })} placeholder="/old-page" className={`${field} font-mono`} />
            <span className="text-white/30">→</span>
            <input value={r.to} onChange={e => update(i, { to: e.target.value })} placeholder="https://example.com/new" className={`${field} font-mono`} />
            <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="text-white/25 hover:text-white/60 transition p-1"><X className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={() => setRows([...rows, { from: '', to: '' }])} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition"><Plus className="w-3.5 h-3.5" /> Add redirect</button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex rounded-lg border border-white/[0.08] p-0.5 bg-white/[0.02]">
            {(['apache', 'nginx'] as const).map(s => (
              <button key={s} onClick={() => setServer(s)} className={`px-3 py-1.5 rounded-md text-xs capitalize transition ${server === s ? 'bg-accent-500/20 text-accent-300' : 'text-white/60 hover:text-white/70'}`}>{s === 'apache' ? '.htaccess (Apache)' : 'Nginx'}</button>
            ))}
          </div>
          <button onClick={copy} disabled={!output} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition disabled:opacity-40">
            {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words min-h-[220px] overflow-auto">{output || 'Add redirects to generate config…'}</pre>
        <p className="text-xs text-white/55 mt-3 leading-relaxed">
          {server === 'apache'
            ? 'Add to your .htaccess in the site root. Requires mod_alias (enabled by default on most Apache hosts).'
            : 'Add inside the relevant server { } block, then reload Nginx (nginx -s reload).'}
        </p>
        <div className="mt-4 glass-card rounded-lg p-4 text-center">
          <p className="text-white/50 text-sm mb-2">Migrating a site? Check for broken links &amp; redirect chains.</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
