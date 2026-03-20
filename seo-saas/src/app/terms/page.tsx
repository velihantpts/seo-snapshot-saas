'use client';
import { Navbar } from '@/components/Navbar';

export default function Terms() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
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
