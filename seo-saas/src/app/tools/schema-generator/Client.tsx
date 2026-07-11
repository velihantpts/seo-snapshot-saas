'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, Plus, Trash2 } from 'lucide-react';

type SchemaType = 'Organization' | 'Article' | 'FAQPage' | 'Product' | 'WebSite' | 'LocalBusiness' | 'BreadcrumbList' | 'Event';

export default function SchemaGeneratorClient() {
  const [type, setType] = useState<SchemaType>('Organization');
  const [f, setF] = useState<Record<string, string>>({});
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([{ q: '', a: '' }]);
  const [crumbs, setCrumbs] = useState<{ name: string; url: string }[]>([{ name: '', url: '' }, { name: '', url: '' }]);
  const [copied, setCopied] = useState(false);

  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const field = 'w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

  const build = (): object => {
    const base: Record<string, unknown> = { '@context': 'https://schema.org', '@type': type };
    if (type === 'Organization') {
      if (f.name) base.name = f.name;
      if (f.url) base.url = f.url;
      if (f.logo) base.logo = f.logo;
      if (f.sameAs) base.sameAs = f.sameAs.split('\n').map(s => s.trim()).filter(Boolean);
    } else if (type === 'WebSite') {
      if (f.name) base.name = f.name;
      if (f.url) base.url = f.url;
      if (f.search) base.potentialAction = { '@type': 'SearchAction', target: `${f.url}?q={search_term_string}`, 'query-input': 'required name=search_term_string' };
    } else if (type === 'Article') {
      if (f.headline) base.headline = f.headline;
      if (f.image) base.image = f.image;
      if (f.author) base.author = { '@type': 'Person', name: f.author };
      if (f.date) base.datePublished = f.date;
      if (f.publisher) base.publisher = { '@type': 'Organization', name: f.publisher };
    } else if (type === 'Product') {
      if (f.name) base.name = f.name;
      if (f.image) base.image = f.image;
      if (f.description) base.description = f.description;
      if (f.brand) base.brand = { '@type': 'Brand', name: f.brand };
      if (f.price) base.offers = { '@type': 'Offer', price: f.price, priceCurrency: f.currency || 'USD', availability: 'https://schema.org/InStock' };
    } else if (type === 'FAQPage') {
      base.mainEntity = faqs.filter(x => x.q && x.a).map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } }));
    } else if (type === 'LocalBusiness') {
      if (f.name) base.name = f.name;
      if (f.url) base.url = f.url;
      if (f.telephone) base.telephone = f.telephone;
      if (f.image) base.image = f.image;
      if (f.priceRange) base.priceRange = f.priceRange;
      const addr: Record<string, string> = {};
      if (f.street) addr.streetAddress = f.street;
      if (f.city) addr.addressLocality = f.city;
      if (f.region) addr.addressRegion = f.region;
      if (f.postal) addr.postalCode = f.postal;
      if (f.country) addr.addressCountry = f.country;
      if (Object.keys(addr).length) base.address = { '@type': 'PostalAddress', ...addr };
    } else if (type === 'BreadcrumbList') {
      base.itemListElement = crumbs.filter(c => c.name).map((c, i) => ({
        '@type': 'ListItem', position: i + 1, name: c.name, ...(c.url ? { item: c.url } : {}),
      }));
    } else if (type === 'Event') {
      if (f.name) base.name = f.name;
      if (f.date) base.startDate = f.date;
      if (f.endDate) base.endDate = f.endDate;
      if (f.location) base.location = { '@type': 'Place', name: f.location, ...(f.address ? { address: f.address } : {}) };
      if (f.url) base.url = f.url;
      if (f.description) base.description = f.description;
    }
    return base;
  };

  const output = `<script type="application/ld+json">\n${JSON.stringify(build(), null, 2)}\n</script>`;
  const copy = () => { navigator.clipboard?.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const types: SchemaType[] = ['Organization', 'LocalBusiness', 'WebSite', 'Article', 'Product', 'FAQPage', 'BreadcrumbList', 'Event'];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map(tp => (
          <button key={tp} onClick={() => setType(tp)} className={`px-3 py-1.5 rounded-lg text-sm transition ${type === tp ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30' : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:text-white/70'}`}>{tp}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {type === 'Organization' && (<>
            <Input label="Name" v={f.name} on={v => set('name', v)} ph="Acme Inc" />
            <Input label="URL" v={f.url} on={v => set('url', v)} ph="https://acme.com" />
            <Input label="Logo URL" v={f.logo} on={v => set('logo', v)} ph="https://acme.com/logo.png" />
            <Area label="Social profiles (one URL per line)" v={f.sameAs} on={v => set('sameAs', v)} ph="https://twitter.com/acme&#10;https://linkedin.com/company/acme" />
          </>)}
          {type === 'WebSite' && (<>
            <Input label="Site name" v={f.name} on={v => set('name', v)} ph="Acme" />
            <Input label="URL" v={f.url} on={v => set('url', v)} ph="https://acme.com" />
            <Input label="Search URL prefix (optional)" v={f.search} on={v => set('search', v)} ph="enables sitelinks searchbox" />
          </>)}
          {type === 'Article' && (<>
            <Input label="Headline" v={f.headline} on={v => set('headline', v)} ph="How to do X" />
            <Input label="Image URL" v={f.image} on={v => set('image', v)} ph="https://…/cover.jpg" />
            <Input label="Author" v={f.author} on={v => set('author', v)} ph="Jane Doe" />
            <Input label="Date published" v={f.date} on={v => set('date', v)} ph="2026-07-09" />
            <Input label="Publisher" v={f.publisher} on={v => set('publisher', v)} ph="Acme" />
          </>)}
          {type === 'Product' && (<>
            <Input label="Name" v={f.name} on={v => set('name', v)} ph="Wireless Headphones" />
            <Input label="Image URL" v={f.image} on={v => set('image', v)} ph="https://…/product.jpg" />
            <Area label="Description" v={f.description} on={v => set('description', v)} ph="Short description" />
            <Input label="Brand" v={f.brand} on={v => set('brand', v)} ph="Acme" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Price" v={f.price} on={v => set('price', v)} ph="49.99" />
              <Input label="Currency" v={f.currency} on={v => set('currency', v)} ph="USD" />
            </div>
          </>)}
          {type === 'FAQPage' && (<div className="space-y-3">
            {faqs.map((x, i) => (
              <div key={i} className="glass-card rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Q{i + 1}</span>
                  {faqs.length > 1 && <button onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="text-white/25 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
                <input value={x.q} onChange={e => setFaqs(faqs.map((y, j) => j === i ? { ...y, q: e.target.value } : y))} placeholder="Question" className={field} />
                <textarea value={x.a} onChange={e => setFaqs(faqs.map((y, j) => j === i ? { ...y, a: e.target.value } : y))} placeholder="Answer" rows={2} className={field} />
              </div>
            ))}
            <button onClick={() => setFaqs([...faqs, { q: '', a: '' }])} className="flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-300"><Plus className="w-4 h-4" /> Add question</button>
          </div>)}
          {type === 'LocalBusiness' && (<>
            <Input label="Business name" v={f.name} on={v => set('name', v)} ph="Acme Coffee" />
            <Input label="Website URL" v={f.url} on={v => set('url', v)} ph="https://acme.coffee" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Phone" v={f.telephone} on={v => set('telephone', v)} ph="+1 555 123 4567" />
              <Input label="Price range" v={f.priceRange} on={v => set('priceRange', v)} ph="$$" />
            </div>
            <Input label="Image URL" v={f.image} on={v => set('image', v)} ph="https://…/storefront.jpg" />
            <Input label="Street address" v={f.street} on={v => set('street', v)} ph="123 Main St" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" v={f.city} on={v => set('city', v)} ph="Austin" />
              <Input label="Region/State" v={f.region} on={v => set('region', v)} ph="TX" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Postal code" v={f.postal} on={v => set('postal', v)} ph="78701" />
              <Input label="Country" v={f.country} on={v => set('country', v)} ph="US" />
            </div>
          </>)}
          {type === 'Event' && (<>
            <Input label="Event name" v={f.name} on={v => set('name', v)} ph="Product Launch 2026" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start date/time" v={f.date} on={v => set('date', v)} ph="2026-09-01T18:00" />
              <Input label="End date/time" v={f.endDate} on={v => set('endDate', v)} ph="2026-09-01T21:00" />
            </div>
            <Input label="Location name" v={f.location} on={v => set('location', v)} ph="Acme HQ / Online" />
            <Input label="Address (optional)" v={f.address} on={v => set('address', v)} ph="123 Main St, Austin, TX" />
            <Input label="Event URL" v={f.url} on={v => set('url', v)} ph="https://…/event" />
            <Area label="Description" v={f.description} on={v => set('description', v)} ph="Short description of the event" />
          </>)}
          {type === 'BreadcrumbList' && (<div className="space-y-3">
            <p className="text-xs text-white/60">Top-level page first, current page last.</p>
            {crumbs.map((c, i) => (
              <div key={i} className="glass-card rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Level {i + 1}</span>
                  {crumbs.length > 1 && <button onClick={() => setCrumbs(crumbs.filter((_, j) => j !== i))} className="text-white/25 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
                <input value={c.name} onChange={e => setCrumbs(crumbs.map((y, j) => j === i ? { ...y, name: e.target.value } : y))} placeholder="Name (e.g. Blog)" className={field} />
                <input value={c.url} onChange={e => setCrumbs(crumbs.map((y, j) => j === i ? { ...y, url: e.target.value } : y))} placeholder="https://example.com/blog" className={field} />
              </div>
            ))}
            <button onClick={() => setCrumbs([...crumbs, { name: '', url: '' }])} className="flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-300"><Plus className="w-4 h-4" /> Add level</button>
          </div>)}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/60">JSON-LD</span>
            <button onClick={copy} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition">
              {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words min-h-[300px] overflow-auto">{output}</pre>
          <p className="text-white/30 text-xs mt-2">Paste before <code className="text-accent-300">&lt;/head&gt;</code>. Validate with Google&apos;s Rich Results Test.</p>
          <div className="mt-4 glass-card rounded-lg p-4 text-center">
            <p className="text-white/50 text-sm mb-2">Check structured data on a live page</p>
            <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, v, on, ph }: { label: string; v?: string; on: (v: string) => void; ph?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1.5">{label}</label>
      <input value={v || ''} onChange={e => on(e.target.value)} placeholder={ph} className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30" />
    </div>
  );
}
function Area({ label, v, on, ph }: { label: string; v?: string; on: (v: string) => void; ph?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1.5">{label}</label>
      <textarea value={v || ''} onChange={e => on(e.target.value)} placeholder={ph} rows={3} className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30" />
    </div>
  );
}
