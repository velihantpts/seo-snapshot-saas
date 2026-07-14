import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Scoring Methodology',
  description: "How SEO Snapshot scores a page: the weighted formula across 10 categories, every individual check, and what we deliberately don't measure.",
  alternates: { canonical: '/methodology' },
};

export default function Page() {
  return <Client />;
}
