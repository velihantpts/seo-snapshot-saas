import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function Privacy() {
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
        <h1 className="text-2xl font-medium tracking-tight mb-8">Privacy Policy</h1>
        <div className="prose-sm text-white/50 space-y-4 leading-relaxed">
          <p>Last updated: March 2026</p>
          <h2 className="text-white/80 font-medium text-base mt-6">What we collect</h2>
          <p>When you sign in, we store your name, email, and profile image from your OAuth provider. Analysis results (URL, score, issues) are stored to provide history.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">How we use it</h2>
          <p>Your data is used solely to provide the SEO Snapshot service — analysis history, scheduled monitoring, and account management.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">Third parties</h2>
          <p>We use Stripe for payments, Google/GitHub for authentication, and Google PageSpeed Insights API for performance data. We do not sell your data.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">Cookies</h2>
          <p>We use essential cookies for authentication session management. No tracking or advertising cookies.</p>
          <h2 className="text-white/80 font-medium text-base mt-6">Data deletion</h2>
          <p>You can delete your analyses from the dashboard. To delete your entire account, contact <a href="mailto:support@seosnapshot.dev" className="text-accent-400">support@seosnapshot.dev</a>.</p>
        </div>
      </div>
    </div>
  );
}
