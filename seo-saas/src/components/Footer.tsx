import Link from 'next/link';

const columns = [
  {
    title: 'Tools',
    links: [
      { href: '/', label: 'Analyze a URL' },
      { href: '/tools/open-graph-preview', label: 'Open Graph Preview' },
      { href: '/tools/serp-snippet-preview', label: 'SERP Snippet Preview' },
      { href: '/tools/meta-tag-generator', label: 'Meta Tag Generator' },
      { href: '/tools/schema-generator', label: 'Schema Generator' },
      { href: '/tools', label: 'All free tools →' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/data', label: 'State of SEO (data)' },
      { href: '/checks', label: 'SEO Checks' },
      { href: '/glossary', label: 'SEO Glossary' },
      { href: '/docs', label: 'API Docs' },
      { href: '/methodology', label: 'Methodology' },
      { href: '/vs/google-lighthouse', label: 'vs Google Lighthouse' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/pricing', label: 'Pricing' },
      { href: '/terms', label: 'Terms' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] mt-20 print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-xs">S</div>
              <span className="font-semibold text-sm">SEO <span className="text-accent-400">Snapshot</span></span>
            </Link>
            <p className="text-xs text-white/55 leading-relaxed">Free on-page SEO analysis with copy-paste fixes.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-medium text-white/60 mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-white/60 hover:text-white/70 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/[0.04] text-xs text-white/30">
          <span>© 2026 SEO Snapshot</span>
          <a href="mailto:seosnapshot.help@gmail.com" className="hover:text-white/50 transition-colors">seosnapshot.help@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
