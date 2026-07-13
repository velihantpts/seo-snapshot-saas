import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free Open Graph Image Generator (1200×630 PNG)',
  description: 'Create a social share image (Open Graph / Twitter card) with your title, subtitle, and brand colors. Download a 1200×630 PNG. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/og-image-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What size should an Open Graph image be?', a: '1200 × 630 pixels is the standard. It fills the large link card on Facebook, LinkedIn, and X (Twitter) without cropping. Keep important text away from the very edges, since some platforms trim slightly.' },
  { q: 'How do I use the image once I download it?', a: 'Host the PNG on your site (e.g. /og/my-post.png), then reference it with the og:image meta tag and twitter:image. Use an absolute URL. The meta tag generator can write those tags for you.' },
  { q: 'Does the OG image affect SEO?', a: 'Not rankings directly — but it drives click-through when your link is shared, and shares and clicks are signals that help indirectly. A clear, branded card gets more clicks than a platform-guessed thumbnail or no image at all.' },
  { q: 'Is the image made on my device?', a: 'Yes. It is drawn entirely in your browser with a canvas and never uploaded anywhere. What you download is generated locally.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Open Graph Image Generator',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <ToolHeader />
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Design a clean social share image in seconds — type your title, pick a theme and accent, and download a ready-to-use 1200 × 630 PNG. Everything is generated in your browser.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">The image is the click</h2>
          <p>When your link gets shared, the preview card is what people actually see — and a page with no Open Graph image gets a broken-looking share or a random thumbnail. A simple, branded card with the title on it consistently earns more clicks than nothing at all, and it costs a minute to make.</p>
          <p>Once you have the PNG, preview how the full card will look with the <Link href="/tools/open-graph-preview" className="text-accent-400 hover:text-accent-300">Open Graph preview</Link>, and generate the <Link href="/tools/meta-tag-generator" className="text-accent-400 hover:text-accent-300">og:image tags</Link> to drop into your head.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
