import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function Terms() {
  return (
    <div className="min-h-screen bg-surface">
      <nav className="border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-xs">S</div>
            <span className="font-semibold tracking-tight">SEO <span className="text-accent-400">Snapshot</span></span>
          </Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight mb-8">Terms of Service</h1>
        <div className="prose-sm text-white/50 space-y-4 leading-relaxed">
          <p>Last updated: March 2026</p>
          <h2 className="text-white/80 font-medium text-base mt-6">1. Service</h2>
          <p>SEO Snapshot provides automated SEO analysis of web pages. Results are informational and should not be considered professional SEO advice.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">2. Usage</h2>
          <p>Free accounts are limited to 3 analyses per day. Pro accounts have higher limits. Abuse or automated scraping is prohibited.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">3. Payment</h2>
          <p>Pro subscriptions are billed monthly via Stripe. Lifetime purchases are one-time. Refunds available within 7 days of purchase.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">4. Data</h2>
          <p>Analysis results are stored to provide history features. We do not sell or share your data with third parties.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">5. Contact</h2>
          <p>Questions? Email <a href="mailto:support@seosnapshot.dev" className="text-accent-400">support@seosnapshot.dev</a></p>
        </div>
      </div>
    </div>
  );
}
