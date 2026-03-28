'use client';
import { useLocale } from '@/lib/i18n';


export default function Terms() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight mb-8">{t('terms.title')}</h1>
        <div className="prose-sm text-white/50 space-y-4 leading-relaxed">
          <p>Last updated: March 2026</p>
          <h2 className="text-white/80 font-medium text-base mt-6">1. Service</h2>
          <p>SEO Snapshot provides automated SEO analysis of web pages. Results are informational and should not be considered professional SEO advice.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">2. Usage</h2>
          <p>Free accounts are limited to 5 analyses per day. Pro accounts have higher limits. Abuse or automated scraping is prohibited.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">3. Payment</h2>
          <p>Pro subscriptions are billed monthly via Stripe. Lifetime purchases are one-time. Refunds available within 14 days of purchase, no questions asked.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">4. Data</h2>
          <p>Analysis results are stored to provide history features. We do not sell or share your data with third parties.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">5. Legal</h2>
          <p>SEO Snapshot is operated by <strong>Velihan Digital</strong>. By using this service, you agree to these terms.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">6. Contact</h2>
          <p>Questions? Email <a href="mailto:support@seosnapshot.dev" className="text-accent-400">support@seosnapshot.dev</a></p>
        </div>
      </div>
    </div>
  );
}
