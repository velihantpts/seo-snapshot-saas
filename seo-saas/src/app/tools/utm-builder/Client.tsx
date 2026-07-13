'use client';
import { useState, useMemo } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

interface Utm { source: string; medium: string; campaign: string; term: string; content: string; }
const EMPTY: Utm = { source: '', medium: '', campaign: '', term: '', content: '' };

const presets: { label: string; patch: Partial<Utm> }[] = [
  { label: 'GA4 / generic', patch: { medium: 'referral' } },
  { label: 'Meta / Facebook', patch: { source: 'facebook', medium: 'paid_social' } },
  { label: 'Instagram', patch: { source: 'instagram', medium: 'social' } },
  { label: 'Google Ads', patch: { source: 'google', medium: 'cpc' } },
  { label: 'Email', patch: { source: 'newsletter', medium: 'email' } },
  { label: 'X / Twitter', patch: { source: 'twitter', medium: 'social' } },
];

const FIELDS: { key: keyof Utm; label: string; ph: string; required?: boolean }[] = [
  { key: 'source', label: 'Campaign source', ph: 'google, facebook, newsletter', required: true },
  { key: 'medium', label: 'Campaign medium', ph: 'cpc, email, social', required: true },
  { key: 'campaign', label: 'Campaign name', ph: 'summer_launch', required: true },
  { key: 'term', label: 'Campaign term (optional)', ph: 'paid keywords' },
  { key: 'content', label: 'Campaign content (optional)', ph: 'logolink, textlink' },
];

export default function UtmBuilderClient() {
  const [base, setBase] = useState('');
  const [utm, setUtm] = useState<Utm>(EMPTY);
  const [copied, setCopied] = useState(false);

  const set = (patch: Partial<Utm>) => setUtm((u) => ({ ...u, ...patch }));

  const result = useMemo(() => {
    if (!base.trim()) return '';
    let url: URL;
    try {
      url = new URL(base.trim().match(/^https?:\/\//) ? base.trim() : `https://${base.trim()}`);
    } catch {
      return '';
    }
    const map: [string, string][] = [
      ['utm_source', utm.source], ['utm_medium', utm.medium], ['utm_campaign', utm.campaign],
      ['utm_term', utm.term], ['utm_content', utm.content],
    ];
    for (const [k, v] of map) {
      const clean = v.trim().toLowerCase().replace(/\s+/g, '_');
      if (clean) url.searchParams.set(k, clean);
      else url.searchParams.delete(k);
    }
    return url.toString();
  }, [base, utm]);

  const invalidBase = base.trim().length > 0 && result === '';
  const copy = () => { if (!result) return; navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs text-white/50 mb-1.5">Destination URL <span className="text-accent-400">*</span></label>
        <input value={base} onChange={(e) => setBase(e.target.value)} placeholder="https://seosnapshot.dev/pricing" className={`${field} font-mono`} />
        {invalidBase && <p className="text-xs text-amber-400 mt-1.5">That doesn&apos;t look like a valid URL — check for typos.</p>}
      </div>

      <div>
        <div className="text-xs text-white/50 mb-2">Quick presets</div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button key={p.label} onClick={() => set(p.patch)} className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-accent-300 hover:border-accent-500/30 transition">
              {p.label}
            </button>
          ))}
          <button onClick={() => setUtm(EMPTY)} className="text-xs px-3 py-1.5 rounded-lg text-white/40 hover:text-white/60 transition">Clear</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.key === 'campaign' ? 'sm:col-span-2' : ''}>
            <label className="block text-xs text-white/50 mb-1.5">{f.label} {f.required && <span className="text-accent-400">*</span>}</label>
            <input value={utm[f.key]} onChange={(e) => set({ [f.key]: e.target.value } as Partial<Utm>)} placeholder={f.ph} className={field} />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50 uppercase tracking-wider">Your tagged URL</span>
          <button onClick={copy} disabled={!result} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition disabled:opacity-40">
            {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        <div className="glass-card rounded-lg p-4 font-mono text-[13px] text-accent-200 break-all min-h-[64px] leading-relaxed">
          {result || <span className="text-white/30">Fill the destination URL and parameters above…</span>}
        </div>
        <p className="text-xs text-white/50 mt-3 leading-relaxed">
          Values are lowercased and spaces become underscores so your analytics doesn&apos;t split <span className="font-mono text-white/60">Summer Launch</span> and <span className="font-mono text-white/60">summer_launch</span> into two campaigns. Keep source/medium/campaign consistent across every link.
        </p>
      </div>
    </div>
  );
}
