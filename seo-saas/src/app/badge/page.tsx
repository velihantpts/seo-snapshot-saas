import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';

export const metadata: Metadata = {
  title: 'SEO Score Badge — Embed Your Score',
  description: 'Show off your SEO score with an embeddable badge. Copy the HTML or Markdown and add it to your site, README, or footer. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/badge' },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/tools" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">SEO Score Badge</h1>
        <p className="text-white/60 text-sm mb-8 max-w-xl">Proud of your score? Embed a live badge in your site footer, GitHub README, or docs. Copy the snippet below.</p>
        <Client />
      </div>
    </div>
  );
}
