import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms governing use of SEO Snapshot, covering the analysis service, account usage limits, Paddle billing and the 14-day refund policy, data handling, and contact details.',
  alternates: { canonical: '/terms' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Client />;
}
