import type { Metadata } from 'next';
import ToolsExplorer from './ToolsExplorer';
import { TOOLS } from '@/lib/tools-catalog';

export const metadata: Metadata = {
  title: 'Free SEO Tools — Generators, Checkers & Preview',
  description: 'A full toolkit of free SEO tools: security & HTTP header checkers, meta tag, schema & sitemap generators, SERP & Open Graph previews, UTM builder and more. No signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools' },
};

export default function ToolsPage() {
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free SEO Tools',
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://seosnapshot.dev/tools/${t.slug}`,
      name: t.title,
    })),
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <ToolsExplorer />
    </div>
  );
}
