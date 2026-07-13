'use client';
import { useState, useMemo } from 'react';
import { Copy, CheckCircle, Plus, X } from 'lucide-react';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

type FieldType = 'text' | 'textarea' | 'url' | 'date' | 'datetime-local' | 'number' | 'select';
interface Field { key: string; label: string; ph?: string; type?: FieldType; options?: string[]; }
interface ListSpec { key: string; label: string; addLabel: string; itemFields: Field[]; }
type Vals = Record<string, string>;

export interface SchemaConfig {
  fields: Field[];
  list?: ListSpec;
  build: (v: Vals, items: Vals[]) => Record<string, unknown>;
  defaults?: Vals;
  defaultItems?: Vals[];
}

// Drop empty strings/objects so the JSON-LD stays clean.
export function prune<T>(obj: T): T {
  if (Array.isArray(obj)) return obj.map(prune).filter((x) => x !== undefined && x !== '') as unknown as T;
  if (obj && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const pv = prune(v);
      if (pv === undefined || pv === '' || (typeof pv === 'object' && pv !== null && !Array.isArray(pv) && Object.keys(pv).length === 0)) continue;
      out[k] = pv;
    }
    return out as T;
  }
  return obj;
}

function Input({ f, value, onChange }: { f: Field; value: string; onChange: (v: string) => void }) {
  if (f.type === 'textarea') return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={f.ph} rows={3} className={`${field} resize-y`} />;
  if (f.type === 'select') return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={field}>
      {(f.options || []).map((o) => <option key={o} value={o} className="bg-[#0e141f]">{o}</option>)}
    </select>
  );
  return <input type={f.type === 'url' ? 'text' : (f.type || 'text')} value={value} onChange={(e) => onChange(e.target.value)} placeholder={f.ph} className={`${field}${f.type === 'url' ? ' font-mono' : ''}`} />;
}

export default function SchemaBuilder({ config }: { config: SchemaConfig }) {
  const [vals, setVals] = useState<Vals>(config.defaults || {});
  const [items, setItems] = useState<Vals[]>(config.defaultItems || (config.list ? [{}] : []));
  const [copied, setCopied] = useState(false);

  const set = (k: string, v: string) => setVals((s) => ({ ...s, [k]: v }));
  const setItem = (i: number, k: string, v: string) => setItems((arr) => arr.map((it, idx) => idx === i ? { ...it, [k]: v } : it));

  const json = useMemo(() => {
    const obj = prune(config.build(vals, items));
    return JSON.stringify(obj, null, 2);
  }, [vals, items, config]);

  const output = `<script type="application/ld+json">\n${json}\n</script>`;
  const copy = () => { navigator.clipboard?.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        {config.fields.map((f) => (
          <div key={f.key}>
            <label className="block text-xs text-white/50 mb-1.5">{f.label}</label>
            <Input f={f} value={vals[f.key] || ''} onChange={(v) => set(f.key, v)} />
          </div>
        ))}

        {config.list && (
          <div className="pt-2">
            <div className="text-xs text-white/50 mb-2">{config.list.label}</div>
            <div className="space-y-3">
              {items.map((it, i) => (
                <div key={i} className="glass-card rounded-lg p-3 space-y-2 relative">
                  {items.length > 1 && (
                    <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="absolute top-2 right-2 text-white/25 hover:text-white/60 transition"><X className="w-3.5 h-3.5" /></button>
                  )}
                  {config.list!.itemFields.map((f) => (
                    <div key={f.key}>
                      <label className="block text-[11px] text-white/40 mb-1">{f.label}</label>
                      <Input f={f} value={it[f.key] || ''} onChange={(v) => setItem(i, f.key, v)} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button onClick={() => setItems([...items, {}])} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition mt-3">
              <Plus className="w-3.5 h-3.5" /> {config.list.addLabel}
            </button>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50 uppercase tracking-wider">JSON-LD output</span>
          <button onClick={copy} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition">
            {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        <pre className="glass-card rounded-lg p-4 text-[12px] text-accent-200/90 font-mono whitespace-pre-wrap break-words min-h-[340px] overflow-auto leading-relaxed">{output}</pre>
        <p className="text-xs text-white/50 mt-3 leading-relaxed">
          Paste this into your page&apos;s <span className="font-mono text-white/60">&lt;head&gt;</span>. Then validate it with Google&apos;s Rich Results Test before you ship — a schema with a missing required field won&apos;t earn a rich result.
        </p>
      </div>
    </div>
  );
}
