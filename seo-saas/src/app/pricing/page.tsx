import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple SEO Snapshot pricing: a free plan with 5 analyses a day, Pro at $4.99/mo for unlimited audits and monitoring, and a $29.99 lifetime deal. No hidden fees.',
  alternates: { canonical: '/pricing' },
};

export default function Page() {
  return <Client />;
}
