import Link from 'next/link';

export interface FaqItem {
  q: string;
  a: string;
}

// Renders an on-page FAQ section AND injects FAQPage structured data so the
// tool pages are eligible for rich results — the tool "eats its own dog food".
export function ToolFaq({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
  return (
    <section className="mt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className="text-lg font-medium tracking-tight mb-5">Frequently asked questions</h2>
      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.q} className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-medium text-white/90 mb-1.5">{it.q}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{it.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Reusable funnel CTA — every tool solves one thing, this points to the full audit.
export function ToolCta({ label = 'Analyze any URL — 100 SEO checks, free' }: { label?: string }) {
  return (
    <div className="mt-12 glass-card rounded-xl p-6 text-center">
      <p className="text-white/60 text-sm mb-3">This tool fixes one thing. Want the full picture of a live page?</p>
      <Link href="/" className="btn-primary text-sm">{label}</Link>
    </div>
  );
}
